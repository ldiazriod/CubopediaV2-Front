import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

Modal.setAppElement("body")

type Props = {
    authToken: string;
    creator: string;
}

type PersonalCubeInfo = {
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

const GET_USER_CUBES = gql`
    query getCubesByUser($authToken: String!) {
        getCubesByUser(authToken: $authToken){
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
const ADD_CARD_CUBE = gql`
    mutation addCubeCard($info: CubeInput!){
        addCubeCard(info: $info)
    }
`

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

//getCubesByUser
const MyCubes = (props: Props): JSX.Element => {
    const {data, error, loading, refetch} = useQuery<{getCubesByUser: PersonalCubeInfo[]}>(GET_USER_CUBES, {
        variables: {
            authToken: props.authToken
        }
    })
    const [modal, setModal] = useState<boolean>(false)
    const [selectValue, setSelectValue] = useState<boolean | undefined>(undefined)
    const [addCube, setAddCube] = useState<boolean>(false)
    const [auxText, setAuxText] = useState<string>("")
    const [inputStates, setInputStates] = useState<boolean[]>([])
    const [cubeInfo, setCubeInfo] = useState<PersonalCubeInfo>({...defaultCubeState, creator: props.creator})
    const [addCubeMutation] = useMutation(ADD_CARD_CUBE, {
        variables: {
            info: cubeInfo
        },
        refetchQueries: [
            {query: GET_USER_CUBES}
        ]
    })
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setCubeInfo(defaultCubeState)
        setModal(false)
    }

    const onFinish = () => {
        const aux = Object.entries(cubeInfo).map(([key, value]) => {
            if(key !== "cubeModel" && key !== "cubeBrand" && key !== "cubeDesigner" && key !== "public"){
                if(value.toString().length !== 0){
                    if(selectValue && key === "cubeModName"){
                        return false
                    }
                    return false
                }
                return true
            }
            return false
        })
        setInputStates(aux)
        if(!aux.find((elem) => elem)){
            setCubeInfo({...cubeInfo, cardText: `<div>${auxText}</div>`})
            setAddCube(false)
            setTimeout(() => {
                addCubeMutation().then(() => {
                    refetch()
                })
            }, 500)
        }
    }
    return (
        <MainDivRe>
            <>
            {addCube &&
                <InputWrapper>
                    <RowInput width="45%">
                        <Input width="45%" state={inputStates[0]} type="text" placeholder="Cube Name" autoComplete="false" value={cubeInfo.cubeName} onChange={(e) => setCubeInfo({...cubeInfo, cubeName: e.target.value})}/>
                        <Input width="45%" state={inputStates[1]} type="text" placeholder="Cube Dimensions" autoComplete="false" value={cubeInfo.cubeDimensions} onChange={(e) => setCubeInfo({...cubeInfo, cubeDimensions: e.target.value})}/>
                    </RowInput>
                    <RowInputCheckbox>
                        <div><input type="checkbox" placeholder="Cube Dimensions" autoComplete="false" checked={selectValue} onChange={() => setSelectValue(true)}/>Yes</div>
                        <div><input type="checkbox" placeholder="Cube Dimensions" autoComplete="false"checked={!selectValue} onChange={() => setSelectValue(false)}/>No</div>
                    </RowInputCheckbox>
                    {selectValue &&
                        <Input width="auto" state={inputStates[2]} type="text" placeholder="Mod Name" autoComplete="false" value={cubeInfo.cubeModName} onChange={(e) => setCubeInfo({...cubeInfo, cubeModName: e.target.value})}/>
                    }
                    <RowInput width="30%">
                        <Input width="30%" state={inputStates[selectValue ? 3 : 2]} type="text" placeholder="Cube Model" autoComplete="false" value={cubeInfo.cubeModel} onChange={(e) => setCubeInfo({...cubeInfo, cubeModel: e.target.value})}/>
                        <Input width="30%" state={inputStates[selectValue ? 4 : 3]} type="text" placeholder="Cube Brand" autoComplete="false" value={cubeInfo.cubeBrand} onChange={(e) => setCubeInfo({...cubeInfo, cubeBrand: e.target.value})}/>
                        <Input width="30%" state={inputStates[selectValue ? 5 : 4]} type="text" placeholder="Cube Designer" autoComplete="false" value={cubeInfo.cubeDesigner} onChange={(e) => setCubeInfo({...cubeInfo, cubeDesigner: e.target.value})}/>
                    </RowInput>
                    <RowInput width="45%">
                        <Input width="45%" state={inputStates[selectValue ? 6 : 5]} type="text" placeholder="Title" autoComplete="false" value={cubeInfo.cardMainTitle} onChange={(e) => setCubeInfo({...cubeInfo, cardMainTitle: e.target.value})}/>
                        <Input width="45%" state={inputStates[selectValue ? 7 : 6]} type="file" accept="image/*" onChange={(e) => setCubeInfo({...cubeInfo, cardImg: URL.createObjectURL(e.target.files![0])})} style={{borderBottom: "trasparent"}}/>
                    </RowInput>
                    <TextArea setValue={setAuxText}/>
                    <FinishButton onClick={onFinish}>Finish</FinishButton>
                </InputWrapper>
            }
            {data && (data?.getCubesByUser.length!==0) &&  !addCube &&
                <CubeWrapper>
                    {data.getCubesByUser.map((elem) => {
                        return <SingleCubeCard onClick={() => [openModal(), setCubeInfo(elem)]}>
                            <strong>{elem.cardMainTitle}</strong>
                            <CardImg src={elem.cardImg} alt={`${elem.cubeName} img`}/>
                        </SingleCubeCard>
                    })}
                </CubeWrapper>
            }
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="Cube card"
            >
                <strong>{cubeInfo.cardMainTitle}</strong>
                <span>{parse(cubeInfo.cardText)}</span>
            </Modal>
            <GoBackButton state={addCube} onClick={(e) => [setAddCube(!addCube), setCubeInfo(defaultCubeState)]}>
                {!addCube ? 
                    "Add New Cube"
                    :
                    "Go back" 
                }
            </GoBackButton>
            </>
        </MainDivRe>
    )
}

export default MyCubes;
//grid-template-column: repeat(5, 1fr);

const CubeWrapper: StyledComponent<"div", any, {}, never> = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);    
    width: 100%;
    height: 100%;
`
const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
`
const RowInput = styled.div<{width: string}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 60%;
    height: auto;
    padding: 5px;
    margin-top: 20px;
    input {
        width: ${props => props.width};
        height: 30px;
        border: transparent;
        background: transparent;
        border-bottom: 3px solid #b31860;
        outline: none;
        color: black;
        &:focus {
            border-bottom: 3px solid #b31860ab
        }
    }
`
const Input = styled.input<{state: boolean, width: string}>`
    width: ${props => props.width};
    height: 30px;
    border: transparent;
    background: transparent;
    border-bottom: 3px solid ${props => props.state ? "red" : "#b31860"};
    outline: none;
    color: black;
    &:focus {
        border-bottom: 3px solid ${props => props.state ? "red" : "#b31860ab"};
    }
`
const RowInputCheckbox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 60%;
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