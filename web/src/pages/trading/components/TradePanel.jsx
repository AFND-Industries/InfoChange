/**
 * Un lado del formulario de trading (comprar o vender). El marcado de los dos
 * paneles era identico salvo por los textos, asi que vive aqui una sola vez y
 * `BuyAndSell` se queda con el calculo y las llamadas a la API.
 *
 * En movil solo se ve uno de los dos, elegido con las pestanas de `tabs`.
 */
function TradePanel({
    mode = 0,
    className = "",
    hiddenOnMobile = false,
    tabs,
    available,
    amount,
    total,
    range,
    receives,
    fee,
    submitLabel,
    submitVariant,
    onSubmit,
    busy = false,
    loggedIn = false,
    notLoggedButton,
}) {
    return (
        <div className={`col-md border border-4 rounded ${className} ${hiddenOnMobile ? "d-md-block d-none" : ""}`}>
            <div className="mt-1 mb-1 d-flex flex-column row align-items-center justify-content-between">
                {tabs}
                <div className="d-flex justify-content-start flex-sm-row flex-column">
                    <div className="me-1">Disponible:</div>
                    <div>{available}</div>
                </div>
            </div>
            <div className="input-group input-group-sm">
                <label htmlFor={amount.id} className="visually-hidden">{amount.label}</label>
                <input
                    type="text"
                    id={amount.id}
                    className="form-control"
                    placeholder={amount.label}
                    value={amount.value}
                    onChange={amount.onChange}
                />
                <span className="input-group-text">{amount.suffix}</span>
            </div>
            {mode === 1 && (
                <>
                    <label htmlFor={range.id} className="visually-hidden">{range.label}</label>
                    <input
                        type="range"
                        id={range.id}
                        className="form-range"
                        value={range.value}
                        onChange={range.onChange}
                    />
                    <div className="input-group input-group-sm">
                        <label htmlFor={total.id} className="visually-hidden">
                            Total sin comisiones
                        </label>
                        <input
                            type="text"
                            id={total.id}
                            className="form-control"
                            placeholder="Total (sin comisiones)"
                            value={total.value}
                            onChange={total.onChange}
                        />
                        <span className="input-group-text">{total.suffix}</span>
                    </div>
                </>
            )}
            <div className="row mt-1 mb-1 d-flex justify-content-between">
                <div className="col-lg-6">
                    {receives === null ? null : <span>{receives}</span>}
                </div>
                <div className="col-lg-6 d-flex justify-content-lg-end">
                    <span className="text-end">{fee}</span>
                </div>
            </div>
            {loggedIn ? (
                <button
                    className={`btn btn-${submitVariant} w-100 mb-2`}
                    onClick={onSubmit}
                    disabled={busy}
                >
                    {submitLabel}
                </button>
            ) : (
                notLoggedButton
            )}
        </div>
    );
}

export default TradePanel;
