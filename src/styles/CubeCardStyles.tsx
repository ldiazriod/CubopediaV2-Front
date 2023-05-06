import React from "react"
import styled from "styled-components"

export const SingleCubeCard = styled.div<{state: boolean}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${props => props.state ? "200px" : "300px"};
    height: fit-content;
    background: white;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 30px;
`
export const CardImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
`