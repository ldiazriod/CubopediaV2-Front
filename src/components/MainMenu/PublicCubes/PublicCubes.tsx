import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

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
const PublicCubes = (): JSX.Element => {
    const [searchValues, setSeachValues] = useState<SearchValues>()
    const [page, setPage] = useState<number>(1)
    const {data, error, loading, refetch} = useQuery<{getPublicCubes: CubeInfo[]}>(SEARCH_PUBLIC_CUBES, {
        variables: {
            page: page,
            search: searchValues
        }
    })
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
            <input type="text" placeholder="Title" value={searchValues?.cardMainTitle} onChange={(e) => setSeachValues(searchValues ? {...searchValues, cardMainTitle: e.target.value} : {cardMainTitle: e.target.value})}/>
            {data && data.getPublicCubes.map((elem) => {
                return <div>
                    {elem.cardMainTitle}
                </div>
            })}
            {page > 1 && <button onClick={() => setPage(page-1)}>Prev</button>}
            <button onClick={() => setPage(page+1)}>Next</button>
        </div>
    )
}

export default PublicCubes;