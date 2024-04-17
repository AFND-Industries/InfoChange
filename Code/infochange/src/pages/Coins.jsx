import React, { useEffect, useRef, useState } from 'react';
import CoinsCap from '../data/CoinMarketCapData.json';
import Symbols from '../data/Coins.json';
import Data from '../data/Data.json';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';

export default function Coins() {
  const [prices, setPrices] = useState([]);

  /*useEffect(() => {
    const fetchData = async () => {
      const url = "https://api.binance.com/api/v3/ticker/24hr";
      const response = await fetch(url);
      const data = await response.json();

      // Filter symbols
      const filteredSymbols = data.filter(symbol => {
        // Check if symbol ends with 'USDT'
        if (symbol.symbol.endsWith('USDT')) {
          // Get the part of the symbol that is not 'USDT'
          const symbolWithoutUsdt = symbol.symbol.slice(0, -4);
      
          // Check if this part is in Symbols.json
          if (Symbols.includes(symbolWithoutUsdt)) {
            return true;
          }
        }
      
        return false;
      });

      setPrices(filteredSymbols);
    };

    fetchData();
  }, []);*/ // Empty dependency array ensures this runs once on mount

  const filteredSymbols = Data.filter(symbol => {
    // Check if symbol ends with 'USDT'
    if (symbol.symbol.endsWith('USDT')) {
      // Get the part of the symbol that is not 'USDT'
      const symbolWithoutUsdt = symbol.symbol.slice(0, -4);
  
      // Check if this part is in Symbols.json
      if (Symbols.allCoins.includes(symbolWithoutUsdt)) {
        return true;
      }
    }
  
    return false;
  });


  const data = getData(filteredSymbols);

  return getCoinDataTable(data);
}
 function getData(symbols){;
  const array = [];
  const data = CoinsCap.data;
  for(const coin in data){
    if (data[coin] && data[coin][0]) { // Check if data[coin][0] exists
      const symbol = symbols.find(symbol => symbol.symbol.slice(0, -4) === data[coin][0].symbol);
      console.log(symbol);
      const objetosMapeados = data[coin].map(item => {
        // Aquí puedes hacer lo que necesites con cada objeto
        return {
          id: item.id,
          name: item.name,
          logo: item.logo,
          symbol: item.symbol,
          change_porcent: symbol === undefined ? null : symbol.priceChangePercent + "%",
          volume: symbol === undefined ? null : symbol.volume,
          price: symbol === undefined ? null : symbol.lastPrice
        };
      });
    
    array.push(...objetosMapeados);
    }
  }
  return array;
}

function getCoinDataTable(data){
  const imageBodyTemplate = (rowData) => {
    const onImageLoad = (event) => {
      const loadingImage = event.target.parentElement.querySelector('img[name="charge"]');
      loadingImage.classList.add('d-none');
      event.target.classList.remove('d-none'); 
    };
  
    return (
      <div className="d-flex align-items-center">
        <img name="charge" src="/favicon.ico" alt="Cargando..." className="img-fluid pe-1" style={{ maxWidth: '50px' }} />
        <img src={rowData.logo} alt={rowData.name} className="img-fluid pe-1 d-none" style={{ maxWidth: '50px' }} onLoad={onImageLoad} />
        <div>
          <span className="p-2"><strong>{rowData.name}</strong></span>
          <span className="text-secondary">{rowData.symbol}</span>
        </div>
      </div>
    );
  };

  return (
    <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
      <Column body={imageBodyTemplate} sortable header="Nombre" style={{ width: '25%' }}></Column>
      <Column field="change_porcent" sortable header="Porcentaje de cambio" style={{ width: '25%' }}></Column>
      <Column field="volume" sortable header="Volumen" style={{ width: '25%' }}></Column>
      <Column field="price" sortable header="Precio" style={{ width: '25%' }}></Column>
    </DataTable>);
}