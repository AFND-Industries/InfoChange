import { useEffect, useState } from "react";

import Banner from "../../../../assets/bizum_banner.png";
import BusyOverlay from "../../../../components/BusyOverlay";
import { useSession } from "../../../../hooks/useSession";
import { useRecipients, useTransfer } from "../../../../hooks/useWallet";
import { formatUsd } from "../../../../lib/format";
import { useToast } from "../../../../providers/ToastProvider";
import BizumConfirmationModal from "./components/BizumConfirmationModal";
import UserItem from "./components/UserItem";

const MAX_VALUE = 1000000000;
const MAX_DECIMALS = 2;
const SUGGESTIONS = 5;

const countDecimals = (number) => {
  const decimalIndex = number.indexOf(".");
  return decimalIndex === -1 ? 0 : number.length - decimalIndex - 1;
};

export default function Bizum() {
  const { balances } = useSession();
  const transfer = useTransfer();
  const toast = useToast();

  const [userInput, setUserInput] = useState("");
  const [search, setSearch] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [confirming, setConfirming] = useState(false);

  // La busqueda la resuelve el servidor por nombre o por usuario. Se espera a
  // que el usuario deje de teclear para no lanzar una peticion por pulsacion.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(userInput.trim()), 250);
    return () => clearTimeout(timer);
  }, [userInput]);

  const { data: recipients } = useRecipients(search);

  const typed = userInput.trim().toLowerCase();
  const selected = (recipients ?? []).find(
    (candidate) => candidate.username.toLowerCase() === typed,
  );

  // Mientras se espera a la consulta, `recipients` sigue siendo el resultado de
  // la busqueda anterior (o el listado inicial sin filtrar). Se repite aqui el
  // criterio del servidor para no ensenar nunca, ni siquiera un instante,
  // destinatarios que no correspondan a lo tecleado: son elegibles con un clic.
  const matchesTyped = (candidate) =>
    candidate.username.toLowerCase().includes(typed) ||
    candidate.firstName.toLowerCase().includes(typed) ||
    candidate.lastName.toLowerCase().includes(typed);

  const suggestions = (recipients ?? []).filter(matchesTyped).slice(0, SUGGESTIONS);

  const handleAmountInput = (event) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);

    if (
      value === "" ||
      (!isNaN(value) &&
        parsedValue >= 0 &&
        countDecimals(value) <= MAX_DECIMALS &&
        parsedValue < MAX_VALUE)
    ) {
      setAmountInput(value.trim());
    }
  };

  const availableBalance = Number(
    balances.find((balance) => balance.asset === "USDT")?.quantity ?? "0",
  );

  const amount = parseFloat(amountInput);
  const isInputInvalid = amountInput !== "" && amount > availableBalance;
  const activeButton =
    selected !== undefined && amount > 0 && amount <= availableBalance;

  const handleBizum = async () => {
    setConfirming(false);
    if (!selected) return;

    try {
      await transfer.mutateAsync({
        recipientId: selected.id,
        amount: amountInput,
      });
      toast.success(
        "Bizum realizado correctamente",
        `Has enviado un bizum de ${formatUsd(amountInput)} a ${selected.username} correctamente.`,
      );
      setUserInput("");
      setAmountInput("");
    } catch (error) {
      toast.error("No se ha podido enviar el bizum", error.message);
    }
  };

  return (
    <>
      <BusyOverlay show={transfer.isPending} label="Enviando bizum..." />

      <BizumConfirmationModal
        show={confirming}
        onHide={() => setConfirming(false)}
        recipient={selected}
        amount={amountInput}
        onConfirm={handleBizum}
      />

      <div className="row px-5 py-4">
        <div className="col-12 mb-lg-4 text-center">
          <img
            src={Banner}
            className="img-fluid col-lg-6 col-md-8 col-sm-11 col-10"
            alt="Logo de InfoBizum"
          />
        </div>
      </div>

      <div className="row mx-5 d-flex align-items-center">
        <div className="col-lg-7">
          <div style={{ height: "1.5em" }}></div>
        </div>
        <div className="col-lg-5">
          <span>Disponible: {formatUsd(availableBalance)}</span>
        </div>
      </div>
      <div className="row mx-5 d-flex align-items-center">
        <div className="col-lg-7 mb-4">
          <div className="d-flex">
            <div className="dropdown w-100 me-2">
              <label htmlFor="searchUser" className="visually-hidden">
                Buscar usuario
              </label>
              <input
                autoComplete="off"
                id="searchUser"
                className="form-control dropdown-toggle"
                placeholder="Buscar usuario..."
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
              />

              <ul
                className={`dropdown-menu${
                  typed !== "" && !selected && suggestions.length > 0
                    ? " show"
                    : ""
                }`}
              >
                {suggestions.map((candidate) => (
                  <UserItem
                    key={candidate.id}
                    user={candidate}
                    onClick={() => setUserInput(candidate.username)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-3 mb-4">
          <div className="input-group">
            <label htmlFor="cantidad" className="visually-hidden">
              Cantidad
            </label>
            <input
              id="cantidad"
              type="text"
              className={"form-control" + (isInputInvalid ? " is-invalid" : "")}
              placeholder="Cantidad..."
              value={amountInput}
              onChange={handleAmountInput}
            />
            <span className="input-group-text">$</span>
          </div>
        </div>
        <div className="col-lg-2 mb-4">
          <button
            type="button"
            className={`btn`}
            disabled={!activeButton || transfer.isPending}
            style={{ backgroundColor: "#2c6b48", color: "white" }}
            onClick={() => setConfirming(true)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
}
