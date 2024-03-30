import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AssetProvider } from './contexts/AssetContext';
import { CoinProvider } from './contexts/CoinContext';
import SymbolMarketPage from './SymbolMarketPage';
import CoinsPage from './CoinsPage';
import UnknownPage from './UnknownPage';

const pathname = window.location.pathname.substring(7);
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <CoinProvider>
          <CoinsPage />
        </CoinProvider>
      } />
      <Route path="/price/*" element={
        <AssetProvider p={pathname}>
          <SymbolMarketPage />
        </AssetProvider>
      } />
      <Route path="*" element={<UnknownPage />} />
    </Routes>
  </BrowserRouter>
);
