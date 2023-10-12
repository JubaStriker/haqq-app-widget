import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MetaMaskProvider } from '@metamask/sdk-react';

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider debug={false} sdkOptions={{
      logging: {
        developerMode: false,
      },
      checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
      dappMetadata: {
        name: "Metamask wallet connect",
        url: window.location.host,
      }
    }}>
      <App />
    </MetaMaskProvider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
