import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {createHttpLink} from 'apollo-link-http'
import {WebProvider} from './context/WebProvider'
import {WEBSERVER_URL} from './env/env'

//@ts-ignore

const httpLink = new createHttpLink({
  uri: WEBSERVER_URL + '/graphql'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <WebProvider>
        <App />
      </WebProvider>
    </ApolloProvider>
  </React.StrictMode>
)


reportWebVitals();
