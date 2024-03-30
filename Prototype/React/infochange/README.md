# Introducción

Este documento describe cómo obtenemos y manipulamos los datos en nuestro proyecto, utilizando las API de CoinMarketCap y Binance. CoinMarketCap proporciona información sobre diversas criptomonedas, mientras que Binance ofrece datos de mercado para los diferentes pares de criptomonedas. No todas las monedas listadas en CoinMarketCap tienen un par correspondiente en Binance, pero prácticamente todos los pares de Binance tienen sus respectivas criptomonedas en CoinMarketCap.

## 1. API de CoinMarketCap

Las claves de la API son gratuitas pero tienen un límite de uso. Si se agota una clave, otro miembro puede utilizar una gratuita.

- API de Eulogio: `3a94b334-3f31-4a37-81b4-bf8abdd62f3e`

### 1.1. Endpoint cryptocurrency

- Endpoint: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info`
- Parámetros: `CMC_PRO_API_KEY` (obligatorio) y `symbol` (obligatorio)
- Descripción: Proporciona información detallada sobre una criptomoneda específica. Por ejemplo, al solicitar información sobre BTC, obtenemos su nombre completo, enlace al logo, descripción y otra información relevante.

## 2. API de Binance

La API de Binance ofrece información de mercado sobre los pares que maneja.

### 2.1. API REST

Esta API no requiere una clave, pero tiene limitaciones de uso por minuto.

#### 2.1.1. Endpoint exchangeInfo

- Endpoint: `https://api.binance.com/api/v1/exchangeInfo`
- Descripción: Proporciona información general sobre el exchange, incluyendo todos los pares de activos, precisión en el precio y otros detalles.

#### 2.1.2. Endpoint klines

- Endpoint: `https://api.binance.com/api/v3/klines`
- Parámetros: `symbol` (obligatorio), `interval` (obligatorio) y `limit`
- Descripción: Obtiene el gráfico histórico de una moneda para un intervalo dado, mostrado como velas.

#### 2.1.3 Endpoint ticker

- Endpoint: `https://api.binance.com/api/v1/ticker/price`
- Descripcion: Proporciona todos los símbolos junto a su precio actual.

### 2.2. WebSockets

Estos endpoints transmiten información en tiempo real a través de un socket.

#### 2.2.1. Endpoint kline

- Endpoint: `wss://stream.binance.com:9443/ws/SYMBOL@kline_TIMESCALE`
- Descripción: Transmite nuevas velas del gráfico para el símbolo dado a intervalos regulares.
- Frecuencia: `1000ms`.

#### 2.2.2. Endpoint trade

- Endpoint: `wss://stream.binance.com:9443/ws/SYMBOL@trade`
- Descripción: Transmite el precio del símbolo indicado a intervalos regulares.
- Frecuencia: `50ms`.

## Procedimiento

Estos procedimientos pueden cambiar, ya que cuando tengamos backend, podemos tener el servidor conectado siempre con toda la información y no haría falta reconectarse en cada sesión, como se hace ahora mismo.

- Utilizamos 2.2.1 para obtener el precio de una moneda en tiempo real.
- Para mostrar un gráfico en tiempo real, obtenemos el histórico de 2.1.2 y lo actualizamos con 2.2.1. Además, para obtener una frecuencia mayor (ya que 2.2.1 envía cada `1000ms`) usamos 2.2.1 para actualizar las nuevas velas, de forma que obtenemos nuestro gráfico en tiempo real con una frecuencia de `50ms`.
- `TO-DO` Con 2.1.1 obtenemos información estática que guardamos en `data/Symbols.json`, actualizándola periódicamente (automáticamente).
- Utilizamos 1.1 para obtener información detallada sobre una moneda, combinándola con 2.1.1 para mostrar información adicional sobre la moneda base en el proyecto. El problema es que esta llamada tiene mucha información y la mayoría estática. Esto junto con el problema de que el parámetro `symbols` es obligatorio y para pedir información de todas las monedas es costoso, nos ha llevado al camino de guardar la información en `data/CoinMarketCapData.json` y solo leerla desde ahí. 
- Utilizamos 2.1.3 para obtener el precio de todos los pares y poder mostrarlo donde sea necesario. `TO-DO` Cada cierto tiempo, se vuelve a pedir, para que la información no este demasiado desfasada.

## Función para Obtener Información de CoinMarketCap

Por si llega a ser necesario, la función que hemos utilizado para crear el enlace que nos devuelve la información de todas las monedas que queremos es:

```javascript
async function getCoinMarketCapAPIRequestLink() {
    try {
        const response = await axios.get('https://api.binance.com/api/v1/exchangeInfo');
        const symbolsData = response.data.symbols;

        const baseAssets = new Set(symbolsData.map(s => s.baseAsset));
        const quoteAssets = new Set(symbolsData.map(s => s.quoteAsset));

        const symbols = [...new Set([...baseAssets, ...quoteAssets])];
        const coins = Array.from(symbols).join(",");

        return `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?CMC_PRO_API_KEY=API_KEY&skip_invalid=true&symbol=${coins}`;
    } catch (error) {
        console.error('Error en la solicitud a la API de Binance:', error);
    }
}
```

## En caso de querer actualizar la información

1. Usa 2.1.1 para obtener todos los símbolos. Guardar en Symbols.json
2. Obtén la unión de conjuntos de los baseAsset y quoteAsset de cada símbolo. Guarda en Coins.json todas las monedas y el subconjunto que no tiene información en CoinMarketCap.
3. Utiliza getCoinMarketCapAPIRequestLink para obtener la información a guardar en CoinMarketCapData.json.