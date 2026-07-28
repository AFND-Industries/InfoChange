import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BusyOverlay from "../../../components/BusyOverlay";
import { useSession } from "../../../hooks/useSession";
import { useTrade } from "../../../hooks/useWallet";
import { ApiError } from "../../../lib/api";
import { formatAsset } from "../../../lib/format";
import { useToast } from "../../../providers/ToastProvider";
import { useTrading } from "../context/TradingContext";
import JustCloseModal from "./JustCloseModal";
import TradeConfirmationModal from "./TradeConfirmationModal";
import TradePanel from "./TradePanel";

/** Comision del exchange: la misma que aplica el servidor, 0,065 %. */
const TRADING_FEE = 0.00065;

/** Tope que acepta la API; escribir mas no sirve de nada. */
const MAX_AMOUNT = 1_000_000_000;

/** Solo digitos y como mucho ocho decimales. */
const AMOUNT_PATTERN = /^\d*(\.\d{0,8})?$/;

const EMPTY_SIDE = { paid: "", received: "", range: 0 };

/** Cantidad calculada, lista para meter en un campo de texto. */
const toAmountText = (value) => (Number.isFinite(value) ? value.toFixed(8) : "");

/** La cadena que espera la API: sin punto suelto ni parte entera vacia. */
function normalizeAmount(text) {
    const value = text.trim();
    if (value.length === 0) return "";

    const [whole, fraction] = value.split(".");
    const integerPart = whole.length === 0 ? "0" : whole;
    return fraction === undefined || fraction.length === 0
        ? integerPart
        : `${integerPart}.${fraction}`;
}

/**
 * Formulario de compra y venta. Solo se monta con un par valido: la pantalla ya
 * avisa antes si el simbolo de la URL no existe.
 */
