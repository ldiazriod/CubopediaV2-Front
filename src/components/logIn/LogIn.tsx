import React, { useState, useEffect } from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux"
import { logIn } from "../../redux/userReducer"

import { MainDiv } from "../../styles/globalStyles";
import MainMenu from "../MainMenu/MainMenu";
import { UserRedux } from "../../types/reduxTypes";

type Props = {
    setSelector: React.Dispatch<React.SetStateAction<boolean>>
}

const LOG_IN: DocumentNode = gql`
    mutation logIn($email: String, $username: String!, $password: String!){
        logIn(email: $email, username: $username, password: $password){
            creator,
            authToken
        }
    }
`

const LogIn = (props: Props): JSX.Element => {
    const user = useSelector<UserRedux, any>((state: UserRedux) => state)
    const [nameEmail, setNameEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [noUser, setNotUser] = useState<boolean>(false)
    const [log, setLog] = useState<boolean>(false)
    const [logInM, { data, error, loading }] = useMutation(LOG_IN, {
        variables: {
            email: nameEmail,
            username: nameEmail,
            password: password
        }
    });
    const dispatch = useDispatch()

    useEffect(() => {
        if (user.isLoggedIn) {
            setLog(true)
        }
    }, [])

    const onClickLog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        logInM().then((response) => {
            if (!response.data) {
                setNotUser(true)
            } else {
                if (response.data.logIn.authToken) {
                    dispatch(logIn({ authToken: response.data.logIn.authToken, creator: response.data.logIn.creator }))
                    setNotUser(false)
                    setLog(true)
                    props.setSelector(false)
                }
            }
        })
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <MainDiv>
            {!log ?
                <MainWrapper>
                    <TextSpan>Welcome to Cubepedia!</TextSpan>
                    <InputContainer>
                        <Input state={noUser} type="text" placeholder="email/username" autoComplete="false" value={nameEmail} onChange={(e) => setNameEmail(e.target.value)} />
                        <Input state={noUser} type="password" placeholder="password" autoComplete="false" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </InputContainer>
                    {noUser && <div>Incorrect password or mail/username</div>}
                    <Button onClick={onClickLog}>Log In</Button>
                </MainWrapper>
                : (data !== undefined || user.isLoggedIn) && <MainMenu authToken={user.isLoggedIn ? user.authToken : data.logIn.authToken} userId={user.isLoggedIn ? user.creator : data.logIn.creator} />
            }
        </MainDiv>
    )
}

export default LogIn;

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
    font-size: 23px;
    font-weight:500;
    margin-bottom: 10px;
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