import React, {useState} from "react";
import styled from "styled-components";

type Props = {
    command: string
    arg?: string
    name?: string
    textStyle?: {
        isBold?: boolean | undefined,
        isItalic?: boolean | undefined,
        isUnderline?: boolean | undefined
    }
}

const ModifierButton = (props: Props) => {
    const [buttonState, setButtonState] = useState<boolean>(false)

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const selection = window.getSelection()
        const valid = document.execCommand(props.command, false, props.arg)
        if(selection?.isCollapsed && valid){
            setButtonState(!buttonState)
        }
    }
    return (
        <Button key={props.command} state={buttonState} textStyle={props.textStyle} onClick={(e) => handleOnClick(e)}>
            {props.name ?? props.command}
        </Button>
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
export default ModifierButton