import React, { useRef, useState } from "react";
import styled from "styled-components";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import sanitizeHtml from 'sanitize-html';
import ModifierButton from "./ModifierButton";

import "./TextArea.css"
import HyperLinkButton from "./HyperLinkButton";

type Props = {
    setValue: React.Dispatch<React.SetStateAction<string>>
    oldValue?: string
}

const TextArea = (props: Props) => {
    const refText = useRef<string>(props.oldValue ? props.oldValue : "")
    const handleChange = (e: ContentEditableEvent) => {
        refText.current = e.target.value
    }
    const sanitizeText = () => {
        refText.current = sanitizeHtml(refText.current, {
            allowedTags: ["b", "i", "em", "strong", "a", "p", "h1", "h2", "h3"],
            allowedAttributes: {a: ["href"]}
        })
        props.setValue(refText.current)
    }
    
    return (
        <Wrapper>
            <ContentEditable
                html={refText.current}
                disabled={false}
                onChange={handleChange}
                onBlur={sanitizeText}
                className="richEditor"
                id="richEditor"
            />
            <ButtonWrapper>
                <ModifierButton command="bold" name="N" textStyle={{isBold: true}}/>
                <ModifierButton command="italic" name="I" textStyle={{isItalic: true}}/>
                <ModifierButton command="underline" name="U" textStyle={{isUnderline: true}}/>
                <HyperLinkButton command="createLink" name="hyperlink"/>
                <ModifierButton command="formatBlock" arg="h1" name="Title 1"/>
                <ModifierButton command="formatBlock" arg="h2" name="Title 2"/>
                <ModifierButton command="formatBlock" arg="h3" name="Title 3"/>
            </ButtonWrapper>
        </Wrapper>
    )
}

export default TextArea;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60%;
    background: white;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    margin-top: 40px;
`
const DivAreaStyle = styled.div`
    width: 95%;
    height: 100%;
    margin-top: 10px;
    border-radius: 5px;
    min-height: 200px;
    text-align: left;
    padding: 10px;
`
const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    flex-wrap: wrap;
    width: 100%;
    padding: 10px;
    margin-left: 10px;
`
const Button = styled.button<{ state: boolean }>`
   background: ${props => props.state ? "black" : "white"};
   color: ${props => props.state ? "white" : "black"};
   border: 2px solid transparent;
   margin-right: 20px;
   font-size: 15px;
   cursor: pointer;
   &:hover {
    border: 2px solid ${props => props.state ? "white" : "black"};
   }
`