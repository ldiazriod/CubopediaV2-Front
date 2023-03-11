import React from "react";
import styled from "styled-components";

type Props = {
    loading: boolean
}

const Loader = (props: Props) =>
    <DivOverlay state={props.loading}>
        <Load />
    </DivOverlay>

export default Loader

const DivOverlay = styled.div<{ state: boolean }>`
    position: fixed;
    display: ${props => props.state ? "block" : "none"};
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 2;
    cursor: pointer; 
`
const Load = styled.span`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    position: relative;
    top: 50%;
    ::before, ::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #642ea2;
        animation: slide 1s infinite linear alternate;
        opacity: 0.5;
    }
    ::after {
        background:#b31860;
        animation: slide2 1s infinite linear alternate;
        opacity: 1;
    }
    @keyframes slide {
        0% , 20% {  transform: translate(0, 0)  }
        80% , 100% { transform: translate(15px, 15px) }
    }
    @keyframes slide2 {
        0% , 20% {  transform: translate(0, 0) }
        80% , 100% { transform: translate(-15px, -15px) }
    }
`