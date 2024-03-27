import React from 'react';
import ReactDOM from 'react-dom/client';
import { AssetProvider } from './contexts/AssetContext';
import App from './App';

const pathname = window.location.pathname.substring(1);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AssetProvider p={pathname}>
    <App />
  </AssetProvider>
);
