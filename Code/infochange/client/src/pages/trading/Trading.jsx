import React from 'react';

import { TradingProvider } from './context/TradingContext';
import TradingPage from './TradingPage';

function Trading() {
  return (
    <TradingProvider>
      <TradingPage />
    </TradingProvider>
  );
}

export default Trading;