function BuyAndSell() {
    const navigate = useNavigate();
    const toast = useToast();

    const { pair, price, mode } = useTrading();
    const { status, balances } = useSession();
    const trade = useTrade();

    // Pestana visible en movil; en pantallas medianas se ven los dos paneles.
    const [visibleSide, setVisibleSide] = useState("BUY");
    const [buy, setBuy] = useState(EMPTY_SIDE);
    const [sell, setSell] = useState(EMPTY_SIDE);
    const [alert, setAlert] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const symbol = pair.symbol;

    useEffect(() => {
        setBuy(EMPTY_SIDE);
        setSell(EMPTY_SIDE);
    }, [symbol]);

    const quoteDecimals = mode === 0 ? 2 : 8;
    const baseLabel = mode === 0 ? pair.baseAssetName : pair.baseAsset;
    const quoteName = mode === 0 ? "dólares" : pair.quoteAsset;
    // En modo novato la moneda de cambio se presenta como dinero de toda la
    // vida; en modo profesional se nombra el activo.
    const quoteSuffix = mode === 0 ? "$" : " " + pair.quoteAsset;

    const paidAssetOf = (side) => (side === "BUY" ? pair.quoteAsset : pair.baseAsset);

    const balanceOf = useCallback(
        (asset) => {
            const found = balances.find((balance) => balance.asset === asset);
            return found === undefined ? 0 : Number(found.quantity);
        },
        [balances],
    );

    /** Pasa de lo que se paga a lo que se recibe (o al reves), sin comision. */
    const convert = (side, field, value) => {
        if (!(price > 0)) return NaN;
        if (field === "paid") return side === "BUY" ? value / price : value * price;
        return side === "BUY" ? value * price : value / price;
    };

    /** Estado completo de un lado a partir del campo que se acaba de tocar. */
    const buildSide = (side, field, text) => {
        const numeric = Number(text);
        const opposite =
            text.length === 0 || !Number.isFinite(numeric)
                ? ""
                : toAmountText(convert(side, field, numeric));

        const paid = field === "paid" ? text : opposite;
        const received = field === "paid" ? opposite : text;

        const available = balanceOf(paidAssetOf(side));
        const spent = Number(paid);
        const range =
            available > 0 && Number.isFinite(spent)
                ? Math.min(100, (100 * spent) / available)
                : 0;

        return { paid, received, range };
    };

    const setSide = (side, next) => (side === "BUY" ? setBuy(next) : setSell(next));

    const handleAmountChange = (side, field) => (event) => {
        const text = event.target.value.trim();
        // Lo que no encaje se ignora, de modo que el campo nunca llega a
        // contener algo que no sea una cantidad.
        if (!AMOUNT_PATTERN.test(text) || Number(text) > MAX_AMOUNT) return;

        setSide(side, buildSide(side, field, text));
    };

    const handleRangeChange = (side) => (event) => {
        const percent = Number(event.target.value);
        const amount = (percent / 100) * balanceOf(paidAssetOf(side));
        const next = buildSide(side, "paid", amount > 0 ? amount.toFixed(8) : "");

        // Se respeta la posicion exacta del deslizador en lugar de recalcularla
        // desde la cantidad, que redondea a ocho decimales.
        setSide(side, { ...next, range: percent });
    };

    /** Comision y cantidad recibida estimadas, con el mismo calculo que la API. */
    const estimate = (side) => {
        const state = side === "BUY" ? buy : sell;
        const paid = Number(state.paid);

        if (!(price > 0) || !Number.isFinite(paid) || paid <= 0) {
            return { fee: 0, received: 0 };
        }

        const fee = paid * TRADING_FEE;
        const net = paid - fee;
        return { fee, received: side === "BUY" ? net / price : net * price };
    };

    const execute = async (side, quantity) => {
        setConfirmation(null);

        try {
            const { trade: done } = await trade.mutateAsync({ symbol, quantity, side });

            setBuy(EMPTY_SIDE);
            setSell(EMPTY_SIDE);

            toast.success(
                side === "BUY" ? "Compra realizada con éxito" : "Venta realizada con éxito",
                side === "BUY" ? (
                    <>
                        Has comprado <b>{formatAsset(done.receivedAmount)} {baseLabel}</b> por{" "}
                        <b>{formatAsset(done.paidAmount, quoteDecimals)}{quoteSuffix}</b> y has
                        pagado <b>{formatAsset(done.fee, quoteDecimals)}{quoteSuffix}</b> de
                        comisión.
                    </>
                ) : (
                    <>
                        Has vendido <b>{formatAsset(done.paidAmount)} {baseLabel}</b> por{" "}
                        <b>{formatAsset(done.receivedAmount, quoteDecimals)}{quoteSuffix}</b> y has
                        pagado <b>{formatAsset(done.fee)} {baseLabel}</b> de comisión.
                    </>
                ),
            );
        } catch (error) {
            toast.error(
                "La operación no se ha completado",
                error instanceof ApiError
                    ? error.message
                    : "Se ha producido un error inesperado.",
            );
        }
    };

    const submit = (side) => {
        const state = side === "BUY" ? buy : sell;
        const quantity = normalizeAmount(state.paid);
        const amount = Number(quantity);

        if (!(price > 0) || !(amount > 0)) {
            setAlert({
                title: "Error",
                body: "El monto de la transacción introducido no es válido",
            });
            return;
        }

        if (balanceOf(paidAssetOf(side)) < amount) {
            setAlert({
                title: "Error",
                body: `No tienes suficientes ${side === "BUY" ? quoteName : baseLabel}`,
            });
            return;
        }

        // En modo novato se pide confirmacion antes de mover dinero.
        if (mode === 0) {
            setConfirmation({ side, quantity, received: estimate(side).received });
            return;
        }

        execute(side, quantity);
    };

    // El modal sigue montado mientras se desvanece, asi que se comprueba que
    // quede algo que confirmar.
    const confirmTrade = () => {
        if (confirmation !== null) execute(confirmation.side, confirmation.quantity);
    };

    const notLoggedButton = (
        <button
            className="btn w-100 mb-2"
            style={{
                backgroundColor: "#4F4F4F",
                fontWeight: "bold",
                cursor: "default",
            }}
        >
            <span
                style={{ color: "#ffbb00", cursor: "pointer" }}
                onClick={() => navigate("/login")}
            >
                Inicia sesión
            </span>
            <span className="text-white"> o </span>
            <span
                style={{ color: "#ffbb00", cursor: "pointer" }}
                onClick={() => navigate("/register")}
            >
                Regístrate ahora
            </span>
        </button>
    );

    const swapButton = (
        <div className="col d-md-none d-flex justify-content-center align-items-center flex-md-row flex-column mb-3">
            <ul className="nav nav-tabs nav-justified w-100" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${visibleSide === "BUY"
                            ? "active bg-primary text-white"
                            : "text-dark"
                            }`}
                        type="button"
                        role="tab"
                        aria-selected={visibleSide === "BUY"}
                        onClick={() => setVisibleSide("BUY")}
                    >
                        Comprar
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${visibleSide === "SELL"
                            ? "active bg-primary text-white"
                            : "text-dark"
                            }`}
                        type="button"
                        role="tab"
                        aria-selected={visibleSide === "SELL"}
                        onClick={() => setVisibleSide("SELL")}
                    >
                        Vender
                    </button>
                </li>
            </ul>
        </div>
    );

    const buyEstimate = estimate("BUY");
    const sellEstimate = estimate("SELL");
    const loggedIn = status === "authenticated";

    return (
        <>
            <BusyOverlay show={trade.isPending} />

            <TradePanel
                mode={mode}
                className="me-1"
                hiddenOnMobile={visibleSide === "SELL"}
                tabs={swapButton}
                available={`${formatAsset(balanceOf(pair.quoteAsset), quoteDecimals)}${quoteSuffix}`}
                amount={{
                    id: "buyAmount",
                    label: "Cantidad a comprar",
                    suffix: quoteSuffix,
                    value: buy.paid,
                    onChange: handleAmountChange("BUY", "paid"),
                }}
                total={{
                    id: "buyTotal",
                    suffix: baseLabel,
                    value: buy.received,
                    onChange: handleAmountChange("BUY", "received"),
                }}
                range={{
                    id: "buyRange",
                    label: "Rango de compra",
                    value: buy.range,
                    onChange: handleRangeChange("BUY"),
                }}
                receives={
                    mode === 0
                        ? `Recibes: ${formatAsset(buyEstimate.received)} ${baseLabel}`
                        : null
                }
                fee={`Comisión: ${formatAsset(buyEstimate.fee, quoteDecimals)}${quoteSuffix}`}
                submitLabel={`Comprar ${baseLabel}`}
                submitVariant="success"
                onSubmit={() => submit("BUY")}
                busy={trade.isPending}
                loggedIn={loggedIn}
                notLoggedButton={notLoggedButton}
            />

            <TradePanel
                mode={mode}
                className="ms-md-2"
                hiddenOnMobile={visibleSide === "BUY"}
                tabs={swapButton}
                available={`${formatAsset(balanceOf(pair.baseAsset))} ${baseLabel}`}
                amount={{
                    id: "sellAmount",
                    label: "Cantidad a vender",
                    suffix: baseLabel,
                    value: sell.paid,
                    onChange: handleAmountChange("SELL", "paid"),
                }}
                total={{
                    id: "sellTotal",
                    suffix: quoteSuffix,
                    value: sell.received,
                    onChange: handleAmountChange("SELL", "received"),
                }}
                range={{
                    id: "sellRange",
                    label: "Rango de venta",
                    value: sell.range,
                    onChange: handleRangeChange("SELL"),
                }}
                receives={
                    mode === 0
                        ? `Recibes: ${formatAsset(sellEstimate.received, quoteDecimals)}$`
                        : null
                }
                fee={`Comisión: ${formatAsset(sellEstimate.fee)} ${baseLabel}`}
                submitLabel={`Vender ${baseLabel}`}
                submitVariant="danger"
                onSubmit={() => submit("SELL")}
                busy={trade.isPending}
                loggedIn={loggedIn}
                notLoggedButton={notLoggedButton}
            />

            <TradeConfirmationModal
                show={confirmation !== null}
                title="¡ATENCIÓN!"
                body={
                    confirmation === null ? null : confirmation.side === "BUY" ? (
                        <>
                            Estás a punto de comprar{" "}
                            <b>{formatAsset(confirmation.received)} {baseLabel}</b>. ¿Estás seguro?
                        </>
                    ) : (
                        <>
                            Estás a punto de vender{" "}
                            <b>{formatAsset(confirmation.quantity)} {baseLabel}</b>. ¿Estás seguro?
                        </>
                    )
                }
                onConfirm={confirmTrade}
                onHide={() => setConfirmation(null)}
            />

            <JustCloseModal
                show={alert !== null}
                title={alert === null ? "" : alert.title}
                body={alert === null ? null : alert.body}
                onHide={() => setAlert(null)}
            />
        </>
    );
}

export default BuyAndSell;
