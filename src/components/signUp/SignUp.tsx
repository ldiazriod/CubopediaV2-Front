import React, { useState, useRef } from "react";
import styled from "styled-components"
import { DocumentNode, gql, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux"
import axios from "axios"

import { MainDiv } from "../../styles/globalStyles";
import MainMenu from "../MainMenu/MainMenu";
import { logIn } from "../../redux/userReducer";

type Props = {
    setGoBack: React.Dispatch<React.SetStateAction<boolean>>
}

type UserInfo = {
    email: string,
    username: string,
    password: string,
    name: string,
    lastname: string,
}

type AlertsType = {
    noPassword: boolean | undefined,
    noUsername: boolean | undefined,
    noEmail: boolean | undefined,
    badPassword: boolean | undefined,
}

type EmailValidation = {
    deliverability: string,
    autocorrect: string
    is_valid_format: {
        value: boolean
    }
    is_disposable_email: {
        value: boolean
    }
}

const initialUserInfo = {
    email: "",
    username: "",
    password: "",
    name: "",
    lastname: ""
}
const initialAlerts = {
    noPassword: undefined,
    noUsername: undefined,
    noEmail: undefined,
    badPassword: undefined,
}
const ADD_USER: DocumentNode = gql`
    mutation signUp($email: String!, $username: String!, $password: String!){
        signUp(email: $email, username: $username, password: $password){
            authToken,
            creator
        }
    }
`
const SignUp = (props: Props): JSX.Element => {
    const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo)
    const [alerts, setAlerts] = useState<AlertsType>(initialAlerts)
    const [next, setNext] = useState<boolean>(false);
    const [finish, setFinish] = useState<boolean>(false)
    const [signUp, { data }] = useMutation(ADD_USER, {
        variables: {
            email: userInfo.email,
            username: userInfo.username,
            password: userInfo.password
        }
    })
    const dispatch = useDispatch()
    const onClickFinish = () => {
        signUp().then((response) => {
            setFinish(true)
            dispatch(logIn({ authToken: response.data.signUp.authToken, creator: response.data.signUp.creator }))
            props.setGoBack(false)
        })
    }

    const onClickNext = async () => {
        if (userInfo.email.length !== 0 && userInfo.username.length !== 0 && userInfo.password.length !== 0) {
            const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
            const aux = strongPassword.test(userInfo.password)
            if (aux) {
                const goodMail = (await axios.get<EmailValidation>(process.env.REACT_APP_EMAIL_API_URL!)).data
                if (goodMail.deliverability === "DELIVERABLE" && !goodMail.is_disposable_email.value) {
                    setNext(true)
                }
            } else {
                setAlerts({ ...alerts, badPassword: true })
            }
        } else if (userInfo.email.length === 0) {
            setAlerts({ ...alerts, noEmail: true })
        } else if (userInfo.username.length === 0) {
            setAlerts({ ...alerts, noUsername: true })
        } else if (userInfo.password.length === 0) {
            setAlerts({ ...alerts, noPassword: true })
        }
    }
    return (
        <MainDiv>
            {!finish ? <MainWrapper>
                <TextSpan>
                    <span>Sign Up</span>
                </TextSpan>
                {!next ? <>
                    <InputContainer>
                        <Input state={alerts.noEmail} type="text" placeholder="Email" autoComplete="false" value={userInfo.email} onChange={(e) => [
                            setUserInfo({ ...userInfo, email: e.target.value }),
                            e.target.value.length !== 0 && setAlerts({ ...alerts, noEmail: false })
                        ]}
                        />
                        <Input state={alerts.noUsername} type="text" placeholder="Username" autoComplete="false" value={userInfo.username} onChange={(e) => [
                            setUserInfo({ ...userInfo, username: e.target.value }),
                            e.target.value.length !== 0 && setAlerts({ ...alerts, noUsername: false })
                        ]}
                        />
                        <Input state={alerts.noPassword || alerts.badPassword} type="password" placeholder="Password" autoComplete="false" value={userInfo.password} onChange={(e) => [
                            setUserInfo({ ...userInfo, password: e.target.value }),
                            e.target.value.length !== 0 && setAlerts({ ...alerts, noPassword: false })
                        ]} />
                    </InputContainer>
                    {alerts.badPassword && <div>Password must be eight characters or longer and have 1 Lowercase, 1 uppercase, 1 numeric character and one special character</div>}
                    <Button onClick={onClickNext}>Next</Button>
                </> : <>
                    <TextSpan>Optional Info</TextSpan>
                    <InputContainer>
                        <Input type="text" placeholder="Name" autoComplete="false" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
                        <Input type="text" placeholder="Last name" autoComplete="false" value={userInfo.lastname} onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })} />
                    </InputContainer>
                    <Button onClick={onClickFinish}>Finish</Button>
                </>
                }
            </MainWrapper>
                : data && <MainMenu authToken={data.signUp.authToken} userId={data.signUp.creator} />
            }
        </MainDiv>
    )
}

export default SignUp;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    min-height: 80vh;
`
const TextSpan = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        font-size: 23px;
        font-weight:500;
        margin-bottom: 10px;
    }
`
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const Input = styled.input<{ state?: boolean | undefined }>`
    border: 1px solid ${props => props.state ? "red" : "transparent"};
    width: 300px;
    margin: 10px;
    padding: 15px;
    box-shadow: 0px 5px 5px #97949496;
    border-radius: 8px;
    &:focus{
        outline: none;
    }
`
const Button = styled.button`
    width: 330px;
    padding: 8px;
    background: #b31860;
    border: 2px solid #b31860;
    color: white;
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