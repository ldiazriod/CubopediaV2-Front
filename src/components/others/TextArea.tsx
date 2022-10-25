import React, {useState, useEffect} from "react";
import styled from "styled-components";

type Props = {
    setValue:  React.Dispatch<React.SetStateAction<string>>
}

const TextArea = (props: Props) => {
    const [textEvent, setTextEvent] = useState<{text: string, e: React.ChangeEvent<HTMLTextAreaElement> | undefined}>({text: "", e: undefined});
    const [textModifier, setTextModifier] = useState<boolean[]>([false, false, false])
    const setModifierValues = (index: number) => {
        setTextModifier(textModifier.map((elem, i) => {
            return i===index ? !elem : elem
        }))
    }
    return(
        <Wrapper>
            <TextAreaStyle value={textEvent.text} onChange={(e) =>[setTextEvent({text: e.target.value, e: e}), props.setValue(textEvent.text.toString())]}/>
            <ButtonWrapper>
                <Button state={textModifier[0]} onClick={(e) => {
                    setTextEvent({text: textEvent.text + (textModifier[0] ? "</strong>" : "<strong>"), e: (textEvent.e ? textEvent.e : undefined)})
                    setModifierValues(0);
                }}
                ><strong>N</strong></Button>
                <Button state={textModifier[1]}onClick={(e) => {
                    setTextEvent({text: textEvent.text + (textModifier[1] ? "</i>" : "<i>"), e: (textEvent.e ? textEvent.e : undefined)})
                    setModifierValues(1);
                }}
                ><i>C</i></Button>
                <Button state={textModifier[2]} onClick={(e) => {
                    setTextEvent({text: textEvent.text + (textModifier[2] ? "</u>" : "<u>"), e: (textEvent.e ? textEvent.e : undefined)})
                    setModifierValues(2);
                }}
                ><u>S</u></Button>
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
const TextAreaStyle = styled.textarea`
    width: 95%;
    margin-top: 10px;
    border-radius: 5px;
    height: 200px;
    resize: none;
`
const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    width: 40%;
    padding: 10px;
    margin-left: 10px;
`
const Button = styled.button<{state: boolean}>`
   background: ${props => props.state ? "black" : "white"};
   color: ${props => props.state ? "white" : "black"};
   margin-right: 20px;
   border: transparent;
   font-size: 15px;
`