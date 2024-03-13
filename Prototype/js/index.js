let price = 73000;
let lastPrice = null;
let usd = 0;
let btc = 1;

const priceText = document.getElementById("price");
const usdtext = document.getElementById("usd");
const btcText = document.getElementById("btc");
const title = document.getElementById("title");

const buyButton = document.getElementById("buyButton");
const sellButton = document.getElementById("sellButton");

buyButton.onclick = buyBitcoin;
sellButton.onclick = sellBitcoin;

let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
ws.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    price = parseFloat(stockObject.p);
    displayPrice();
}

function getPrice() {
    return price;
}

function displayPrice() {
    priceText.style.color = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? ' green' : 'red';
    priceText.textContent = "Bitcoin: " + getPrice() + " $";
    title.textContent = "BTCUSD " + getPrice();
    lastPrice = price;
}

function displayMoney() {
    usdtext.textContent = "Saldo dólares: " + usd.toFixed(2) + " $";
    btcText.textContent = "Saldo Bitcoin: " + btc.toFixed(9) + " BTC";
}

function buyBitcoin() {
    if (usd > 0) {
        btc = usd / price;
        usd = 0;

        displayMoney();
    }
}

function sellBitcoin() {
    if (btc > 0) {
        usd = btc * price;
        btc = 0;

        displayMoney();
    }
}

displayPrice();
displayMoney();