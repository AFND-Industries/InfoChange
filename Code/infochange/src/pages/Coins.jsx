import React, { useEffect, useRef, useState } from 'react';
import CoinsCap from '../data/CoinMarketCapData.json';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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


      };
    });
    
    // Agregar los objetos mapeados al array de resultados
    array.push(...objetosMapeados);
  }
  return array;
}
function getCoinDataTable(data){
  return (
    <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
      <Column field="id" header="ID" style={{ width: '25%' }}></Column>
      <Column field="name" header="Nombre" style={{ width: '25%' }}></Column>
    </DataTable>);
}