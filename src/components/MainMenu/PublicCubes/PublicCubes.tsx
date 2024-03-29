import React, { useState, useEffect } from "react";
import styled from "styled-components"
import { DocumentNode, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import { MainDivRe } from "../../../styles/globalStyles";
import Profile from "../Profile/Profile";
import ReviewStars from "../../others/ReviewStars";
import Loader from "../../others/Loader";
import { isMobile } from "../../../mediaQueries/queriesStates";
import { CardImg, SingleCubeCard } from "../../../styles/CubeCardStyles";
import { modalResponsive, modalStyle } from "../../../styles/modalStyles";

type Props = {
    creator: string
    authToken: string
}

type SearchValues = {
    cardMainTitle?: string | undefined,
    cubeDimensions?: string | undefined,
    cubeName?: string | undefined,
    cardReviewPoints?: number | undefined,
    cubeType?: boolean | undefined
}

type CubeInfo = {
    _id?: string
    creator: {
        creatorId: string,
        username: string,
    },
    cubeName: string,
    cubeDimensions: string,
    cubeModName?: string,
    cubeModel?: string,
    cubeBrand?: string
    cubeDesigner?: string
    cardMainTitle: string
    cardText: string
    cardImg: string
    cardReviewPoints: {
        reviewMean: number,
        reviews: string[]
    }
    public?: boolean
}

const defaultSearchState: SearchValues = {
    cardMainTitle: "",
    cubeDimensions: "",
    cubeType: false
}

const defaultCubeState: CubeInfo = {
    creator: {
        creatorId: "",
        username: ""
    },
    cubeName: "",
    cubeDimensions: "",
    cardMainTitle: "",
    cardText: "",
    cardReviewPoints: {
        reviewMean: 0,
        reviews: []
    },
    cardImg: "",
    public: false
}

const SEARCH_PUBLIC_CUBES: DocumentNode = gql`
    query getPublicCubes($page: Int!, $search: PublicSearch){
        getPublicCubes(page: $page, search: $search){
            _id,
            creator {
                creatorId,
                username
            },
            cubeName,
            cubeDimensions,
            cubeModName,
            cubeModel,
            cubeBrand,
            cubeDesigner, 
            cardMainTitle,
            cardText,
            cardImg,       
            cardReviewPoints{
                reviewMean,
                reviews
            },
        }
    }
`
const CLONE_CUBE: DocumentNode = gql`
    mutation cloneCube($input: CloneInfo!){
        cloneCube(input: $input)
    }
`
const GET_REVIEW: DocumentNode = gql`
query getReview($input: GetReviewInput!){
    getReview(input: $input){
        reviewed,
        reviewValue
    }
}
`
const PublicCubes = (props: Props): JSX.Element => {
    const isMobileState = isMobile()
    const [searchValues, setSearchValues] = useState<SearchValues>(defaultSearchState)
    const [page, setPage] = useState<number>(1)
    const [modal, setModal] = useState<boolean>(false)
    const [cubeInfo, setCubeInfo] = useState<CubeInfo>({ ...defaultCubeState, creator: { creatorId: props.creator, username: "" } })
    const [toProfile, setToProfile] = useState<{ profile: boolean, creator: string }>({ profile: false, creator: "" })
    const [getReview, responseGetReview] = useLazyQuery(GET_REVIEW)
    const { data, error, loading, refetch } = useQuery<{ getPublicCubes: CubeInfo[] }>(SEARCH_PUBLIC_CUBES, {
        variables: {
            page: page,
            search: searchValues
        }
    })
    const [cloneCube] = useMutation(CLONE_CUBE, {
        variables: {
            input: {
                id: cubeInfo._id,
                authToken: props.authToken
            }
        }
    })
    const starOptions: number[] = [0, 1, 2, 3, 4, 5]
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }

    useEffect(() => {
        refetch()
    }, [page, searchValues])

    if (error) {
        return <div>{`Error: ${error}`}</div>
    }


    if (toProfile.profile) {
        return (
            <>
                <GoBackButton onClick={() => setToProfile({ profile: false, creator: "" })}>Go Back</GoBackButton>
                {props.creator === toProfile.creator ? <Profile creator={toProfile.creator} authToken={props.authToken} /> : <Profile creator={toProfile.creator} />}
            </>
        )
    }
    return (
        <MainDivRe>
            <Loader loading={loading} />
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                style={isMobileState ? modalResponsive : modalStyle}
                contentLabel="CubeCard"
            >
                <ModalWrapper>
                    <CardTitle>{cubeInfo.cardMainTitle}</CardTitle>
                    <CardText>{parse(cubeInfo.cardText)}</CardText>
                    {(props.creator !== cubeInfo.creator.creatorId) &&
                        <FinishButton onClick={() => cloneCube().then(() => refetch())}>Clone</FinishButton>
                    }
                    {responseGetReview.data ?
                        <>
                            {responseGetReview.data.getReview.reviewed ? <div>
                                Your review
                                <ReviewStars starValue={responseGetReview.data.getReview.reviewValue - 1} editable={!responseGetReview.data.getReview.reviewed} />
                            </div> : <div>
                                Add review
                                <ReviewStars starValue={responseGetReview.data.getReview.reviewValue - 1} editable={!responseGetReview.data.getReview.reviewed} cubeId={cubeInfo._id} userId={props.creator} closeModal={closeModal} refetch={refetch} />
                            </div>
                            }
                        </>
                        :
                        <ReviewStars starValue={0} editable={false} />
                    }
                </ModalWrapper>
            </Modal>
            <InputDisplay state={isMobileState}>
                <Input type="text" placeholder="Title" value={searchValues ? searchValues.cardMainTitle : ""} onChange={(e) => setSearchValues(searchValues ? { ...searchValues, cardMainTitle: e.target.value } : { cardMainTitle: e.target.value })} />
                <Input type="text" placeholder="Dimensions" value={searchValues ? searchValues.cubeDimensions : ""} onChange={(e) => setSearchValues(searchValues ? { ...searchValues, cubeDimensions: e.target.value } : { cubeDimensions: e.target.value })} />
            </InputDisplay>
            <InputDisplay state={isMobileState}>
                <Input type="text" placeholder="Cube Name" value={searchValues ? searchValues.cubeName : ""} onChange={(e) => setSearchValues(searchValues ? { ...searchValues, cubeName: e.target.value } : { cubeName: e.target.value })} />
                <InputDisplay state={false}>
                    <Select onChange={(e) => setSearchValues(searchValues ? { ...searchValues, cardReviewPoints: Number(e.target.value) } : { cardReviewPoints: Number(e.target.value) })} value={searchValues ? searchValues.cardReviewPoints : starOptions[0]}>
                        {starOptions.map((elem) => <option key={elem} value={elem}>
                            {`${elem} stars`}
                        </option>)}
                    </Select>
                    <Select onChange={(e) => [setSearchValues({ ...searchValues, cubeType: e.target.value === "Normal" ? false : true }), console.log(searchValues.cubeType)]} value={searchValues.cubeType === false ? "Normal" : "Modded"}>
                        <option value={"Normal"} selected>Normal</option>
                        <option value={"Modded"}>Modded</option>
                    </Select>
                </InputDisplay>
            </InputDisplay>
            <CubeWrapper state={isMobileState}>
                {data && data.getPublicCubes.map((elem, i) => <SingleCubeCard key={i * 10} state={isMobileState}>
                    <strong>{elem.cardMainTitle}</strong>
                    <CreatorButton onClick={() => setToProfile({ profile: true, creator: elem.creator.creatorId })}>{elem.creator.username}</CreatorButton>
                    <ReviewContainer>
                        <ReviewStars starValue={elem.cardReviewPoints.reviewMean - 1} editable={false} />
                        <div>{`(${elem.cardReviewPoints.reviews.length})`}</div>
                    </ReviewContainer>
                    <div onClick={() => [setCubeInfo(elem), getReview({ variables: { input: { cubeId: elem._id, authToken: props.authToken } } }), openModal()]} style={{ width: "100%" }}>
                        <CardImg src={`${process.env.REACT_APP_IMG_API_URL}/${elem.cardImg}`} alt={`${elem.cubeName} img`} />
                    </div>
                </SingleCubeCard>)}
            </CubeWrapper>
            {page > 1 && <button onClick={() => setPage(page - 1)}>Prev</button>}
            {(data && data.getPublicCubes.length === 20) && <FinishButton onClick={() => setPage(page + 1)}>Next</FinishButton>}
        </MainDivRe>
    )
}

