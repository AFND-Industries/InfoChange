import React, { useEffect, useRef, useState } from 'react';
import CoinsCap from '../data/CoinMarketCapData.json';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';

export default function Coins() {
  const data = getData();


  return getCoinDataTable(data);

}
function getData(){
  const array = [];
  const data = CoinsCap.data[0];
  for(const coin in data){
    const objetosMapeados = data[coin].map(item => {
      // Aquí puedes hacer lo que necesites con cada objeto
      return {
        id: item.id,
        name: item.name,
        logo: item.logo,
        symbol: item.symbol,
        date: item.date_added
      };
    });
    
    // Agregar los objetos mapeados al array de resultados
    array.push(...objetosMapeados);
  }
  return array;
}
function getCoinDataTable(data){
  const imageBodyTemplate = (rowData) => {
    return (<div className="col align-items-center">

      <img src={rowData.logo} alt={rowData.name} className="img-fluid pe-2" style={{ maxWidth: '50px' }} />
      <span className='p-2'><strong>{rowData.name}</strong></span>
      <span className='text-secondary'>{rowData.symbol}</span>
  </div>);
  }
  return (
    <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
      <Column body={imageBodyTemplate} sortable header="Nombre" style={{ width: '25%' }}></Column>
    </DataTable>);
}