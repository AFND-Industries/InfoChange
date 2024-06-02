import React, { useEffect, useRef, useState } from "react";
import CoinsCap from "../../data/CoinMarketCapData.json";
import Symbols from "../../data/Coins.json";
import Data from "../../data/Data.json";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "./row.css";
import { Timeline } from "react-ts-tradingview-widgets";
import CoinInfo from "./CoinInfo";
import { useLocation } from "react-router-dom";
import { useCoins } from "./CoinsAPI";

export default function CoinsPage() {
  const params = window.location.pathname.split("/").slice(2);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [coinInfo, setCoinInfo] = useState([]);
  const { getCoins, getLastDate } = useCoins();
  const [dataTablePage, setDataTablePage] = useState(1);

  const updateTabIndex = () => {
    setTimeout(() => {
      const tableBody = document.querySelector(".p-datatable-tbody");
      if (tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
          row.setAttribute("tabindex", 0);
        });
      }
    }, 1000);
  };

  const updatePaginatorNumbers = () => {
    document.querySelectorAll(".p-paginator-page").forEach((element) => {
      element.addEventListener("click", () => {
        setDataTablePage(element.textContent);
      });
    });
  };

  const updatePaginatorElements = () => {
    document.querySelectorAll(".p-paginator-element").forEach((element) => {
      if (element.classList.contains("p-paginator-next")) {
        element.addEventListener("click", () => {
          setDataTablePage(dataTablePage + 1);
        });
      } else if (element.classList.contains("p-paginator-last")) {
        element.addEventListener("click", () => {
          setDataTablePage(300);
        });
      } else if (element.classList.contains("p-paginator-first")) {
        element.addEventListener("click", () => {
          setDataTablePage(1);
        });
      } else if (element.classList.contains("p-paginator-prev")) {
        element.addEventListener("click", () => {
          setDataTablePage(dataTablePage - 1);
        });
      }

      document.querySelectorAll(".p-dropdown").forEach((element) => {
        element.addEventListener("click", () => {
          setDataTablePage(element.textContent);
        });
      });
    });
  };

  useEffect(() => {
    initFilters1();
    updatePaginatorNumbers();
    updatePaginatorElements();
  }, []);

  useEffect(() => {
    updateTabIndex();
    setTimeout(() => {
      updatePaginatorNumbers();
    }, 500);
  }, [dataTablePage]);

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      change_porcent: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      volume: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      price: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue1("");
  };

  const onRowClick = (event) => {
    window.history.replaceState(null, null, "/coins/" + event.data.symbol);
    setCoinInfo(event.data);
  };

  const filteredSymbols = getCoins();

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
    updateTabIndex();
  };

  const renderHeader1 = () => {
    return (
      <div className="d-flex justify-content-between" role="search">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Limpiar"
          className="p-button-outlined rounded clear-button btn-clear d-flex justify-content-center"
          onClick={initFilters1}
          aria-label="Limpiar filtros"
        />
        <span className="p-input-icon-left mx-2 search-input">
          <i className="pi pi-search mx-2" aria-hidden="true" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Buscar por nombre o símbolo"
            style={{ paddingLeft: "30px" }}
            aria-label="Buscar por nombre o símbolo"
            className="search-input"
          />
        </span>
      </div>
    );
  };

  const data = getData(filteredSymbols);
  const header1 = renderHeader1();
  const location = useLocation();
  const lastDate = getLastDate();

  return params.length === 0 ? (
    getCoinDataTable(data, filters1, header1, onRowClick, lastDate)
  ) : (
    <CoinInfo coin={coinInfo} key={location.key} />
  );
}