export default PublicCubes;

const CubeWrapper = styled.div<{state: boolean}>`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: ${props => props.state ? "center" : "normal"};
    gap: 20px;
    width: 90%;
    height: 100%;
`
const InputDisplay = styled.div<{ state: boolean }>`
    display: flex;
    align-items: center;
    flex-direction: ${props => props.state ? "column" : "row"};
`
const ModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`
const CardTitle = styled.strong`
    font-size: 25px;
    margin-bottom: 10px;
`
const CardText = styled.span`
    height: 90%;
    min-height: 90%;
`
const ReviewContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`
const CreatorButton = styled.button`
    background: transparent;
    border: transparent;
    border-bottom: 1px solid black;
    margin-bottom: 3px;
    cursor: pointer;
`
const FinishButton = styled.button`
    background: #b31860;
    border: 2px solid #b31860;
    color: white;
    width: 20%;
    padding: 10px 25px 10px 25px;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
`
const Input = styled.input`
    border: 1px solid transparent;
    width: 300px;
    margin: 10px;
    padding: 15px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 16px;
    &:focus{
        outline: none;
    }
`
const Select = styled.select`
    border: 1px solid transparent;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    width: 100px;
    height: 50px;
    margin-left: 20px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
`
const GoBackButton = styled.button`
    background: white;
    border: 2px solid #b31860;
    color: #b31860;
    width: 20%;
    padding: 10px 25px 10px 25px;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    transition: 0.45s;
    cursor: pointer;
    &:hover {
        border: 2px solid #b31860;
        color:#b31860;
        background: white;
    }
`