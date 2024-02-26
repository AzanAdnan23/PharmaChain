import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
// import Dashboard from './components/Dashboard.tsx';
// import Landing from './components/Landing.tsx';
// import Scanner from './components/Scanner.tsx';
import './index.css'
import { MetaMaskProvider } from "@metamask/sdk-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
      <MetaMaskProvider
          debug={false}
          sdkOptions={{
              dappMetadata: {
                  name: "PharmaChain",
                  url: window.location.href,
              },
              // Other options
          }}
      >
          <BrowserRouter>
      <App />
    </BrowserRouter>
      </MetaMaskProvider>
  </React.StrictMode>
);
