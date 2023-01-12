import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { gql, useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import Modal from "react-modal";
import parse from "html-react-parser";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";
import "./modal.css"
import Loader from "../../others/Loader";

Modal.setAppElement("body")

type Props = {
    authToken: string;
    creator: string;
}

type PersonalCubeInfo = {
    _id?: string
    creator: {
        creatorId: string,
        username: string
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
    public: boolean
}

const GET_USER_CUBES = gql`
    query getCubesByUser($authToken: String!) {
        getCubesByUser(authToken: $authToken){
            _id,
            creator{
                creatorId,
                username
            },
            cubeName,
            cubeDimensions,
            cubeModName,
            cubeModel,
            cubeBrand,
            cubeDesigner, 
            cardMainTitle,
            cardText,
            cardImg,       
            cardReviewPoints{
                reviewMean,
                reviews
            },
            public
        }
    }
`
const ADD_CARD_CUBE = gql`
    mutation addCubeCard($info: CubeInput!){
        addCubeCard(info: $info)
    }
`
const MAKE_PUBLIC = gql`
    mutation makePublic($id: ID!){
        makePublic(id: $id)
    }
`
const DELETE_CUBE = gql`
    mutation deleteCube($id: ID!){
        deleteCube(id: $id)
    }
`
const UPDATE_CUBE = gql`
    mutation changeCube($input: UpdateCubeInput!){
        changeCube(input: $input)
    }
`
const defaultCubeState: PersonalCubeInfo = {
    creator: {
        creatorId: "",
        username: ""
    },
    cubeName: "",
    cubeDimensions: "",
    cardMainTitle: "",
    cardText: "",
    cardReviewPoints: {
        reviewMean: 0,
        reviews: []
    },
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
    const [selectValue, setSelectValue] = useState<boolean>(false)
    const [addCube, setAddCube] = useState<boolean>(false)
    const [auxText, setAuxText] = useState<string>("")
    const [inputStates, setInputStates] = useState<boolean[]>([])
    const [cubeInfo, setCubeInfo] = useState<PersonalCubeInfo>({...defaultCubeState, creator: {creatorId: props.creator, username: ""}})
    const [loadingCard, setLoadingCard] = useState<boolean>(false)
    const [changeCube] = useMutation(UPDATE_CUBE, {
        variables: {
            input: {...cubeInfo, cardText: auxText, cardReviewPoints: 0}
        }
    })
    const [deleteCube] = useMutation(DELETE_CUBE, {
        variables: {
            id: cubeInfo._id
        },
        refetchQueries: [
            {query: GET_USER_CUBES}
        ]
    })
    const [makePublicMutation] = useMutation(MAKE_PUBLIC, {
        variables: {
            id: cubeInfo._id
        }
    })
    const [addCubeMutation] = useMutation(ADD_CARD_CUBE, {
        variables: {
            info: {...cubeInfo, creator: props.creator, cardReviewPoints: 0}
        },
        refetchQueries: [
            {query: GET_USER_CUBES}
        ]
    })
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }

    useEffect(()=> {
        refetch()
    },[])

    const onFinish = async() => {
        setLoadingCard(true)
        let auxCube = {...cubeInfo, cardText: auxText}
        const newFileForm = new FormData()
        if(cubeInfo.cardImg.length === 0){
            const imgElement: HTMLInputElement = document.getElementById("imgInput") as HTMLInputElement;
            if(imgElement !== null && imgElement.files !== null){
                const file = imgElement.files![0]
                const newName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}-${props.creator}.${file.type.split("/")[1]}`
                const blob = file.slice(0, file.size, file.type)
                newFileForm.append("upload", blob, newName)
                auxCube={...auxCube, cardImg: newName, cardText: `<div>${auxText} </div>`}
                console.log(auxCube)
            }
        }
        setCubeInfo(auxCube)
        const aux = Object.entries(auxCube).map(([key, value]) => {
            if(key !== "cubeModel" && key !== "cubeBrand" && key !== "cubeDesigner" && key !== "public"){
                if(selectValue && key === "cubeModName"){
                    if(value !== null){
                        if(value.toString().length !== 0){
                            return false
                        }
                        return true
                    }
                    return true
                }
                if(key !== "cubeModName" && value.toString().length !== 0){
                    return false
                }
                if(key==="cardText"){
                    if(auxText.length === 0){
                        return true
                    }
                    return false
                }
                return false
            }
            return false
        })
        if(!aux.find((elem) => elem)){
            if(cubeInfo.cardImg.length === 0 && !cubeInfo._id){
                await addCubeMutation({variables: {info: {...auxCube, creator: props.creator, cardReviewPoints: 0}}}).then(async() => {
                    await axios.post(`${process.env.REACT_APP_IMG_API_URL}/upload`, newFileForm)
                    refetch()
                })
            }else{
                await changeCube().then(() => refetch())
            }
            setLoadingCard(false)
            setAddCube(false)
        }
    }
    if(error){
        return <div>{`${error}`}</div>
    }
    return (
        <MainDivRe>
            <>
                <Loader loading={loadingCard || loading}/>
                <GoBackButton state={addCube} onClick={() => [setAddCube(!addCube), setCubeInfo(defaultCubeState)]}>
                    {!addCube ? "Add New Cube" : "Go back" }
                </GoBackButton>
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
                            {cubeInfo.cardImg.length === 0 &&
                                <Input width="45%" id="imgInput" state={inputStates[selectValue ? 7 : 6]} type="file" accept="image/*" style={{borderBottom: "trasparent"}}/>
                            }
                        </RowInput>
                        {cubeInfo.cardText.length !== 0 ? 
                            <TextArea setValue={setAuxText} oldValue={cubeInfo.cardText}/>
                            :
                            <TextArea setValue={setAuxText}/>
                        }
                        <FinishButton onClick={onFinish}>Finish</FinishButton>
                    </InputWrapper>
                }
                {data && (data?.getCubesByUser.length!==0) &&  !addCube &&
                    <CubeWrapper>
                        {data.getCubesByUser.map((elem, i) => {
                            return <SingleCubeCard onClick={() => [openModal(), setCubeInfo(elem)]} key={i}>
                                <strong style={{marginBottom: "15px", fontSize: "17px"}}>{elem.cardMainTitle}</strong>
                                <CardImg src={`${process.env.REACT_APP_IMG_API_URL}/${elem.cardImg}`} alt={`${elem.cubeName} img`}/>
                            </SingleCubeCard>
                        })}
                    </CubeWrapper>
                }
                <Modal
                    isOpen={modal}
                    onRequestClose={closeModal}
                    contentLabel="Cube card"
                    className="ModalPersonal"
                    overlayClassName="Overlay"
                >
                    <ModalWrapper>
                        <CardTitle>{cubeInfo.cardMainTitle}</CardTitle>
                        <CardText>{parse(cubeInfo.cardText)}</CardText>
                        {props.creator === cubeInfo.creator.creatorId ? 
                            <>
                                {cubeInfo.public ? 
                                    <UploadButton onClick={() => [setAddCube(true), closeModal()]}>Update</UploadButton>
                                    :
                                    <UploadButton onClick={() => {
                                        makePublicMutation().then(() => refetch())
                                        closeModal()
                                    }}>Upload</UploadButton>
                                }
                                <DeleteButton onClick={() => [deleteCube(), closeModal(),refetch()]}>Delete Cube</DeleteButton>
                            </>
                            :
                            <div style={{marginTop: "20px"}}>Creator: {cubeInfo.creator.username}</div>
                        }
                    </ModalWrapper>
                </Modal>
            </>
        </MainDivRe>
    )
}

export default MyCubes;

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
const ModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`
const CardTitle = styled.strong`
    font-size: 25px;
    margin-bottom: 10px;
`
const CardText = styled.span`
    height: 90%;
    min-height: 90%;
`
const DeleteButton = styled.button`
    background: red;
    border: 1px solid red;
    color: white;
    width: 110px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 5px 10px 5px 10px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
`
const UploadButton = styled.button`
    display: flex;
    justify-content: center;
    background: #b31860;
    border: 2px solid #b31860;
    color: white;
    width: 20%;
    padding: 10px 25px 10px 25px;
    margin-top: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
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
    cursor: pointer;
`
const CardImg: StyledComponent<"img", any, {}, never> = styled.img`
    width: 95%;
    height: 200px;
    border-radius: 8px;
    cursor: pointer;
`
const FinishButton = styled.button`
    background: #b31860;
    border: 2px solid #b31860;
    color: white;
    width: 20%;
    padding: 10px 25px 10px 25px;
    margin-top: 20px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    transition: 0.45s;
    cursor: pointer;
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
    cursor: pointer;
    &:hover {
        border: 2px solid #b31860;
        color: ${props => props.state ? "white" : "#b31860"};
        background: ${props => props.state ? "#b31860" : "white"};
    }
`