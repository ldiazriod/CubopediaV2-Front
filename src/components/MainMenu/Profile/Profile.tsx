import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Modal from "react-modal";
import parse from "html-react-parser";
import axios from "axios";

import {MainDivRe} from "../../../styles/globalStyles";
import TextArea from "../../others/TextArea";

import { UserRedux } from "../../../types/reduxTypes";
import {useDispatch, useSelector} from "react-redux"
import {logOut} from "../../../redux/userReducer"

import defaultProfile from "../../../assets/defaultPicture.jpg"
import penIcon from "../../../assets/penIcon.png"
import "./modalP.css"
import ReviewStars from "../../others/ReviewStars";

type Props = {
    creator: string;
    authToken: string
}
type ProfileCube = {
    _id: string
    cubeName: string
    cubeDimensions: string
    cubeModName: string
    cubeModel: string
    cubeBrand: string
    cubeDesigner: string
    cardMainTitle: string
    cardText: string
    cardReviewPoints: {
        reviewMean: number,
        reviews: string[]
    }
    cardImg: string
}
type ProfileInfo = {
    username: string
    profileImg: string
    numReviews: number
    cardReviews: {
        cardsTotalMean: number,
        cardsTotalReviews: number
    }
    cubes: ProfileCube[]
}

const defaultCubeState: ProfileCube = {
    _id: "",
    cubeName: "",
    cubeDimensions: "",
    cardMainTitle: "",
    cardText: "",
    cardReviewPoints: {
        reviewMean: 0,
        reviews: []
    },
    cardImg: "",
    cubeModName: "", 
    cubeModel: "", 
    cubeBrand: "", 
    cubeDesigner: ""
}
const SET_LOGOUT: DocumentNode = gql`
    mutation LogOut($authToken: String!){
        logOut(authToken: $authToken)
    }
`
const GET_PROFILE: DocumentNode = gql`
    query getProfileInfo($input: ProfileInput!){
        getProfileInfo(input: $input){
            username,
            profileImg,
            numReviews,
            cardReviews {
                cardsTotalMean,
                cardsTotalReviews
            }
            cubes {
                _id,
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
            }
        }
    }
`
const CLONE_CUBE = gql`
    mutation cloneCube($input: CloneInfo!){
        cloneCube(input: $input)
    }
`
const IS_USER = gql`
    query isUser($input: ProfileInput!){
        isUser(input: $input)
    }
`
const UPDATE_PROFILE_IMG = gql`
    mutation changeProfileImg($input: ChangeImage!){
        changeProfileImg(input: $input)
    }
`
const DELETE_USER = gql`
    mutation deleteUser($input: DeleteUserInput!){
        deleteUser(input: $input)
    }
`
const Profile = (props: Props): JSX.Element => {
    const dispatch = useDispatch()
    const [modal, setModal] = useState<boolean>(false)
    const [cubeInfo, setCubeInfo] = useState<ProfileCube>({...defaultCubeState})
    const [deleteUserS, setDeleteUserS] = useState<{delete: boolean, password: string}>({delete: false, password: ""})
    const [changeProfileImg] = useMutation(UPDATE_PROFILE_IMG)
    const [deleteUser] = useMutation(DELETE_USER, {
        variables: {
            input: {
                authToken: props.authToken,
                password: deleteUserS.password
            }
        }
    });
    const isUser = useQuery<{isUser: boolean}>(IS_USER, {
        variables: {
            input: {
                authToken: props.authToken,
                id: props.creator
            }
        }
    })
    const {data, error, loading, refetch} = useQuery<{getProfileInfo: ProfileInfo}>(GET_PROFILE, {
        variables: {
            input: {
                authToken: props.authToken,
                id: props.creator 
            }
        }
    })
    const [logOutMutation] = useMutation(SET_LOGOUT, {
        variables: {
            input: props.authToken
        }
    })
    const [cloneCube] = useMutation(CLONE_CUBE, {
        variables: {
            input: {
                id: cubeInfo._id,
                authToken: props.authToken
            }
        }
    })
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }

    const onLogOut = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        dispatch(logOut({authToken: "", creator: ""}))
        logOutMutation()
    }

    const onDelete = async(e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const deleted = await deleteUser()
        if(deleted.data.deleteUser){
            dispatch(logOut({authToken: "", creator: ""}))
        }
    }

    const onNewImage = async() => {
        const newFileForm = new FormData()
        const imgElement: HTMLInputElement = document.getElementById("file-upload") as HTMLInputElement;
        const file = imgElement.files![0]
        const newName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}-${props.creator}.${file.type.split("/")[1]}`
        const blob = file.slice(0, file.size, file.type)
        newFileForm.append("upload", blob, newName)
        await axios.post(`${process.env.REACT_APP_IMG_API_URL}/upload`, newFileForm)
        await changeProfileImg({
            variables: {
                input: {
                    imgName: newName,
                    authToken: props.authToken
                }
            }
        })
        refetch()
    }

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>{`${error}`}</div>
    }
    return (
        <MainDivRe>
            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                contentLabel="CubeCard"
                className="ModalP"
                overlayClassName="Overlay"
            >
                <strong>{cubeInfo.cardMainTitle}</strong>
                <span>{parse(cubeInfo.cardText)}</span>
                {props.creator && <button onClick={() => cloneCube()}>Clone</button>}
            </Modal>
            {data && isUser.data &&
                <> 
                    <ProfileStats>
                        {isUser.data.isUser ?
                            <>
                                <ProfileImgContainer>
                                    <ProfileImg src={data.getProfileInfo.profileImg.length !== 0 ? `${process.env.REACT_APP_IMG_API_URL}/${data.getProfileInfo.profileImg}` : defaultProfile} alt="profileImg"/>
                                    <ProfileMiddle>
                                        <label htmlFor="file-upload">
                                            <ProfileOverlayImg src={penIcon}/>
                                        </label>
                                    </ProfileMiddle>
                                </ProfileImgContainer>
                                <div>{data.getProfileInfo.username}</div>
                                <ReviewContainer>
                                    <ReviewStars starValue={data.getProfileInfo.cardReviews.cardsTotalMean} editable={false}/>
                                    <div>{`(${data.getProfileInfo.cardReviews.cardsTotalReviews})`}</div>
                                </ReviewContainer>
                                <input style={{display: "none"}} id="file-upload" type="file" onChange={onNewImage}/>
                            </>
                            :
                            <>
                                <PublicProfileImg src={data.getProfileInfo.profileImg.length !== 0 ? `${process.env.REACT_APP_IMG_API_URL}/${data.getProfileInfo.profileImg}` : defaultProfile} alt="profileImg"/>
                                <div>{data.getProfileInfo.username}</div>
                            </>
                        }
                        <StatRow>
                            <div>Num Cubes: {data.getProfileInfo.cubes.length}</div>
                            <div>Points: {`Finish`}</div>
                        </StatRow>
                        <StatRow>

                        </StatRow>
                    </ProfileStats>
                    <CubeWrapper>
                        {data.getProfileInfo.cubes.map((elem, i) => {
                            return <SingleCubeCard key={i}>
                                <strong>{elem.cardMainTitle}</strong>
                                <div onClick={() => [setCubeInfo(elem), openModal()]} style={{width: "100%", cursor: "pointer"}}>
                                    <CardImg src={`${process.env.REACT_APP_IMG_API_URL}/${elem.cardImg}`} alt={`${elem.cubeName} img`}/>
                                </div>
                            </SingleCubeCard>
                        })}
                    </CubeWrapper>
                    {isUser.data.isUser && 
                        <>
                            <button onClick={onLogOut}>Log out</button>
                            <button>Delete User</button>
                            {deleteUserS.delete && 
                                <>
                                    <input type="password" value={deleteUserS.password} onChange={(e) => setDeleteUserS({...deleteUserS, password: e.target.value})}/>
                                    <button onClick={onDelete}>Confirm</button>
                                </>
                            }
                        </>
                    }
                </>
            }
        </MainDivRe>
    )
}

export default Profile

const ProfileStats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const PublicProfileImg = styled.img`
    border-radius: 50%;
    height: 100px;
    border: 5px solid black;
`
const ProfileMiddle = styled.div`
    transition: .5s ease;
    opacity: 0;
    transform: translate(0%, -200%);
    -ms-transform: translate(-50%, -50%);
`
const ProfileOverlayImg = styled.img`
    height: 30px;
    width: 30px;
    cursor: pointer;
`
const ProfileImg = styled.img`
    border-radius: 50%;
    height: 100px;
    opacity: 1;
    display: block;
    transition: .5s ease;
    backface-visibility: hidden;
`
const ProfileImgContainer = styled.div`
    position: relative;
    border-radius: 50%;
    border: 5px solid black;
    height: 100px;
    cursor: pointer;
    &:hover ${ProfileMiddle} {
        opacity: 1;
    }
    &:hover ${ProfileImg} {
        opacity: 0.3;
    }
`
const StatRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`
const ReviewContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`
const CubeWrapper: StyledComponent<"div", any, {}, never> = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);    
    width: 100%;
    height: fit-content;
`
const SingleCubeCard: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: fit-content;
    background: white;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 30px;
`
const CardImg: StyledComponent<"img", any, {}, never> = styled.img`
    width: 90%;
    height: 200px;
    cursor: pointer;
`