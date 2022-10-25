import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation } from "@apollo/client";

import MainDiv from "../../styles/globalStyles";
import MainMenu from "../MainMenu/MainMenu";

const LOG_IN: DocumentNode = gql`
    mutation logIn($email: String, $username: String!, $password: String!){
        logIn(email: $email, username: $username, password: $password){
            creator,
            authToken
        }
    }
`

const LogIn = (): JSX.Element => {
    const [nameEmail, setNameEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [log, setLog] = useState<boolean>(false)
    const [logInM, {data, error}] = useMutation(LOG_IN, {
        variables: {
            email: "",
            username: nameEmail,
            password: password
        }
    }); 
    
    const onClickLog = () => {
        logInM()
        setLog(true)
    }

    return(
        <MainDiv>
            {!log &&
                <>
                    <TextSpan>Welcome to Cubepedia!</TextSpan>
                    <InputContainer>
                        <Input type="text" placeholder="email/username" autoComplete="false" value={nameEmail} onChange={(e) => setNameEmail(e.target.value)}/>
                        <Input type="password" placeholder="password" autoComplete="false"value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </InputContainer>
                    <Button onClick={onClickLog}>Log In</Button>
                </>
            }
            {log && (data!==undefined) &&
                <MainMenu authToken={data.logIn.authToken} userId={data.logIn.creator}/>
            }
        </MainDiv>
    )
}

export default LogIn;

const TextSpan: StyledComponent<"span", any, {}, never> = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
`
const InputContainer: StyledComponent<"div", any, {}, never> = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const Input: StyledComponent<"input", any, {}, never> = styled.input`
    
`
const Button: StyledComponent<"button", any, {}, never> = styled.button`
    
`