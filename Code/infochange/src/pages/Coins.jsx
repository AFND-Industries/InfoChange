import React, { useEffect, useRef, useState } from 'react';
import CoinsCap from '../data/CoinMarketCapData.json';
import Symbols from '../data/Coins.json';
import Data from '../data/Data.json';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';

export default function Coins() {
  const [prices, setPrices] = useState([]);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

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

  useEffect(() => {
    initFilters1();
  }, []);

  const initFilters1 = () =>{
    setFilters1({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'change_porcent': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'volume': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    });
    setGlobalFilterValue1('');
  }

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

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;
  
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  }

  const renderHeader1 = () =>{
    return (
      <div className="d-flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={initFilters1} />
        <span className="p-input-icon-left mx-4">
            <i className="pi pi-search mx-2" />
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" style={{ paddingLeft: '30px' }}  />
        </span>
      </div>
    )
  }


  const data = getData(filteredSymbols);
  const header1 = renderHeader1();
  
  
  
  



  return getCoinDataTable(data, filters1, header1);
}





function getData(symbols){;
  const array = [];
  const data = CoinsCap.data;
  for(const coin in data){
    if (data[coin] && data[coin][0]) { // Check if data[coin][0] exists
      const symbol = symbols.find(symbol => symbol.symbol.slice(0, -4) === data[coin][0].symbol);
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

function getCoinDataTable(data, filters1, header1){
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
    <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} 
    filters={filters1} filterDisplay="menu" globalFilterFields={['name', 'symbol']} header={header1}>
      <Column body={imageBodyTemplate} filter filterField='name' sortable header="Nombre" style={{ width: '25%' }}></Column>
      <Column field="change_porcent" sortable header="Porcentaje de cambio" style={{ width: '25%' }}></Column>
      <Column field="volume" sortable header="Volumen" style={{ width: '25%' }}></Column>
      <Column field="price" sortable header="Precio" style={{ width: '25%' }}></Column>
    </DataTable>);
}