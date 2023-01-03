import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";
import Profile from "../Profile/Profile";
import ReviewStars from "../../others/ReviewStars";

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

const SEARCH_PUBLIC_CUBES = gql`
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
const CLONE_CUBE = gql`
    mutation cloneCube($input: CloneInfo!){
        cloneCube(input: $input)
    }
`
const GET_REVIEW = gql`
query getReview($input: GetReviewInput!){
    getReview(input: $input){
        reviewed,
        reviewValue
    }
}
`
const PublicCubes = (props: Props): JSX.Element => {
    const [searchValues, setSearchValues] = useState<SearchValues>()
    const [page, setPage] = useState<number>(1)
    const [modal, setModal] = useState<boolean>(false)
    const [cubeInfo, setCubeInfo] = useState<CubeInfo>({...defaultCubeState, creator: {creatorId: props.creator, username: ""}})
    const [toProfile, setToProfile] = useState<{profile: boolean, creator: string}>({profile: false, creator: ""})
    const [getReview, responseGetReview] = useLazyQuery(GET_REVIEW)
    const {data, error, loading, refetch} = useQuery<{getPublicCubes: CubeInfo[]}>(SEARCH_PUBLIC_CUBES, {
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
    const starOptions: number[] = [0,1,2,3,4,5]
    const typeOptions: string[] = ["Normal", "Modded"]
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }

    useEffect(() => {
        refetch()
    }, [page, searchValues])

    if(error){
        return <div>{`Error: ${error}`}</div>
    }

    if(toProfile.profile){
        return <Profile creator={toProfile.creator} authToken={props.authToken}/>
    }
    return (
        <MainDivRe>
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="CubeCard"
                className="ModalP"
                overlayClassName="Overlay"
            >
                <strong>{cubeInfo.cardMainTitle}</strong>
                <span>{parse(cubeInfo.cardText)}</span>
                {props.creator !== cubeInfo.creator.creatorId && 
                    <button onClick={() => cloneCube()}>Clone</button>
                }
                    {responseGetReview.data ?
                        <>
                            {responseGetReview.data.getReview.reviewed ? <div>
                                Your review
                                <ReviewStars starValue={responseGetReview.data.getReview.reviewValue} editable={!responseGetReview.data.getReview.reviewed}/>
                            </div> : <div>
                                Add review
                                <ReviewStars starValue={responseGetReview.data.getReview.reviewValue} editable={!responseGetReview.data.getReview.reviewed} cubeId={cubeInfo._id} userId={props.creator}/>
                            </div>
                            }
                        </>
                        :
                        <ReviewStars starValue={0} editable={false}/>
                    }
            </Modal>
            <InputDisplay>
                <Input type="text" placeholder="Title" value={searchValues?.cardMainTitle} onChange={(e) => setSearchValues(searchValues ? {...searchValues, cardMainTitle: e.target.value} : {cardMainTitle: e.target.value})}/>
                <Select onChange={(e) =>  setSearchValues(searchValues ? {...searchValues, cardMainTitle: e.target.value} : {cardMainTitle: e.target.value})} value={searchValues ? searchValues.cardReviewPoints : starOptions[0]}>
                    <option value={-1}>Select Num Stars</option>
                    {starOptions.map((elem) => {
                        return <option key={elem} value={elem===0 ? elem : elem-1}>
                            {`${elem} stars`}
                        </option>
                    })}
                </Select>
                <Select onChange={(e) => setSearchValues(searchValues ? {
                        ...searchValues, cubeType: e.target.value === "Normal" ? false : true
                    } : {
                        cubeType: e.target.value === "Normal" ? false : true})
                    } value={searchValues ? (searchValues.cubeType === false ? "Normal" : "Modded") : "Normal"}
                >
                    {typeOptions.map((elem, i) => {
                        return <option key={i*20} value={elem}>
                            {elem}
                        </option>
                    })}
                </Select>
            </InputDisplay>
            <CubeWrapper>
                {data && data.getPublicCubes.map((elem, i) => {
                    return <SingleCubeCard key={i*10}>
                        <strong>{elem.cardMainTitle}</strong>
                        <CreatorButton onClick={() => setToProfile({profile: true, creator: elem.creator.creatorId})}>{elem.creator.username}</CreatorButton>
                        <ReviewContainer>
                            <ReviewStars starValue={elem.cardReviewPoints.reviewMean} editable={false}/>
                            <div>{`(${elem.cardReviewPoints.reviews.length})`}</div>
                        </ReviewContainer>
                        <div onClick={() => [setCubeInfo(elem), getReview({variables: {input: {cubeId: elem._id, authToken: props.authToken}}}) ,openModal()]} style={{width: "100%"}}>
                            <CardImg src={`${process.env.REACT_APP_IMG_API_URL}/${elem.cardImg}`} alt={`${elem.cubeName} img`}/>
                        </div>
                    </SingleCubeCard>
                })}
            </CubeWrapper>
            {page > 1 && <button onClick={() => setPage(page-1)}>Prev</button>}
            <FinishButton onClick={() => setPage(page+1)}>Next</FinishButton>
        </MainDivRe>
    )
}

export default PublicCubes;

const CubeWrapper: StyledComponent<"div", any, {}, never> = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);    
    width: 100%;
    height: fit-content;
`
const SingleCubeCard: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: fit-content;
    background: white;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 30px;
`
const InputDisplay = styled.div`
    display: flex;
    align-items: center;
`
const CardImg: StyledComponent<"img", any, {}, never> = styled.img`
    width: 90%;
    height: 200px;
    cursor: pointer;
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
const GoBackButton = styled.button<{state: boolean}>`
    background: ${props => props.state ? "white" : "#b31860"};
    border: 2px solid #b31860;
    color: ${props => props.state ? "#b31860" : "white" };
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
        color: ${props => props.state ? "white" : "#b31860"};
        background: ${props => props.state ? "#b31860" : "white"};
    }
`