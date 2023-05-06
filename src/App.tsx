import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import SignUp from './components/signUp/SignUp';
import LogIn from './components/logIn/LogIn';
import styled from 'styled-components';
import mainLogo from "./assets/CubopediaGrey.png"

import { persistor } from './redux/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import MainMenu from './components/MainMenu/MainMenu';
import { isMobile } from './mediaQueries/queriesStates';
import { Default, Desktop, Mobile } from './mediaQueries/queriesComponents';

const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache({
        addTypename: false
    }),
});

function App() {
    const [selector, setSelector] = useState<boolean>(false)
    const [logIn, setLogIn] = useState<boolean>(false)
    const [goBack, setGoBack] = useState<boolean>(true)
    const user = useSelector<{ user: { authToken: string, creator: string } }, any>((state: { user: { authToken: string, creator: string } }) => state)
    const isMobileState = isMobile()
    return (
        <ApolloProvider client={client}>
            <PersistGate loading={null} persistor={persistor}>
                <div className="App">
                    {!user.isLoggedIn ?
                        !selector ?
                            <>
                                <MainContainer screenSize={isMobileState}>
                                    <Img src={mainLogo} />
                                    <ButtonsContainer>
                                        <Button onClick={() => [setSelector(true), setLogIn(true)]}>Log In</Button>
                                        <Button onClick={() => [setSelector(true), setLogIn(false)]}>Sign Up</Button>
                                    </ButtonsContainer>
                                </MainContainer>
                            </>
                            :
                            <>
                                {goBack && <GoBackButton onClick={() => setSelector(false)}>Go back</GoBackButton>}
                                {logIn ?
                                    <LogIn setSelector={setSelector} />
                                    :
                                    <SignUp setGoBack={setGoBack} />
                                }
                            </>
                        : <MainMenu authToken={user.user.authToken} userId={user.user.creator} />
                    }
                </div>
            </PersistGate>
        </ApolloProvider>
    );
}

export default App;

const MainContainer = styled.div<{screenSize: boolean}>`
    display: flex;
    flex-direction: ${props => props.screenSize ? "column" : "row"};
    align-items: center;
    justify-content: center;
    transform: ${props => props.screenSize ? "translate(0, 0)" : "translate(0, 50%)"};
`
const MainContainerMobile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 80vh;
`
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const GoBackButton = styled.button`
    background: white;
    border: 2px solid #b31860;
    color: #b31860;
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
        color:#b31860;
        background: white;
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
const Img = styled.img`
    width: 400px;
    height: 400px;
`