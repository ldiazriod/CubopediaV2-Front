import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import './App.css';
import SignUp from './components/signUp/SignUp';
import LogIn from './components/logIn/LogIn';

const client = new ApolloClient({
  uri: "https://cubopedia-back.herokuapp.com/",
  cache: new InMemoryCache(),
});

function App() {
  const [selector, setSelector] = useState<boolean>(false)
  const [logIn, setLogIn] = useState<boolean>(true)
  return (
    <ApolloProvider client={client}>
      <div className="App">
        {!selector &&
          <>
            <button onClick={(e) => [setSelector(true), setLogIn(true)]}>Log In</button>
            <button onClick={(e) => [setSelector(true), setLogIn(false)]}>Sign Up</button>
          </>
        }
        {selector &&
          <>
            {logIn &&
              <LogIn/>
            }
            {!logIn &&
              <SignUp/>
            }
          </>
        }
      </div>
  </ApolloProvider>
  );
}

export default App;
