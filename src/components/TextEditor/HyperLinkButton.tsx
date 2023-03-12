import React, {useState} from "react";
import styled from "styled-components";
import validator from "validator";

type Props = {
    command: string
    name?: string
    textStyle?: {
        isBold?: boolean | undefined,
        isItalic?: boolean | undefined,
        isUnderline?: boolean | undefined
    }
}

const HyperLinkButton = (props: Props) => {
    const [showLinkInput, setShowLinkInput] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>("")
    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(validator.isURL(inputValue)){
            const a = document.execCommand(props.command, false, inputValue) 
            console.log(a)
        }
        setInputValue("")
        setShowLinkInput(false)
    }
    return (
        <>
        <Button key={props.command} state={false} textStyle={props.textStyle} onClick={() => setShowLinkInput(true)}>
            {props.name ?? props.command}
        </Button>
        {showLinkInput && 
            <>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <Button state={false} onClick={(e) => handleOnClick(e) }>Add</Button>
            </>
        }
        </>
    )
}

const Button = styled.button<{ state: boolean, textStyle?: {isBold?: boolean, isItalic?: boolean, isUnderline?: boolean} }>`
   background: ${props => props.state ? "black" : "white"};
   color: ${props => props.state ? "white" : "black"};
   border: 2px solid transparent;
   margin-right: 20px;
   font-size: 15px;
   font-weight: ${props => props.textStyle ? (props.textStyle.isBold ? "bold" : "normal") : "normal"};
   font-style: ${props => props.textStyle ? (props.textStyle.isItalic ? "italic" : "normal") : "normal"};
   text-decoration: ${props => props.textStyle ? (props.textStyle.isUnderline ? "underline" : "none") : "none"};
   cursor: pointer;
   &:hover {
    border: 2px solid ${props => props.state ? "white" : "black"};
   }
`
export default HyperLinkButton