import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";

import MainDiv from "../../../styles/globalStyles";
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


//getCubesByUser
const MyCubes = (props: Props): JSX.Element => {
    const defaultCubeState = {
        creator: props.creator,
        cubeName: "",
        cubeDimensions: "",
        cardMainTitle: "",
        cardText: "",
        cardReviewPoints: 0,
        cardImg: "",
        public: false
    }
    const {data, error, loading, refetch} = useQuery<{getCubesByUser: PersonalCubeInfo[]}>(GET_USER_CUBES, {
        variables: {
            authToken: props.authToken
        }
    })
    const [modal, setModal] = useState<boolean>(false)
    const [selectValue, setSelectValue] = useState<boolean | undefined>(undefined)
    const [addCube, setAddCube] = useState<boolean>(false)
    const [auxText, setAuxText] = useState<string>("")
    const [cubeInfo, setCubeInfo] = useState<PersonalCubeInfo>(defaultCubeState)
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

    return (
        <MainDiv>
            <>
            {addCube &&
                <InputWrapper>
                    <RowInput width="45%">
                        <input type="text" placeholder="Cube Name" autoComplete="false" value={cubeInfo.cubeName} onChange={(e) => setCubeInfo({...cubeInfo, cubeName: e.target.value})}/>
                        <input type="text" placeholder="Cube Dimensions" autoComplete="false" value={cubeInfo.cubeDimensions} onChange={(e) => setCubeInfo({...cubeInfo, cubeDimensions: e.target.value})}/>
                    </RowInput>
                    <RowInputCheckbox>
                        <div><input type="checkbox" placeholder="Cube Dimensions" autoComplete="false" checked={selectValue} onChange={(e) => setSelectValue(true)}/>Yes</div>
                        <div><input type="checkbox" placeholder="Cube Dimensions" autoComplete="false"checked={!selectValue} onChange={(e) => setSelectValue(false)}/>No</div>
                    </RowInputCheckbox>
                    {selectValue &&
                        <input type="text" placeholder="Mod Name" autoComplete="false" value={cubeInfo.cubeModName} onChange={(e) => setCubeInfo({...cubeInfo, cubeModName: e.target.value})}/>
                    }
                    <RowInput width="30%">
                        <input type="text" placeholder="Cube Model" autoComplete="false" value={cubeInfo.cubeModel} onChange={(e) => setCubeInfo({...cubeInfo, cubeModel: e.target.value})}/>
                        <input type="text" placeholder="Cube Brand" autoComplete="false" value={cubeInfo.cubeBrand} onChange={(e) => setCubeInfo({...cubeInfo, cubeBrand: e.target.value})}/>
                        <input type="text" placeholder="Cube Designer" autoComplete="false" value={cubeInfo.cubeDesigner} onChange={(e) => setCubeInfo({...cubeInfo, cubeDesigner: e.target.value})}/>
                    </RowInput>
                    <RowInput width="45%">
                        <input type="text" placeholder="Title" autoComplete="false" value={cubeInfo.cardMainTitle} onChange={(e) => setCubeInfo({...cubeInfo, cardMainTitle: e.target.value})}/>
                        <input type="file" accept="image/*" onChange={(e) => setCubeInfo({...cubeInfo, cardImg: URL.createObjectURL(e.target.files![0])})} style={{borderBottom: "trasparent"}}/>
                    </RowInput>
                    <TextArea setValue={setAuxText}/>
                    <FinishButton onClick={(e) => {
                        setCubeInfo({...cubeInfo, cardText: `<div>${auxText}</div>`})
                        setAddCube(false)
                        setTimeout(() => {
                            addCubeMutation().then(() => {
                                refetch()
                            })
                        }, 500)
                    }}>Finish</FinishButton>
                </InputWrapper>
            }
            {data && (data?.getCubesByUser.length!==0) &&  !addCube &&
                <CubeWrapper>
                    {data.getCubesByUser.map((elem) => {
                        return <SingleCubeCard onClick={(e) => [openModal(), setCubeInfo(elem)]}>
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
                {!addCube && "Add New Cube"}
                {addCube && "Go back"}
            </GoBackButton>
            </>
        </MainDiv>
    )
}

export default MyCubes;
//grid-template-column: repeat(5, 1fr);

const CubeWrapper: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: row
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