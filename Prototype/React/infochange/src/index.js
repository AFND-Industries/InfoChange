import React from 'react';
import ReactDOM from 'react-dom/client';
import { BitcoinProvider } from './contexts/BitcoinContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BitcoinProvider>
      <App />
    </BitcoinProvider>
  </React.StrictMode>
);
