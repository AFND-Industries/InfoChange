import React, { useEffect, useRef, useState } from 'react';
import CoinsCap from '../data/CoinMarketCapData.json';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Coins() {

  useEffect(() => {
    console.log(CoinsCap.data);
  }
  , []);


  return <h1>Hola</h1>;

}

function getCoinDataTable(){
  return (
    <DataTable value={CoinsCap.data} tableStyle={{ minWidth: '50rem' }}>
      <Column field="name" header="Nombre"></Column>
      <Column field="symbol" header="Simbolo"></Column>
    </DataTable>);
}