import React from 'react';
import Header from './components/Header';
import Price from './components/Price';
import AssetBalance from './components/AssetBalance';
import Footer from './components/Footer';
import BitcoinChart from './components/BitcoinChart';

import { useBitcoin } from './contexts/BitcoinContext';

function App() {

  const { getBitcoinPrice, getDollarBalance, getBitcoinBalance, buyBitcoin, sellBitcoin } = useBitcoin();

  const handleTransaction = (value, assetType, balance, transactionFunc, precision) => {
    const price = parseFloat(getBitcoinPrice());
    const amount = parseFloat(value);

    // Actualmente hay bugs por no poner monto minimo.
    // Deberiamos poner unos 5$ minimo y el equivalente en la moneda. Si no hay minimo
    // Puedes vender 0.0000001 btc y luego comprar 0.01 usd y estas creando dinero infinito por culpa del redondeo

    if (!price || isNaN(amount) || amount <= 0) {
      alert(!price ? "No hay precio de Bitcoin disponible." :
        isNaN(amount) ? `Has introducido una cantidad inválida de ${assetType}.` :
          "La cantidad a comprar debe ser mayor a 0.");
      return;
    }

    if (amount > parseFloat(balance)) {
      alert(`Saldo de ${assetType} insuficiente.`);
      return;
    }

    transactionFunc(amount.toFixed(precision));
  };

  const handleBuyBitcoin = (value) => {
    handleTransaction(value, "dólares", getDollarBalance(), buyBitcoin, 2);
  };

  const handleSellBitcoin = (value) => {
    handleTransaction(value, "Bitcoin", getBitcoinBalance(), sellBitcoin, 8);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <Header />
        <Price
          asset="Bitcoin"
          price={getBitcoinPrice()}
        />
        <BitcoinChart />
        <div className="container">
          <div className="row">
            <AssetBalance
              name="Dólares"
              balance={getDollarBalance() + " USD"}
              inputPlaceholder="Ingrese el monto a comprar"
              buttonText="Comprar"
              onButtonClick={handleBuyBitcoin}
            />
            <AssetBalance
              name="Bitcoin"
              balance={getBitcoinBalance() + " BTC"}
              inputPlaceholder="Ingrese el monto a vender"
              buttonText="Vender"
              onButtonClick={handleSellBitcoin}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
