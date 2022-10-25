import React, {useState, useEffect} from "react";
import styled, { StyledComponent } from "styled-components"
import { DocumentNode, gql, useMutation } from "@apollo/client";

import MainDiv from "../../styles/globalStyles";
import MainMenu from "../MainMenu/MainMenu";

const ADD_USER: DocumentNode = gql`
    mutation signUp($email: String!, $username: String!, $password: String!){
        signUp(email: $email, username: $username, password: $password)
    }
`
const SignUp = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [next, setNext] = useState<boolean>(false);
    const [finish, setFinish] = useState<boolean>(false)
    const [signUp, {data}] = useMutation(ADD_USER, {
        variables: {
            email: email,
            username: username,
            password: password
        }
    })

    const onClickFinish = () => {
        signUp()
        setFinish(true)
    }

    return(
        <MainDiv>
            {!finish && <TextSpan>SignUp</TextSpan>}
            {!next && !finish &&
                <>
                    <InputContainer>
                        <Input type="text" placeholder="email" autoComplete="false" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <Input type="text" placeholder="username" autoComplete="false" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <Input type="password" placeholder="password" autoComplete="false"value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </InputContainer>
                    <Button onClick={(e) => setNext(true)}>Next</Button>
                </>
            }
            {next && !finish &&
                <>
                    <TextSpan>Optional Info</TextSpan>
                    <InputContainer>
                        <Input type="text" placeholder="Name" autoComplete="false" value={name} onChange={(e) => setName(e.target.value)}/>
                        <Input type="text" placeholder="Last name" autoComplete="false" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </InputContainer>
                    <Button onClick={onClickFinish}>Finish</Button>
                </>
            }
            {finish && data && 
                <MainMenu authToken={data.authToken} userId={data.creator}/>
            }
        </MainDiv>
    )
}

export default SignUp;

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