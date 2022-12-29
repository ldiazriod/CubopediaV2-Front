import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

type Props = {
    creator: string
}

type SearchValues = {
    cardMainTitle?: string | undefined,
    cubeDimensions?: string | undefined,
    cubeName?: string | undefined,
    cardReviewPoints?: number | undefined
}

type CubeInfo = {
    _id?: string
    creator: string,
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

const defaultCubeState = {
    creator: "",
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
            creator,
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
const PublicCubes = (props: Props): JSX.Element => {
    const [searchValues, setSeachValues] = useState<SearchValues>()
    const [page, setPage] = useState<number>(1)
    const [modal, setModal] = useState<boolean>(false)
    const [cubeInfo, setCubeInfo] = useState<CubeInfo>({...defaultCubeState, creator: props.creator})
    const {data, error, loading, refetch} = useQuery<{getPublicCubes: CubeInfo[]}>(SEARCH_PUBLIC_CUBES, {
        variables: {
            page: page,
            search: searchValues
        }
    })

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
    if(loading){
        return <div>Loading...</div>
    }
    return (
        <div>
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="Cube card"
            >
                <strong>{cubeInfo.cardMainTitle}</strong>
                <span>{parse(cubeInfo.cardText)}</span>
                {props.creator !== cubeInfo.creator && 
                    <button>Clone</button>
                }
            </Modal>
            <input type="text" placeholder="Title" value={searchValues?.cardMainTitle} onChange={(e) => setSeachValues(searchValues ? {...searchValues, cardMainTitle: e.target.value} : {cardMainTitle: e.target.value})}/>
            <select name="dropdown" id="dropdown" onChange={(e) => setSeachValues(searchValues ? {...searchValues, cardReviewPoints: Number(e.target.value)} : {cardReviewPoints: Number(e.target.value)})}>
                <option value={5}>5 points</option>
                <option value={4}>4 points</option>
                <option value={3}>3 points</option>
                <option value={2}>2 points</option>
                <option value={1}>1 points</option>
                <option value={0}>0 points</option>
            </select>
            <CubeWrapper>
                {data && data.getPublicCubes.map((elem) => {
                    return <SingleCubeCard onClick={() => [setCubeInfo(elem), openModal()]}>
                        <strong>{elem.cardMainTitle}</strong>
                        <CreatorButton>{elem.creator}</CreatorButton>
                        <CardImg src={elem.cardImg} alt={`${elem.cubeName} img`}/>
                    </SingleCubeCard>
                })}
            </CubeWrapper>
            {page > 1 && <button onClick={() => setPage(page-1)}>Prev</button>}
            <button onClick={() => setPage(page+1)}>Next</button>
        </div>
    )
}

export default PublicCubes;

const CubeWrapper: StyledComponent<"div", any, {}, never> = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);    
    width: 100%;
    height: 100%;
`
const SingleCubeCard: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: auto;
    background: white;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    padding: 10px;
    margin: 20px;
`
const CardImg: StyledComponent<"img", any, {}, never> = styled.img`
    width: 90%;
    height: 200px;
`
const CreatorButton = styled.button`
    background: transparent;
    border: transparent;
    border-bottom: 1px solid black;
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
    transition: 0.45s;
    &:hover {
        border: 2px solid #b31860;
        color: #b31860;
        background: white;
    }
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