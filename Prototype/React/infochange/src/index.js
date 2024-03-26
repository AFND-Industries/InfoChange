import React from 'react';
import ReactDOM from 'react-dom/client';
import { BitcoinProvider } from './contexts/BitcoinContext';
import App from './App';

const pathname = window.location.pathname.substring(1);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BitcoinProvider p={pathname}>
    <App />
  </BitcoinProvider>
);
