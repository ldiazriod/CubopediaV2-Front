import { ApolloQueryResult, gql, OperationVariables, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import styled from "styled-components";

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

type Props = {
    starValue: number,
    editable: boolean,
    cubeId?: string,
    userId?: string
    closeModal?: () => void
    refetch?: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<{
        getPublicCubes: CubeInfo[];
    }>>
}
const ADD_REVIEW = gql`
    mutation addReview($input: ReviewInput!){
        addReview(input: $input)
    }
`
const ReviewStars = (props: Props) => {
    const [starValue, setStarValue] = useState<number>(props.starValue)
    const [editable, setEditable] = useState<boolean>(props.editable)
    const [addReview] = useMutation(ADD_REVIEW)
    return (
        <div>
            {new Array(5).fill(0).map((_,i) => {
                return <Button index={i} value={starValue} onClick={() =>{
                    if(editable){
                        setStarValue(i)
                        addReview({variables: {input: {userId: props.userId, cubeId: props.cubeId, points: i+1}}})
                        if(props.closeModal){
                            props.closeModal()
                        }
                        if(props.refetch){
                            props.refetch()
                        }
                        setEditable(false)
                    }
                }}>
                    <span style={{fontSize: "20px"}}>&#9733;</span>
                </Button>
            })}
        </div>
    )
}

export default ReviewStars

const Button = styled.button<{value: number, index: number}>`
    background: transparent;
    border: none;
    outline: none;
    color: ${props => props.index <= props.value ? "#000" : "#ccc"};
`
