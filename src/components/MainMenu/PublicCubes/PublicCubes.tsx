import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

type Props = {
    creator: string
    authToken: string
}

type SearchValues = {
    cardMainTitle?: string | undefined,
    cubeDimensions?: string | undefined,
    cubeName?: string | undefined,
    cardReviewPoints?: number | undefined
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
    cardReviewPoints: number
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
    cardReviewPoints: 0,
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
            cardReviewPoints,
        }
    }
`
const CLONE_CUBE = gql`
    mutation cloneCube($input: CloneInfo!){
        cloneCube(input: $input)
    }
`
const PublicCubes = (props: Props): JSX.Element => {
    const [searchValues, setSeachValues] = useState<SearchValues>()
    const [page, setPage] = useState<number>(1)
    const [modal, setModal] = useState<boolean>(false)
    const [cubeInfo, setCubeInfo] = useState<CubeInfo>({...defaultCubeState, creator: {creatorId: props.creator, username: ""}})
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

    return (
        <MainDivRe>
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="Cube card"
            >
                <strong>{cubeInfo.cardMainTitle}</strong>
                <span>{parse(cubeInfo.cardText)}</span>
                {props.creator !== cubeInfo.creator.creatorId && 
                    <button onClick={() => cloneCube()}>Clone</button>
                }
            </Modal>
            <InputDisplay>
                <Input type="text" placeholder="Title" value={searchValues?.cardMainTitle} onChange={(e) => setSeachValues(searchValues ? {...searchValues, cardMainTitle: e.target.value} : {cardMainTitle: e.target.value})}/>
                <Select onChange={(e) => setSeachValues(searchValues ? {...searchValues, cardReviewPoints: Number(e.target.value)} : {cardReviewPoints: Number(e.target.value)})} value={searchValues ? searchValues.cardReviewPoints : starOptions[0]}>
                    {starOptions.map((elem) => {
                        return <option key={elem} value={elem}>
                            {`${elem} stars`}
                        </option>
                    })}
                </Select>
                <Select onChange={(e) => setSeachValues(searchValues ? {
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
                {data && data.getPublicCubes.map((elem) => {
                    return <SingleCubeCard>
                        <strong>{elem.cardMainTitle}</strong>
                        <CreatorButton>{elem.creator.username}</CreatorButton>
                        <div onClick={() => [setCubeInfo(elem), openModal()]} style={{width: "100%"}}>
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
`
const CreatorButton = styled.button`
    background: transparent;
    border: transparent;
    border-bottom: 1px solid black;
    margin-bottom: 10px;
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
    &:hover {
        border: 2px solid #b31860;
        color: ${props => props.state ? "white" : "#b31860"};
        background: ${props => props.state ? "#b31860" : "white"};
    }
`