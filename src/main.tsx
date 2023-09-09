import React    from 'react'
import ReactDOM from 'react-dom/client'

import { ChakraProvider } from '@chakra-ui/react'
import { NostrProvider }  from '@cmdcode/use-nostr'

import App from './App.js'

import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NostrProvider defaults={{ relays: [ 'wss://project-s.nostr1.com' ] }}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </NostrProvider>
  </React.StrictMode>,
)
