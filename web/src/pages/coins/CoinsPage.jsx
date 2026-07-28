import { useMemo, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

import { useCoins } from "../../hooks/useMarket";
import {
  formatAsset,
  formatDateTime,
  formatPercent,
  formatPrice,
} from "../../lib/format";

import "primeicons/primeicons.css";
import "./row.css";

const emptyFilters = () => ({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

/**
 * Logo de la moneda con imagen de reserva mientras carga.
 *
 * La version anterior conseguia el mismo efecto buscando la imagen hermana con
 * `querySelector` desde el manejador `onLoad` y cambiandole las clases.
 */
function CoinLogo({ src, name }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {loaded ? null : (
        <img
          src="/favicon.ico"
          alt="Imagen de carga"
          className="img-fluid pe-1"
          style={{ maxWidth: "50px" }}
        />
      )}
      <img
        src={src}
        alt={`Logo de ${name}`}
        className={`img-fluid pe-1${loaded ? "" : " d-none"}`}
        style={{ maxWidth: "50px" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

export default function CoinsPage() {
  const navigate = useNavigate();
  const { data, isPending, error } = useCoins();
  const [filters, setFilters] = useState(emptyFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  /**
   * Los importes llegan como cadena, y PrimeReact ordenaria "9" por encima de
   * "10". Se anade una copia numerica de cada columna ordenable.
   */
  const rows = useMemo(
    () =>
      (data?.coins ?? []).map((coin) => ({
        ...coin,
        priceValue: Number(coin.price),
        changeValue: Number(coin.priceChangePercent),
        volumeValue: Number(coin.volume),
      })),
    [data],
  );

  const onGlobalFilterChange = (event) => {
    const { value } = event.target;
    setGlobalFilterValue(value);
    setFilters({ global: { value, matchMode: FilterMatchMode.CONTAINS } });
  };

  const clearFilters = () => {
    setFilters(emptyFilters());
    setGlobalFilterValue("");
  };

  const onRowClick = (event) => navigate(`/coins/${event.data.baseAsset}`);

  const header = (
    <div className="d-flex justify-content-between" role="search">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Limpiar"
        className="p-button-outlined rounded clear-button btn-clear d-flex justify-content-center"
        onClick={clearFilters}
        aria-label="Limpiar filtros"
      />
      <span className="p-input-icon-left mx-2 search-input">
        <i className="pi pi-search mx-2" aria-hidden="true" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar por nombre o símbolo"
          style={{ paddingLeft: "30px" }}
          aria-label="Buscar por nombre o símbolo"
          className="search-input"
        />
      </span>
    </div>
  );

  const nameTemplate = (coin) => (
    <div className="d-flex align-items-center" style={{ width: "25%" }}>
      <CoinLogo src={coin.logo} name={coin.name} />
      <div>
        <span className="coin-name p-2 small">
          <strong>{coin.name}</strong>
        </span>
        <span className="coin-symbol text-gray small">{coin.baseAsset}</span>
      </div>
    </div>
  );

  const changeTemplate = (coin) => (
    <div>
      <span
        className={coin.changeValue < 0 ? "red-text" : "green-text"}
        style={{ fontWeight: "bold" }}
      >
        {formatPercent(coin.priceChangePercent)}
      </span>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh" }}>
      <h1 className=" m-3 mt-4 fs-1">Listado de todas las Criptomonedas</h1>
      <h2 className="text-secondary m-3 mb-5 fs-5">
        Consulta la información de las criptomonedas más populares en el mercado
        en tiempo real
      </h2>
      <span className=" h6 text-secondary m-3">
        Última actualización de la base de datos:{" "}
        {data ? formatDateTime(data.updatedAt) : "-"}
      </span>

      {error ? (
        <Alert variant="danger" className="m-3">
          {error.message}
        </Alert>
      ) : null}

      {isPending ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando monedas...</span>
          </Spinner>
        </div>
      ) : (
        <div className="border rounded m-3 data-table-body">
          <DataTable
            value={rows}
            dataKey="symbol"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "30rem" }}
            filters={filters}
            // El "simbolo" que se busca es el que se ve en la tabla: `symbol`
            // es el par completo (BTCUSDT), asi que buscar "USDT" devolvia
            // todas las filas.
            globalFilterFields={["name", "baseAsset"]}
            header={header}
            onRowClick={onRowClick}
            rowClassName={"row-data-tables hover-row"}
            sortField="priceValue"
            sortOrder={-1}
            size="small"
            selectionMode={"single"}
            aria-label="Tabla de datos de monedas"
            pageLinkSize={3}
            tabIndex="0"
            emptyMessage="No se encontraron resultados"
            pt={{
              paginator: {
                // El nombre accesible tiene que ir en el elemento enfocable: la
                // raiz del Dropdown es un <div> sin rol, donde `aria-label` no
                // se expone. El foco lo recibe el input oculto (`input`), que
                // ademas trae de serie una etiqueta en ingles a la que hay que
                // ganarle la partida.
                RPPDropdown: {
                  input: { "aria-label": "Filas por página" },
                },
              },
            }}
          >
            <Column
              field="name"
              body={nameTemplate}
              header="Nombre"
              sortable
              headerStyle={{ position: "sticky", left: 0 }}
              bodyStyle={{
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "#fff",
              }}
              className="hover-column sticky-column"
              style={{ width: "25%" }}
            />
            <Column
              field="priceChangePercent"
              sortField="changeValue"
              body={changeTemplate}
              sortable
              header="Porcentaje de cambio"
              style={{ width: "25%" }}
            />
            <Column
              field="volume"
              sortField="volumeValue"
              body={(coin) => <div>{formatAsset(coin.volume, 2)}</div>}
              sortable
              header="Volumen"
              style={{ width: "25%" }}
            />
            <Column
              field="price"
              sortField="priceValue"
              body={(coin) => <div>{formatPrice(coin.price)}</div>}
              sortable
              header="Precio"
              style={{ width: "25%" }}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
}
