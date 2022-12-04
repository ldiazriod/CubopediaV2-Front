import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './App.css';
import SignUp from './components/signUp/SignUp';
import LogIn from './components/logIn/LogIn';
import styled from 'styled-components';
import mainLogo from "./assets/CubopediaGrey.png"

import { persistor, store } from './redux/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import MainMenu from './components/MainMenu/MainMenu';

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  const [selector, setSelector] = useState<boolean>(false)
  const [logIn, setLogIn] = useState<boolean>(false)
  const user = useSelector<{user: {authToken: string, creator: string}}, any>((state: {user: {authToken: string, creator: string}}) => state)
  return (
    <ApolloProvider client={client}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          {!user.isLoggedIn ?
            !selector ?
              <MainContainer>
                <ButtonsContainer>              
                  <Button onClick={() => [setSelector(true), setLogIn(true)]}>Log In</Button>
                  <Button onClick={() => [setSelector(true), setLogIn(false)]}>Sign Up</Button>
                </ButtonsContainer>
                <Img src={mainLogo}/>
              </MainContainer>
            :
              logIn ?
                <LogIn setSelector={setSelector}/>
                :
                <SignUp/>
          :  <MainMenu authToken={user.user.authToken} userId={user.user.creator}/>
          }
        </div>
      </PersistGate>
    </ApolloProvider>
  );
}

export default App;

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
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
  
`