function getData(symbols) {
  const array = [];
  const data = CoinsCap.data;
  for (const coin in data) {
    if (data[coin] && data[coin][0]) {
      const symbol = symbols.find(
        (symbol) => symbol.symbol.slice(0, -4) === data[coin][0].symbol
      );
      const objetosMapeados = data[coin].map((item) => {
        return {
          id: item.id,
          name: item.name,
          logo: item.logo,
          symbol: item.symbol,
          change_porcent:
            symbol === undefined ? null : symbol.priceChangePercent,
          volume: symbol === undefined ? null : symbol.volume,
          price: symbol === undefined ? null : symbol.lastPrice,
          description: item.description,
          high_price: symbol === undefined ? null : symbol.highPrice,
          low_price: symbol === undefined ? null : symbol.lowPrice,
          urls: item.urls,
          tags: item.tags,
        };
      });

      array.push(...objetosMapeados);
    }
  }
  return array;
}

function getCoinDataTable(data, filters1, header1, onRowClick, lastDate, rows) {
  const imageBodyTemplate = (rowData) => {
    const onImageLoad = (event) => {
      const loadingImage =
        event.target.parentElement.querySelector('img[name="charge"]');
      loadingImage.classList.add("d-none");
      event.target.classList.remove("d-none");
    };

    return (
      <div className="d-flex align-items-center" style={{ width: "25%" }}>
        <img
          name="charge"
          src="/favicon.ico"
          alt="Imagen de carga"
          className="img-fluid pe-1"
          style={{ maxWidth: "50px" }}
        />
        <img
          src={rowData.logo}
          alt={`Logo de ${rowData.name}`}
          className="img-fluid pe-1 d-none"
          style={{ maxWidth: "50px" }}
          onLoad={onImageLoad}
        />
        <div>
          <span className="coin-name p-2 small">
            <strong>{rowData.name}</strong>
          </span>
          <span className="coin-symbol text-gray small">{rowData.symbol}</span>
        </div>
      </div>
    );
  };

  const changePorcentTemplate = (rowData) => {
    return rowData.change_porcent < 0 ? (
      <span className="red-text" style={{ fontWeight: "bold" }}>
        {rowData.change_porcent} %
      </span>
    ) : (
      <span className="green-text" style={{ fontWeight: "bold" }}>
        {rowData.change_porcent} %
      </span>
    );
  };

  const updateTabIndex = () => {
    const tableBody =
      dataTableRef.current.container.querySelector(".p-datatable-tbody");
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => row.setAttribute("tabIndex", 0));
  };

  const onPage = (event) => {
    setlazyState(event);
  };

  return (
    <main style={{ minHeight: "80vh" }}>
      <h1 className=" m-3 mt-4 fs-1">Listado de todas las Criptomonedas</h1>
      <h2 className="text-secondary m-3 mb-5 fs-5">
        Consulta la información de las criptomonedas más populares en el mercado
        en tiempo real
      </h2>
      <span className=" h6 text-secondary m-3">
        Última actualización de la base de datos: {lastDate}
      </span>
      <div className="border rounded m-3 data-table-body">
        <DataTable
          value={data}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "30rem" }}
          filters={filters1}
          filterDisplay="menu"
          globalFilterFields={["name", "symbol"]}
          header={header1}
          onRowClick={onRowClick}
          rowClassName={"row-data-tables hover-row"}
          sortField="price"
          sortOrder={-1}
          size="small"
          selectionMode={"single"}
          aria-label="Tabla de datos de monedas"
          pageLinkSize={3}
          tabIndex="0"
        >
          <Column
            body={imageBodyTemplate}
            header="Nombre"
            headerStyle={{ position: "sticky", left: 0 }}
            bodyStyle={{
              position: "sticky",
              left: 0,
              zIndex: 1,
              backgroundColor: "#fff",
            }}
            className="hover-column sticky-column"
            style={{ width: "25%" }}
            aria-label="Nombre"
          ></Column>
          <Column
            body={changePorcentTemplate}
            sortable
            sortField="change_porcent"
            header="Porcentaje de cambio"
            style={{ width: "25%" }}
            aria-label="Porcentaje de cambio"
          ></Column>
          <Column
            field="volume"
            sortable
            header="Volumen"
            style={{ width: "25%" }}
            aria-label="Volumen"
          ></Column>
          <Column
            field="price"
            sortable
            header="Precio"
            style={{ width: "25%" }}
            aria-label="Precio"
          ></Column>
        </DataTable>
      </div>
    </main>
  );
}
