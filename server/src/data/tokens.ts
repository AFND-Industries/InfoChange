/**
 * Catalogo de activos: nombre legible, logo y slug para cada simbolo.
 *
 * Se genera a partir del volcado original de CoinMarketCap con
 * `scripts/build-token-data.mjs`. Se guarda como modulo TypeScript y no como
 * JSON porque asi se empaqueta igual con tsx en local, con esbuild en Vercel y
 * con vitest en los tests, sin depender de import attributes ni de que el
 * fichero acabe dentro del bundle de la funcion.
 */
export interface TokenInfo {
  name: string;
  logo: string;
  slug: string;
}

export const tokenCatalog: Record<string, TokenInfo> = {
  "1000SATS": {
    "name": "SATS",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28683.png",
    "slug": "sats"
  },
  "1INCH": {
    "name": "1inch Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png",
    "slug": "1inch"
  },
  "1INCHDOWN": {
    "name": "1INCHDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11957.png",
    "slug": "1inchdown"
  },
  "1INCHUP": {
    "name": "1INCHUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11956.png",
    "slug": "1inchup"
  },
  "AAVE": {
    "name": "Aave",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
    "slug": "aave"
  },
  "AAVEDOWN": {
    "name": "AAVEDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7775.png",
    "slug": "aave-down"
  },
  "AAVEUP": {
    "name": "AAVEUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7774.png",
    "slug": "aave-up"
  },
  "ACA": {
    "name": "Acala Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6756.png",
    "slug": "acala"
  },
  "ACE": {
    "name": "Fusionist",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28674.png",
    "slug": "fusionist"
  },
  "ACH": {
    "name": "Alchemy Pay",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6958.png",
    "slug": "alchemy-pay"
  },
  "ACM": {
    "name": "AC Milan Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8538.png",
    "slug": "ac-milan-fan-token"
  },
  "ADA": {
    "name": "Cardano",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
    "slug": "cardano"
  },
  "ADADOWN": {
    "name": "ADADOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7014.png",
    "slug": "adadown"
  },
  "ADAUP": {
    "name": "ADAUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7013.png",
    "slug": "adaup"
  },
  "ADX": {
    "name": "AdEx",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1768.png",
    "slug": "adx-net"
  },
  "AE": {
    "name": "Æternity",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1700.png",
    "slug": "aeternity"
  },
  "AERGO": {
    "name": "Aergo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3637.png",
    "slug": "aergo"
  },
  "AEUR": {
    "name": "Anchored Coins AEUR",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28596.png",
    "slug": "anchored-coins-aeur"
  },
  "AEVO": {
    "name": "Aevo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29676.png",
    "slug": "aevo"
  },
  "AGI": {
    "name": "Delysium",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24007.png",
    "slug": "delysium"
  },
  "AGIX": {
    "name": "SingularityNET",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2424.png",
    "slug": "singularitynet"
  },
  "AGLD": {
    "name": "Adventure Gold",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11568.png",
    "slug": "adventure-gold"
  },
  "AI": {
    "name": "Sleepless AI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28846.png",
    "slug": "sleepless-ai"
  },
  "AION": {
    "name": "Aion",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2062.png",
    "slug": "aion"
  },
  "AKRO": {
    "name": "Akropolis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4134.png",
    "slug": "akropolis"
  },
  "ALCX": {
    "name": "Alchemix",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8613.png",
    "slug": "alchemix"
  },
  "ALGO": {
    "name": "Algorand",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png",
    "slug": "algorand"
  },
  "ALICE": {
    "name": "MyNeighborAlice",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8766.png",
    "slug": "myneighboralice"
  },
  "ALPACA": {
    "name": "Alpaca Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8707.png",
    "slug": "alpaca-finance"
  },
  "ALPHA": {
    "name": "Stella",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7232.png",
    "slug": "alpha-finance-lab"
  },
  "ALPINE": {
    "name": "Alpine F1 Team Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18112.png",
    "slug": "alpine-f1-team-fan-token"
  },
  "ALT": {
    "name": "Altlayer",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29073.png",
    "slug": "altlayer"
  },
  "AMB": {
    "name": "AirDAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2081.png",
    "slug": "airdao"
  },
  "AMP": {
    "name": "Amp",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6945.png",
    "slug": "amp"
  },
  "ANC": {
    "name": "Anchor Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8857.png",
    "slug": "anchor-protocol"
  },
  "ANKR": {
    "name": "Ankr",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3783.png",
    "slug": "ankr"
  },
  "ANT": {
    "name": "Aragon",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1680.png",
    "slug": "aragon"
  },
  "ANY": {
    "name": "Anyswap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5892.png",
    "slug": "anyswap"
  },
  "APE": {
    "name": "ApeCoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png",
    "slug": "apecoin-ape"
  },
  "API3": {
    "name": "API3",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7737.png",
    "slug": "api3"
  },
  "APPC": {
    "name": "AppCoins",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2344.png",
    "slug": "appcoins"
  },
  "APT": {
    "name": "Aptos",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png",
    "slug": "aptos"
  },
  "AR": {
    "name": "Arweave",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5632.png",
    "slug": "arweave"
  },
  "ARB": {
    "name": "Arbitrum",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
    "slug": "arbitrum"
  },
  "ARDR": {
    "name": "Ardor",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1320.png",
    "slug": "ardor"
  },
  "ARK": {
    "name": "Ark",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1586.png",
    "slug": "ark"
  },
  "ARKM": {
    "name": "Arkham",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/27565.png",
    "slug": "arkham"
  },
  "ARPA": {
    "name": "ARPA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4039.png",
    "slug": "arpa-chain"
  },
  "ARS": {
    "name": "Aquarius Loan",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/27847.png",
    "slug": "aquarius-loan"
  },
  "ASR": {
    "name": "AS Roma Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5229.png",
    "slug": "as-roma-fan-token"
  },
  "AST": {
    "name": "AirSwap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2058.png",
    "slug": "airswap"
  },
  "ASTR": {
    "name": "Astar",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12885.png",
    "slug": "astar"
  },
  "ATA": {
    "name": "Automata Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10188.png",
    "slug": "automata-network"
  },
  "ATM": {
    "name": "Atletico De Madrid Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5227.png",
    "slug": "atletico-de-madrid-fan-token"
  },
  "ATOM": {
    "name": "Cosmos",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png",
    "slug": "cosmos"
  },
  "AUCTION": {
    "name": "Bounce Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8602.png",
    "slug": "bounce-token"
  },
  "AUD": {
    "name": "Aussie Digital",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23334.png",
    "slug": "aussie-digital"
  },
  "AUDIO": {
    "name": "Audius",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7455.png",
    "slug": "audius"
  },
  "AUTO": {
    "name": "Auto",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8387.png",
    "slug": "auto"
  },
  "AVA": {
    "name": "AVA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2776.png",
    "slug": "ava"
  },
  "AVAX": {
    "name": "Avalanche",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
    "slug": "avalanche"
  },
  "AXL": {
    "name": "Axelar",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/17799.png",
    "slug": "axelar"
  },
  "AXS": {
    "name": "Axie Infinity",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png",
    "slug": "axie-infinity"
  },
  "BADGER": {
    "name": "Badger DAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7859.png",
    "slug": "badger-dao"
  },
  "BAKE": {
    "name": "BakeryToken",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7064.png",
    "slug": "bakerytoken"
  },
  "BAL": {
    "name": "Balancer",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png",
    "slug": "balancer"
  },
  "BAND": {
    "name": "Band Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4679.png",
    "slug": "band-protocol"
  },
  "BAR": {
    "name": "FC Barcelona Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5225.png",
    "slug": "fc-barcelona-fan-token"
  },
  "BAT": {
    "name": "Basic Attention Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1697.png",
    "slug": "basic-attention-token"
  },
  "BCC": {
    "name": "BitConnect",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1513.png",
    "slug": "bitconnect"
  },
  "BCD": {
    "name": "Bitcoin Diamond",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2222.png",
    "slug": "bitcoin-diamond"
  },
  "BCH": {
    "name": "Bitcoin Cash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png",
    "slug": "bitcoin-cash"
  },
  "BCHABC": {
    "name": "Bitcoin Cash ABC [IOU]",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3601.png",
    "slug": "bitcoin-cash-abc"
  },
  "BCHDOWN": {
    "name": "BCHDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7523.png",
    "slug": "bchdown"
  },
  "BCHUP": {
    "name": "BCHUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7522.png",
    "slug": "bchup"
  },
  "BCN": {
    "name": "Bytecoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/372.png",
    "slug": "bytecoin-bcn"
  },
  "BCPT": {
    "name": "Blockmason Credit Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2061.png",
    "slug": "blockmason"
  },
  "BDOT": {
    "name": "BabyDot",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11058.png",
    "slug": "babydot"
  },
  "BEAM": {
    "name": "Beam",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28298.png",
    "slug": "onbeam"
  },
  "BEAR": {
    "name": "Bear (Ordinals)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28483.png",
    "slug": "bear-ordinals"
  },
  "BEL": {
    "name": "Bella Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6928.png",
    "slug": "bella-protocol"
  },
  "BETA": {
    "name": "Beta Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11307.png",
    "slug": "beta-finance"
  },
  "BETH": {
    "name": "Beacon ETH",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8353.png",
    "slug": "beacon-eth"
  },
  "BGBP": {
    "name": "Binance GBP Stable Coin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4186.png",
    "slug": "binance-gbp-stable-coin"
  },
  "BICO": {
    "name": "Biconomy",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9543.png",
    "slug": "biconomy"
  },
  "BIDR": {
    "name": "BIDR",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6855.png",
    "slug": "binance-idr"
  },
  "BIFI": {
    "name": "Beefy",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7311.png",
    "slug": "beefy-finance"
  },
  "BKRW": {
    "name": "Binance KRW",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5483.png",
    "slug": "binance-krw"
  },
  "BLUR": {
    "name": "Blur",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23121.png",
    "slug": "blur-token"
  },
  "BLZ": {
    "name": "Bluzelle",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2505.png",
    "slug": "bluzelle"
  },
  "BNB": {
    "name": "BNB",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    "slug": "bnb"
  },
  "BNBDOWN": {
    "name": "BNBDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7010.png",
    "slug": "bnbdown"
  },
  "BNBUP": {
    "name": "BNBUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7009.png",
    "slug": "bnbup"
  },
  "BNT": {
    "name": "Bancor",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1727.png",
    "slug": "bancor"
  },
  "BNX": {
    "name": "BinaryX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23635.png",
    "slug": "binaryx-new"
  },
  "BOME": {
    "name": "BOOK OF MEME",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29870.png",
    "slug": "book-of-meme"
  },
  "BOND": {
    "name": "BarnBridge",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7440.png",
    "slug": "barnbridge"
  },
  "BONK": {
    "name": "Bonk",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
    "slug": "bonk1"
  },
  "BOT": {
    "name": "Bot Planet",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/16238.png",
    "slug": "bot-planet"
  },
  "BRD": {
    "name": "Bread",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2306.png",
    "slug": "bread"
  },
  "BRL": {
    "name": "Borealis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/16660.png",
    "slug": "borealis"
  },
  "BSW": {
    "name": "Biswap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10746.png",
    "slug": "biswap"
  },
  "BTC": {
    "name": "Bitcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    "slug": "bitcoin"
  },
  "BTCB": {
    "name": "Bitcoin BEP2",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4023.png",
    "slug": "bitcoin-bep2"
  },
  "BTCDOWN": {
    "name": "BTCDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5609.png",
    "slug": "btcdown"
  },
  "BTCST": {
    "name": "Bitcoin Standard Hashrate Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8891.png",
    "slug": "btc-standard-hashrate-token"
  },
  "BTCUP": {
    "name": "BTCUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5608.png",
    "slug": "btcup"
  },
  "BTG": {
    "name": "Bitcoin Gold",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2083.png",
    "slug": "bitcoin-gold"
  },
  "BTS": {
    "name": "BitShares",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/463.png",
    "slug": "bitshares"
  },
  "BTT": {
    "name": "BitTorrent (New)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png",
    "slug": "bittorrent-new"
  },
  "BULL": {
    "name": "Mumu the Bull",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28415.png",
    "slug": "mumu-the-bull-erc"
  },
  "BURGER": {
    "name": "BurgerCities",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7158.png",
    "slug": "burger-cities"
  },
  "BUSD": {
    "name": "BUSD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
    "slug": "binance-usd"
  },
  "BVND": {
    "name": "Binance VND",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8058.png",
    "slug": "binance-vnd"
  },
  "BZRX": {
    "name": "bZx Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5810.png",
    "slug": "bzx-protocol"
  },
  "C98": {
    "name": "Coin98",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10903.png",
    "slug": "coin98"
  },
  "CAKE": {
    "name": "PancakeSwap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png",
    "slug": "pancakeswap"
  },
  "CDT": {
    "name": "CheckDot",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/14489.png",
    "slug": "checkdot"
  },
  "CELO": {
    "name": "Celo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5567.png",
    "slug": "celo"
  },
  "CELR": {
    "name": "Celer Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3814.png",
    "slug": "celer-network"
  },
  "CFX": {
    "name": "Conflux",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7334.png",
    "slug": "conflux-network"
  },
  "CHAT": {
    "name": "Solchat",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29478.png",
    "slug": "solchat"
  },
  "CHESS": {
    "name": "Tranchess",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10974.png",
    "slug": "tranchess"
  },
  "CHR": {
    "name": "Chromia",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3978.png",
    "slug": "chromia"
  },
  "CHZ": {
    "name": "Chiliz",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png",
    "slug": "chiliz"
  },
  "CITY": {
    "name": "Manchester City Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10049.png",
    "slug": "manchester-city-fan-token"
  },
  "CKB": {
    "name": "Nervos Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4948.png",
    "slug": "nervos-network"
  },
  "CLOAK": {
    "name": "CloakCoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/362.png",
    "slug": "cloakcoin"
  },
  "CLV": {
    "name": "CLV",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8384.png",
    "slug": "clover"
  },
  "CMT": {
    "name": "Comet",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1291.png",
    "slug": "comet"
  },
  "CND": {
    "name": "Coinhound",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24090.png",
    "slug": "coinhound"
  },
  "COMBO": {
    "name": "COMBO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4275.png",
    "slug": "combo-network"
  },
  "COMP": {
    "name": "Compound",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png",
    "slug": "compound"
  },
  "COS": {
    "name": "Contentos",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4036.png",
    "slug": "contentos"
  },
  "COTI": {
    "name": "COTI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3992.png",
    "slug": "coti"
  },
  "COVER": {
    "name": "COVER Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8175.png",
    "slug": "cover-protocol-new"
  },
  "CREAM": {
    "name": "Cream Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6193.png",
    "slug": "cream-finance"
  },
  "CRV": {
    "name": "Curve DAO Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png",
    "slug": "curve-dao-token"
  },
  "CTK": {
    "name": "Shentu",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4807.png",
    "slug": "shentu"
  },
  "CTSI": {
    "name": "Cartesi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5444.png",
    "slug": "cartesi"
  },
  "CTXC": {
    "name": "Cortex",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2638.png",
    "slug": "cortex"
  },
  "CVC": {
    "name": "Civic",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1816.png",
    "slug": "civic"
  },
  "CVP": {
    "name": "PowerPool",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6669.png",
    "slug": "powerpool"
  },
  "CVX": {
    "name": "Convex Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9903.png",
    "slug": "convex-finance"
  },
  "CYBER": {
    "name": "CyberConnect",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24781.png",
    "slug": "cyberconnect"
  },
  "DAI": {
    "name": "Dai",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    "slug": "multi-collateral-dai"
  },
  "DAR": {
    "name": "Mines of Dalarnia",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11374.png",
    "slug": "mines-of-dalarnia"
  },
  "DASH": {
    "name": "Dash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/131.png",
    "slug": "dash"
  },
  "DATA": {
    "name": "Streamr",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2143.png",
    "slug": "streamr"
  },
  "DCR": {
    "name": "Decred",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1168.png",
    "slug": "decred"
  },
  "DEGO": {
    "name": "Dego Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7087.png",
    "slug": "dego-finance"
  },
  "DENT": {
    "name": "Dent",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1886.png",
    "slug": "dent"
  },
  "DEXE": {
    "name": "DeXe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7326.png",
    "slug": "dexe"
  },
  "DF": {
    "name": "dForce",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4758.png",
    "slug": "dforce"
  },
  "DGB": {
    "name": "DigiByte",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/109.png",
    "slug": "digibyte"
  },
  "DGD": {
    "name": "DigixDAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1229.png",
    "slug": "digixdao"
  },
  "DIA": {
    "name": "DIA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6138.png",
    "slug": "dia"
  },
  "DLT": {
    "name": "Agrello",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1949.png",
    "slug": "agrello-delta"
  },
  "DNT": {
    "name": "district0x",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1856.png",
    "slug": "district0x"
  },
  "DOCK": {
    "name": "Dock",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2675.png",
    "slug": "dock"
  },
  "DODO": {
    "name": "DODO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7224.png",
    "slug": "dodo"
  },
  "DOGE": {
    "name": "Dogecoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    "slug": "dogecoin"
  },
  "DOT": {
    "name": "Polkadot",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
    "slug": "polkadot-new"
  },
  "DOTDOWN": {
    "name": "DOTDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7006.png",
    "slug": "dotdown"
  },
  "DOTUP": {
    "name": "DOTUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7003.png",
    "slug": "dotup"
  },
  "DREP": {
    "name": "Drep [new]",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9148.png",
    "slug": "drep-new"
  },
  "DUSK": {
    "name": "Dusk",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4092.png",
    "slug": "dusk"
  },
  "DYDX": {
    "name": "dYdX (Native)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28324.png",
    "slug": "dydx-chain"
  },
  "DYM": {
    "name": "Dymension",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28932.png",
    "slug": "dymension"
  },
  "EDO": {
    "name": "Eidoo {Old}",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2057.png",
    "slug": "eidoo-old"
  },
  "EDU": {
    "name": "Open Campus",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24613.png",
    "slug": "open-campus"
  },
  "EGLD": {
    "name": "MultiversX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6892.png",
    "slug": "multiversx-egld"
  },
  "ELF": {
    "name": "aelf",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2299.png",
    "slug": "aelf"
  },
  "ENG": {
    "name": "Enigma",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2044.png",
    "slug": "enigma"
  },
  "ENJ": {
    "name": "Enjin Coin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2130.png",
    "slug": "enjin-coin"
  },
  "ENS": {
    "name": "Ethereum Name Service",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13855.png",
    "slug": "ethereum-name-service"
  },
  "EOS": {
    "name": "EOS",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png",
    "slug": "eos"
  },
  "EOSDOWN": {
    "name": "EOSDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7000.png",
    "slug": "eosdown"
  },
  "EOSUP": {
    "name": "EOSUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6999.png",
    "slug": "eosup"
  },
  "EPS": {
    "name": "Ellipsis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8938.png",
    "slug": "ellipsis"
  },
  "EPX": {
    "name": "Ellipsis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/19924.png",
    "slug": "ellipsis-epx"
  },
  "ERD": {
    "name": "ELDORADO TOKEN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4961.png",
    "slug": "eldorado-token"
  },
  "ERN": {
    "name": "Ethernity",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8615.png",
    "slug": "ethernity-chain"
  },
  "ETC": {
    "name": "Ethereum Classic",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png",
    "slug": "ethereum-classic"
  },
  "ETH": {
    "name": "Ethereum",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "slug": "ethereum"
  },
  "ETHDOWN": {
    "name": "ETHDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7015.png",
    "slug": "ethdown"
  },
  "ETHFI": {
    "name": "ether.fi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29814.png",
    "slug": "ether-fi-ethfi"
  },
  "ETHUP": {
    "name": "ETHUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7016.png",
    "slug": "ethup"
  },
  "EVX": {
    "name": "Everex",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2034.png",
    "slug": "everex"
  },
  "EZ": {
    "name": "EasyFi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7332.png",
    "slug": "easyfi"
  },
  "FARM": {
    "name": "Harvest Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6859.png",
    "slug": "harvest-finance"
  },
  "FDUSD": {
    "name": "First Digital USD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/26081.png",
    "slug": "first-digital-usd"
  },
  "FET": {
    "name": "Fetch.ai",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png",
    "slug": "fetch"
  },
  "FIDA": {
    "name": "Bonfida",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7978.png",
    "slug": "bonfida"
  },
  "FIL": {
    "name": "Filecoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png",
    "slug": "filecoin"
  },
  "FILDOWN": {
    "name": "FILDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8051.png",
    "slug": "fildown"
  },
  "FILUP": {
    "name": "FILUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8050.png",
    "slug": "filup"
  },
  "FIO": {
    "name": "FIO Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5865.png",
    "slug": "fio-protocol"
  },
  "FIRO": {
    "name": "Firo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1414.png",
    "slug": "firo"
  },
  "FIS": {
    "name": "StaFi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5882.png",
    "slug": "stafi"
  },
  "FLM": {
    "name": "Flamingo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7150.png",
    "slug": "flamingo"
  },
  "FLOKI": {
    "name": "FLOKI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png",
    "slug": "floki-inu"
  },
  "FLOW": {
    "name": "Flow",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4558.png",
    "slug": "flow"
  },
  "FLUX": {
    "name": "Flux",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3029.png",
    "slug": "zel"
  },
  "FOR": {
    "name": "ForTube",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4118.png",
    "slug": "the-force-protocol"
  },
  "FORTH": {
    "name": "Ampleforth Governance Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9421.png",
    "slug": "ampleforth-governance-token"
  },
  "FRONT": {
    "name": "Frontier",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5893.png",
    "slug": "frontier"
  },
  "FTM": {
    "name": "Fantom",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png",
    "slug": "fantom"
  },
  "FTT": {
    "name": "FTX Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4195.png",
    "slug": "ftx-token"
  },
  "FUEL": {
    "name": "Etherparty",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2120.png",
    "slug": "etherparty"
  },
  "FUN": {
    "name": "FUNToken",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1757.png",
    "slug": "funtoken"
  },
  "FXS": {
    "name": "Frax Share",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6953.png",
    "slug": "frax-share"
  },
  "GAL": {
    "name": "Galxe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11877.png",
    "slug": "galxe"
  },
  "GALA": {
    "name": "Gala",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7080.png",
    "slug": "gala"
  },
  "GAS": {
    "name": "Gas",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1785.png",
    "slug": "gas"
  },
  "GBP": {
    "name": "Good Boy Points",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6897.png",
    "slug": "good-boy-points"
  },
  "GFT": {
    "name": "Gifto",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2289.png",
    "slug": "gifto"
  },
  "GHST": {
    "name": "Aavegotchi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7046.png",
    "slug": "aavegotchi"
  },
  "GLM": {
    "name": "Golem",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1455.png",
    "slug": "golem-network-tokens"
  },
  "GLMR": {
    "name": "Moonbeam",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png",
    "slug": "moonbeam"
  },
  "GMT": {
    "name": "GMT",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18069.png",
    "slug": "green-metaverse-token"
  },
  "GMX": {
    "name": "GMX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11857.png",
    "slug": "gmx"
  },
  "GNO": {
    "name": "Gnosis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1659.png",
    "slug": "gnosis-gno"
  },
  "GNS": {
    "name": "Gains Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13663.png",
    "slug": "gains-network"
  },
  "GNT": {
    "name": "GreenTrust",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9533.png",
    "slug": "greentrust"
  },
  "GO": {
    "name": "GoChain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2861.png",
    "slug": "gochain"
  },
  "GRS": {
    "name": "Groestlcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/258.png",
    "slug": "groestlcoin"
  },
  "GRT": {
    "name": "The Graph",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png",
    "slug": "the-graph"
  },
  "GTC": {
    "name": "Gitcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10052.png",
    "slug": "gitcoin"
  },
  "GVT": {
    "name": "Genesis Vision",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2181.png",
    "slug": "genesis-vision"
  },
  "HARD": {
    "name": "Kava Lend",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7576.png",
    "slug": "hard-protocol"
  },
  "HBAR": {
    "name": "Hedera",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png",
    "slug": "hedera"
  },
  "HC": {
    "name": "HyperCash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1903.png",
    "slug": "hypercash"
  },
  "HEGIC": {
    "name": "Hegic",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6929.png",
    "slug": "hegic"
  },
  "HFT": {
    "name": "Hashflow",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22461.png",
    "slug": "hashflow"
  },
  "HIFI": {
    "name": "Hifi Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23037.png",
    "slug": "hifi-finance-new"
  },
  "HIGH": {
    "name": "Highstreet",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11232.png",
    "slug": "highstreet"
  },
  "HIVE": {
    "name": "Hive",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5370.png",
    "slug": "hive-blockchain"
  },
  "HNT": {
    "name": "Helium",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5665.png",
    "slug": "helium"
  },
  "HOOK": {
    "name": "Hooked Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22764.png",
    "slug": "hooked-protocol"
  },
  "HOT": {
    "name": "Holo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2682.png",
    "slug": "holo"
  },
  "ICN": {
    "name": "iCoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/138.png",
    "slug": "icoin"
  },
  "ICP": {
    "name": "Internet Computer",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png",
    "slug": "internet-computer"
  },
  "ICX": {
    "name": "ICON",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2099.png",
    "slug": "icon"
  },
  "ID": {
    "name": "SPACE ID",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/21846.png",
    "slug": "space-id"
  },
  "IDEX": {
    "name": "IDEX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3928.png",
    "slug": "idex"
  },
  "IDRT": {
    "name": "Rupiah Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4702.png",
    "slug": "rupiah-token"
  },
  "ILV": {
    "name": "Illuvium",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8719.png",
    "slug": "illuvium"
  },
  "IMX": {
    "name": "Immutable",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10603.png",
    "slug": "immutable-x"
  },
  "INJ": {
    "name": "Injective",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png",
    "slug": "injective"
  },
  "INS": {
    "name": "Inscribe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29265.png",
    "slug": "inscribe"
  },
  "IOST": {
    "name": "IOST",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2405.png",
    "slug": "iostoken"
  },
  "IOTA": {
    "name": "IOTA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1720.png",
    "slug": "iota"
  },
  "IOTX": {
    "name": "IoTeX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2777.png",
    "slug": "iotex"
  },
  "IQ": {
    "name": "IQ",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2930.png",
    "slug": "iq"
  },
  "IRIS": {
    "name": "IRISnet",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3874.png",
    "slug": "irisnet"
  },
  "JASMY": {
    "name": "JasmyCoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8425.png",
    "slug": "jasmy"
  },
  "JOE": {
    "name": "JOE",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11396.png",
    "slug": "joe"
  },
  "JST": {
    "name": "JUST",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5488.png",
    "slug": "just"
  },
  "JTO": {
    "name": "Jito",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28541.png",
    "slug": "jito"
  },
  "JUP": {
    "name": "Jupiter",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29210.png",
    "slug": "jupiter-ag"
  },
  "JUV": {
    "name": "Juventus Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5224.png",
    "slug": "juventus-fan-token"
  },
  "KAVA": {
    "name": "Kava",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4846.png",
    "slug": "kava"
  },
  "KDA": {
    "name": "Kadena",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5647.png",
    "slug": "kadena"
  },
  "KEEP": {
    "name": "Keep Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5566.png",
    "slug": "keep-network"
  },
  "KEY": {
    "name": "SelfKey",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2398.png",
    "slug": "selfkey"
  },
  "KLAY": {
    "name": "Klaytn",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4256.png",
    "slug": "klaytn"
  },
  "KMD": {
    "name": "Komodo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png",
    "slug": "komodo"
  },
  "KNC": {
    "name": "Kyber Network Crystal v2",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9444.png",
    "slug": "kyber-network-crystal-v2"
  },
  "KP3R": {
    "name": "Keep3rV1",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7535.png",
    "slug": "keep3rv1"
  },
  "KSM": {
    "name": "Kusama",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5034.png",
    "slug": "kusama"
  },
  "LAZIO": {
    "name": "S.S. Lazio Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12687.png",
    "slug": "lazio-fan-token"
  },
  "LDO": {
    "name": "Lido DAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png",
    "slug": "lido-dao"
  },
  "LEND": {
    "name": "Lendle",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29006.png",
    "slug": "lendle"
  },
  "LEVER": {
    "name": "LeverFi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/20873.png",
    "slug": "lever"
  },
  "LINA": {
    "name": "Linear Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7102.png",
    "slug": "linear"
  },
  "LINK": {
    "name": "Chainlink",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    "slug": "chainlink"
  },
  "LINKDOWN": {
    "name": "LINKDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7012.png",
    "slug": "linkdown"
  },
  "LINKUP": {
    "name": "LINKUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7011.png",
    "slug": "linkup"
  },
  "LIT": {
    "name": "Litentry",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6833.png",
    "slug": "litentry"
  },
  "LOKA": {
    "name": "League of Kingdoms Arena",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/17145.png",
    "slug": "league-of-kingdoms"
  },
  "LOOM": {
    "name": "Loom Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2588.png",
    "slug": "loom-network"
  },
  "LPT": {
    "name": "Livepeer",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3640.png",
    "slug": "livepeer"
  },
  "LQTY": {
    "name": "Liquity",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7429.png",
    "slug": "liquity"
  },
  "LRC": {
    "name": "Loopring",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1934.png",
    "slug": "loopring"
  },
  "LSK": {
    "name": "Lisk",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1214.png",
    "slug": "lisk"
  },
  "LTC": {
    "name": "Litecoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    "slug": "litecoin"
  },
  "LTCDOWN": {
    "name": "LTCDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7527.png",
    "slug": "ltcdown"
  },
  "LTCUP": {
    "name": "LTCUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7526.png",
    "slug": "ltcup"
  },
  "LTO": {
    "name": "LTO Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3714.png",
    "slug": "lto-network"
  },
  "LUN": {
    "name": "Lunyr",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1658.png",
    "slug": "lunyr"
  },
  "LUNA": {
    "name": "Terra",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/20314.png",
    "slug": "terra-luna-v2"
  },
  "LUNC": {
    "name": "Terra Classic",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png",
    "slug": "terra-luna"
  },
  "MAGIC": {
    "name": "Treasure",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/14783.png",
    "slug": "magic-token"
  },
  "MANA": {
    "name": "Decentraland",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png",
    "slug": "decentraland"
  },
  "MANTA": {
    "name": "Manta Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13631.png",
    "slug": "manta-network"
  },
  "MASK": {
    "name": "Mask Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8536.png",
    "slug": "mask-network"
  },
  "MATIC": {
    "name": "Polygon",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    "slug": "polygon"
  },
  "MAV": {
    "name": "Maverick Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18037.png",
    "slug": "maverick-protocol"
  },
  "MBL": {
    "name": "MovieBloc",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4038.png",
    "slug": "moviebloc"
  },
  "MBOX": {
    "name": "MOBOX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9175.png",
    "slug": "mobox"
  },
  "MC": {
    "name": "Merit Circle",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13523.png",
    "slug": "merit-circle"
  },
  "MCO": {
    "name": "MCO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1776.png",
    "slug": "crypto-com"
  },
  "MDA": {
    "name": "Moeda Loyalty Points",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1954.png",
    "slug": "moeda-loyalty-points"
  },
  "MDT": {
    "name": "Measurable Data Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2348.png",
    "slug": "measurable-data-token"
  },
  "MDX": {
    "name": "Mdex",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8335.png",
    "slug": "mdex"
  },
  "MEME": {
    "name": "Memecoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28301.png",
    "slug": "meme"
  },
  "METIS": {
    "name": "Metis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9640.png",
    "slug": "metisdao"
  },
  "MFT": {
    "name": "Mainframe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2896.png",
    "slug": "mainframe"
  },
  "MINA": {
    "name": "Mina",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8646.png",
    "slug": "mina"
  },
  "MIR": {
    "name": "Mirror Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7857.png",
    "slug": "mirror-protocol"
  },
  "MITH": {
    "name": "Mithril",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2608.png",
    "slug": "mithril"
  },
  "MKR": {
    "name": "Maker",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png",
    "slug": "maker"
  },
  "MLN": {
    "name": "Enzyme",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1552.png",
    "slug": "enzyme"
  },
  "MOB": {
    "name": "MobileCoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7878.png",
    "slug": "mobilecoin"
  },
  "MOD": {
    "name": "Modefi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8494.png",
    "slug": "modefi"
  },
  "MOVR": {
    "name": "Moonriver",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9285.png",
    "slug": "moonriver"
  },
  "MTH": {
    "name": "Monetha",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1947.png",
    "slug": "monetha"
  },
  "MTL": {
    "name": "Metal DAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1788.png",
    "slug": "metal"
  },
  "MULTI": {
    "name": "Multichain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/17050.png",
    "slug": "multichain"
  },
  "NANO": {
    "name": "Nanomatic",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24211.png",
    "slug": "nanomatic"
  },
  "NAS": {
    "name": "Nebulas",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1908.png",
    "slug": "nebulas-token"
  },
  "NAV": {
    "name": "Navcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/377.png",
    "slug": "nav-coin"
  },
  "NBS": {
    "name": "New BitShares",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7110.png",
    "slug": "new-bitshares"
  },
  "NBT": {
    "name": "NanoByte Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18101.png",
    "slug": "nanobyte-token"
  },
  "NCASH": {
    "name": "Nitro Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2544.png",
    "slug": "nucleus-vision"
  },
  "NEAR": {
    "name": "NEAR Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png",
    "slug": "near-protocol"
  },
  "NEBL": {
    "name": "Neblio",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1955.png",
    "slug": "neblio"
  },
  "NEO": {
    "name": "Neo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png",
    "slug": "neo"
  },
  "NEXO": {
    "name": "Nexo",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2694.png",
    "slug": "nexo"
  },
  "NFP": {
    "name": "NFPrompt",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28778.png",
    "slug": "nfprompt"
  },
  "NGN": {
    "name": "CryptoNijigen",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13941.png",
    "slug": "cryptonijigen"
  },
  "NKN": {
    "name": "NKN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2780.png",
    "slug": "nkn"
  },
  "NMR": {
    "name": "Numeraire",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1732.png",
    "slug": "numeraire"
  },
  "NPXS": {
    "name": "Pundi X (Old)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2603.png",
    "slug": "pundi-x"
  },
  "NTRN": {
    "name": "Neutron",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/26680.png",
    "slug": "neutron-ntrn"
  },
  "NU": {
    "name": "NuCypher",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4761.png",
    "slug": "nucypher"
  },
  "NULS": {
    "name": "NULS",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2092.png",
    "slug": "nuls"
  },
  "NXS": {
    "name": "Nexus",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/789.png",
    "slug": "nexus"
  },
  "OAX": {
    "name": "OAX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1853.png",
    "slug": "oax"
  },
  "OCEAN": {
    "name": "Ocean Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3911.png",
    "slug": "ocean-protocol"
  },
  "OG": {
    "name": "OG Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5309.png",
    "slug": "og-fan-token"
  },
  "OGN": {
    "name": "Origin Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5117.png",
    "slug": "origin-protocol"
  },
  "OM": {
    "name": "MANTRA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png",
    "slug": "mantra"
  },
  "OMG": {
    "name": "OMG Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1808.png",
    "slug": "omg"
  },
  "ONE": {
    "name": "Harmony",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3945.png",
    "slug": "harmony"
  },
  "ONG": {
    "name": "Ontology Gas",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3217.png",
    "slug": "ontology-gas"
  },
  "ONT": {
    "name": "Ontology",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2566.png",
    "slug": "ontology"
  },
  "OOKI": {
    "name": "Ooki Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/16434.png",
    "slug": "ooki-protocol"
  },
  "OP": {
    "name": "Optimism",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
    "slug": "optimism-ethereum"
  },
  "ORDI": {
    "name": "ORDI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/25028.png",
    "slug": "ordi"
  },
  "ORN": {
    "name": "Orion",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5631.png",
    "slug": "orion-xyz"
  },
  "OSMO": {
    "name": "Osmosis",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12220.png",
    "slug": "osmosis"
  },
  "OST": {
    "name": "OST",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2296.png",
    "slug": "ost"
  },
  "OXT": {
    "name": "Orchid",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5026.png",
    "slug": "orchid"
  },
  "PAXG": {
    "name": "PAX Gold",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png",
    "slug": "pax-gold"
  },
  "PDA": {
    "name": "PlayDapp",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7461.png",
    "slug": "playdapp"
  },
  "PENDLE": {
    "name": "Pendle",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9481.png",
    "slug": "pendle"
  },
  "PEOPLE": {
    "name": "ConstitutionDAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/14806.png",
    "slug": "constitutiondao"
  },
  "PEPE": {
    "name": "Pepe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png",
    "slug": "pepe"
  },
  "PERL": {
    "name": "PERL.eco",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4293.png",
    "slug": "perlin"
  },
  "PERP": {
    "name": "Perpetual Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6950.png",
    "slug": "perpetual-protocol"
  },
  "PHA": {
    "name": "Phala Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6841.png",
    "slug": "phala-network"
  },
  "PHB": {
    "name": "Phoenix",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13969.png",
    "slug": "phoenix-global-new"
  },
  "PHX": {
    "name": "Phoenix Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11727.png",
    "slug": "phoenix-token"
  },
  "PIVX": {
    "name": "PIVX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1169.png",
    "slug": "pivx"
  },
  "PIXEL": {
    "name": "Pixels",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29335.png",
    "slug": "pixels"
  },
  "PLA": {
    "name": "PlayChip",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3731.png",
    "slug": "playchip"
  },
  "PLN": {
    "name": "Pollen",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10677.png",
    "slug": "pollen"
  },
  "PNT": {
    "name": "pNetwork",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5794.png",
    "slug": "pnetwork"
  },
  "POA": {
    "name": "POA Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2548.png",
    "slug": "poa"
  },
  "POE": {
    "name": "Po.et",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1937.png",
    "slug": "poet"
  },
  "POLS": {
    "name": "Polkastarter",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7208.png",
    "slug": "polkastarter"
  },
  "POLY": {
    "name": "Polymath",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2496.png",
    "slug": "polymath-network"
  },
  "POLYX": {
    "name": "Polymesh",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/20362.png",
    "slug": "polymesh"
  },
  "POND": {
    "name": "Marlin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7497.png",
    "slug": "marlin"
  },
  "PORTAL": {
    "name": "Portal",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29555.png",
    "slug": "portal-gaming"
  },
  "PORTO": {
    "name": "FC Porto Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/14052.png",
    "slug": "fc-porto"
  },
  "POWR": {
    "name": "Powerledger",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2132.png",
    "slug": "power-ledger"
  },
  "PPT": {
    "name": "Populous",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1789.png",
    "slug": "populous"
  },
  "PROM": {
    "name": "Prom",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4120.png",
    "slug": "prom"
  },
  "PROS": {
    "name": "Prosper",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8255.png",
    "slug": "prosper"
  },
  "PSG": {
    "name": "Paris Saint-Germain Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5226.png",
    "slug": "paris-saint-germain-fan-token"
  },
  "PUNDIX": {
    "name": "Pundi X (New)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9040.png",
    "slug": "pundix-new"
  },
  "PYR": {
    "name": "Vulcan Forged (PYR)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9308.png",
    "slug": "vulcan-forged-pyr"
  },
  "PYTH": {
    "name": "Pyth Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28177.png",
    "slug": "pyth-network"
  },
  "QI": {
    "name": "BENQI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9288.png",
    "slug": "benqi"
  },
  "QKC": {
    "name": "QuarkChain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2840.png",
    "slug": "quarkchain"
  },
  "QLC": {
    "name": "QLC Chain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2321.png",
    "slug": "qlink"
  },
  "QNT": {
    "name": "Quant",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png",
    "slug": "quant"
  },
  "QTUM": {
    "name": "Qtum",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1684.png",
    "slug": "qtum"
  },
  "QUICK": {
    "name": "Quickswap [New]",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/19966.png",
    "slug": "quickswap-new"
  },
  "RAD": {
    "name": "Radworks",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6843.png",
    "slug": "radworks"
  },
  "RAMP": {
    "name": "RAMP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7463.png",
    "slug": "ramp"
  },
  "RARE": {
    "name": "SuperRare",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11294.png",
    "slug": "superrare"
  },
  "RAY": {
    "name": "Raydium",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png",
    "slug": "raydium"
  },
  "RCN": {
    "name": "Ripio Credit Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2096.png",
    "slug": "ripio-credit-network"
  },
  "RDN": {
    "name": "Raiden Network Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2161.png",
    "slug": "raiden-network-token"
  },
  "RDNT": {
    "name": "Radiant Capital",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/21106.png",
    "slug": "radiant-capital"
  },
  "REEF": {
    "name": "Reef",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png",
    "slug": "reef"
  },
  "REI": {
    "name": "REI Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/19819.png",
    "slug": "rei-network"
  },
  "REN": {
    "name": "Ren",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2539.png",
    "slug": "ren"
  },
  "RENBTC": {
    "name": "renBTC",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5777.png",
    "slug": "renbtc"
  },
  "REP": {
    "name": "Augur",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1104.png",
    "slug": "augur"
  },
  "REQ": {
    "name": "Request",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2071.png",
    "slug": "request"
  },
  "RGT": {
    "name": "Rari Governance Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7486.png",
    "slug": "rari-governance-token"
  },
  "RIF": {
    "name": "Rootstock Infrastructure Framework",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png",
    "slug": "rsk-infrastructure-framework"
  },
  "RLC": {
    "name": "iExec RLC",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1637.png",
    "slug": "rlc"
  },
  "RNDR": {
    "name": "Render",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png",
    "slug": "render"
  },
  "RON": {
    "name": "Ronin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/14101.png",
    "slug": "ronin"
  },
  "ROSE": {
    "name": "Oasis Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7653.png",
    "slug": "oasis-network"
  },
  "RPL": {
    "name": "Rocket Pool",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2943.png",
    "slug": "rocket-pool"
  },
  "RSR": {
    "name": "Reserve Rights",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3964.png",
    "slug": "reserve-rights"
  },
  "RUNE": {
    "name": "THORChain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png",
    "slug": "thorchain"
  },
  "RVN": {
    "name": "Ravencoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2577.png",
    "slug": "ravencoin"
  },
  "SALT": {
    "name": "SALT",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1996.png",
    "slug": "salt"
  },
  "SAND": {
    "name": "The Sandbox",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png",
    "slug": "the-sandbox"
  },
  "SANTOS": {
    "name": "Santos FC Fan Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/15248.png",
    "slug": "santos-fc-fan-token"
  },
  "SC": {
    "name": "Siacoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1042.png",
    "slug": "siacoin"
  },
  "SCRT": {
    "name": "Secret",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5604.png",
    "slug": "secret"
  },
  "SEI": {
    "name": "Sei",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/23149.png",
    "slug": "sei"
  },
  "SFP": {
    "name": "SafePal",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8119.png",
    "slug": "safepal"
  },
  "SHIB": {
    "name": "Shiba Inu",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    "slug": "shiba-inu"
  },
  "SKL": {
    "name": "SKALE",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png",
    "slug": "skale-network"
  },
  "SKY": {
    "name": "Skycoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1619.png",
    "slug": "skycoin"
  },
  "SLP": {
    "name": "Smooth Love Potion",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5824.png",
    "slug": "smooth-love-potion"
  },
  "SNGLS": {
    "name": "SingularDTV",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1409.png",
    "slug": "singulardtv"
  },
  "SNM": {
    "name": "SONM (BEP-20)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9931.png",
    "slug": "sonm-bep20"
  },
  "SNT": {
    "name": "Status",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1759.png",
    "slug": "status"
  },
  "SNX": {
    "name": "Synthetix",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png",
    "slug": "synthetix"
  },
  "SOL": {
    "name": "Solana",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    "slug": "solana"
  },
  "SPARTA": {
    "name": "Spartan Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6992.png",
    "slug": "spartan-protocol"
  },
  "SPELL": {
    "name": "Spell Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11289.png",
    "slug": "spell-token"
  },
  "SRM": {
    "name": "Serum",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6187.png",
    "slug": "serum"
  },
  "SSV": {
    "name": "ssv.network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12999.png",
    "slug": "ssv-network"
  },
  "STEEM": {
    "name": "Steem",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1230.png",
    "slug": "steem"
  },
  "STG": {
    "name": "Stargate Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/18934.png",
    "slug": "stargate-finance"
  },
  "STMX": {
    "name": "StormX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2297.png",
    "slug": "stormx"
  },
  "STORJ": {
    "name": "Storj",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1772.png",
    "slug": "storj"
  },
  "STORM": {
    "name": "Storm Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/11655.png",
    "slug": "storm-token"
  },
  "STPT": {
    "name": "STP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4006.png",
    "slug": "standard-tokenization-protocol"
  },
  "STRAX": {
    "name": "Stratis [New]",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/30168.png",
    "slug": "stratis-new"
  },
  "STRK": {
    "name": "Starknet",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22691.png",
    "slug": "starknet-token"
  },
  "STX": {
    "name": "Stacks",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png",
    "slug": "stacks"
  },
  "SUB": {
    "name": "Subsocial",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6845.png",
    "slug": "subsocial"
  },
  "SUI": {
    "name": "Sui",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
    "slug": "sui"
  },
  "SUN": {
    "name": "Sun (New)",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10529.png",
    "slug": "sun-token"
  },
  "SUPER": {
    "name": "SuperVerse",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8290.png",
    "slug": "superfarm"
  },
  "SUSD": {
    "name": "sUSD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2927.png",
    "slug": "susd"
  },
  "SUSHI": {
    "name": "SushiSwap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png",
    "slug": "sushiswap"
  },
  "SUSHIDOWN": {
    "name": "SUSHIDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8052.png",
    "slug": "sushidown"
  },
  "SUSHIUP": {
    "name": "SUSHIUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8053.png",
    "slug": "sushiup"
  },
  "SWRV": {
    "name": "Swerve",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/6901.png",
    "slug": "swerve"
  },
  "SXP": {
    "name": "Solar",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4279.png",
    "slug": "sxp"
  },
  "SXPDOWN": {
    "name": "SXPDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7529.png",
    "slug": "sxpdown"
  },
  "SXPUP": {
    "name": "SXPUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7528.png",
    "slug": "sxpup"
  },
  "SYN": {
    "name": "Synapse",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12147.png",
    "slug": "synapse-2"
  },
  "SYS": {
    "name": "Syscoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/541.png",
    "slug": "syscoin"
  },
  "T": {
    "name": "Threshold",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/17751.png",
    "slug": "threshold"
  },
  "TCT": {
    "name": "TokenClub",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2364.png",
    "slug": "tokenclub"
  },
  "TFUEL": {
    "name": "Theta Fuel",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3822.png",
    "slug": "theta-fuel"
  },
  "THETA": {
    "name": "Theta Network",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png",
    "slug": "theta-network"
  },
  "TIA": {
    "name": "Celestia",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22861.png",
    "slug": "celestia"
  },
  "TKO": {
    "name": "Toko Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9020.png",
    "slug": "tokocrypto"
  },
  "TLM": {
    "name": "Alien Worlds",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9119.png",
    "slug": "alien-worlds"
  },
  "TNB": {
    "name": "Time New Bank",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2235.png",
    "slug": "time-new-bank"
  },
  "TNT": {
    "name": "Tenti",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22863.png",
    "slug": "airtnt"
  },
  "TORN": {
    "name": "Tornado Cash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8049.png",
    "slug": "torn"
  },
  "TRB": {
    "name": "Tellor",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4944.png",
    "slug": "tellor"
  },
  "TRIBE": {
    "name": "Tribe",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/9025.png",
    "slug": "tribe"
  },
  "TRIG": {
    "name": "Triggers",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1423.png",
    "slug": "triggers"
  },
  "TROY": {
    "name": "TROY",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5007.png",
    "slug": "troy"
  },
  "TRU": {
    "name": "TrueFi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7725.png",
    "slug": "truefi-token"
  },
  "TRX": {
    "name": "TRON",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
    "slug": "tron"
  },
  "TRXDOWN": {
    "name": "TRXDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7004.png",
    "slug": "trxdown"
  },
  "TRXUP": {
    "name": "TRXUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7005.png",
    "slug": "trxup"
  },
  "TRY": {
    "name": "TryHards",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/12225.png",
    "slug": "tryhards"
  },
  "TUSD": {
    "name": "TrueUSD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png",
    "slug": "trueusd"
  },
  "TWT": {
    "name": "Trust Wallet Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5964.png",
    "slug": "trust-wallet-token"
  },
  "UFT": {
    "name": "UniLend",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7412.png",
    "slug": "unilend"
  },
  "UMA": {
    "name": "UMA",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5617.png",
    "slug": "uma"
  },
  "UNFI": {
    "name": "Unifi Protocol DAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7672.png",
    "slug": "unifi-protocol-dao"
  },
  "UNI": {
    "name": "Uniswap",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    "slug": "uniswap"
  },
  "UNIDOWN": {
    "name": "UNIDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7525.png",
    "slug": "unidown"
  },
  "UNIUP": {
    "name": "UNIUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7524.png",
    "slug": "uniup"
  },
  "USDC": {
    "name": "USDC",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    "slug": "usd-coin"
  },
  "USDP": {
    "name": "Pax Dollar",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3330.png",
    "slug": "paxos-standard"
  },
  "USDS": {
    "name": "Sperax USD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/17285.png",
    "slug": "sperax-usd"
  },
  "USDT": {
    "name": "Tether USDt",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    "slug": "tether"
  },
  "UST": {
    "name": "Ultra Salescloud",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3100.png",
    "slug": "ultra-salescoud"
  },
  "USTC": {
    "name": "TerraClassicUSD",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7129.png",
    "slug": "terrausd"
  },
  "UTK": {
    "name": "xMoney",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2320.png",
    "slug": "utrust"
  },
  "VAI": {
    "name": "VAIOT",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8479.png",
    "slug": "vaiot"
  },
  "VANRY": {
    "name": "Vanar Chain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8037.png",
    "slug": "vanar"
  },
  "VEN": {
    "name": "ImpulseVen",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8908.png",
    "slug": "impulseven"
  },
  "VET": {
    "name": "VeChain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png",
    "slug": "vechain"
  },
  "VGX": {
    "name": "Voyager Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1817.png",
    "slug": "voyager-token"
  },
  "VIA": {
    "name": "Octavia AI",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/29488.png",
    "slug": "octavia"
  },
  "VIB": {
    "name": "Viberate",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2019.png",
    "slug": "viberate"
  },
  "VIBE": {
    "name": "VIBE",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1983.png",
    "slug": "vibe"
  },
  "VIC": {
    "name": "Viction",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2570.png",
    "slug": "viction"
  },
  "VIDT": {
    "name": "VIDT DAO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/22710.png",
    "slug": "vidt-dao"
  },
  "VITE": {
    "name": "VITE",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2937.png",
    "slug": "vite"
  },
  "VOXEL": {
    "name": "Voxies",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/15678.png",
    "slug": "voxies"
  },
  "VTHO": {
    "name": "VeThor Token",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3012.png",
    "slug": "vethor-token"
  },
  "WABI": {
    "name": "Wabi",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2267.png",
    "slug": "wabi"
  },
  "WAN": {
    "name": "Wanchain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2606.png",
    "slug": "wanchain"
  },
  "WAVES": {
    "name": "Waves",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1274.png",
    "slug": "waves"
  },
  "WAXP": {
    "name": "WAX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2300.png",
    "slug": "wax"
  },
  "WBETH": {
    "name": "Wrapped Beacon ETH",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/24760.png",
    "slug": "wrapped-beacon-eth"
  },
  "WBTC": {
    "name": "Wrapped Bitcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    "slug": "wrapped-bitcoin"
  },
  "WIF": {
    "name": "dogwifhat",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png",
    "slug": "dogwifhat"
  },
  "WIN": {
    "name": "WINkLink",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/4206.png",
    "slug": "wink"
  },
  "WING": {
    "name": "Wing Finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7048.png",
    "slug": "wing"
  },
  "WINGS": {
    "name": "Wings",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1500.png",
    "slug": "wings"
  },
  "WLD": {
    "name": "Worldcoin",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/13502.png",
    "slug": "worldcoin-org"
  },
  "WNXM": {
    "name": "Wrapped NXM",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5939.png",
    "slug": "wrapped-nxm"
  },
  "WOO": {
    "name": "WOO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7501.png",
    "slug": "wootrade"
  },
  "WPR": {
    "name": "WePower",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2511.png",
    "slug": "wepower"
  },
  "WRX": {
    "name": "WazirX",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5161.png",
    "slug": "wazirx"
  },
  "WTC": {
    "name": "Waltonchain",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1925.png",
    "slug": "waltonchain"
  },
  "XAI": {
    "name": "Xai",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/28933.png",
    "slug": "xai-games"
  },
  "XEC": {
    "name": "eCash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10791.png",
    "slug": "ecash"
  },
  "XEM": {
    "name": "NEM",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/873.png",
    "slug": "nem"
  },
  "XLM": {
    "name": "Stellar",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png",
    "slug": "stellar"
  },
  "XLMDOWN": {
    "name": "XLMDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8054.png",
    "slug": "xlmdown"
  },
  "XLMUP": {
    "name": "XLMUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/8055.png",
    "slug": "xlmup"
  },
  "XMR": {
    "name": "Monero",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/328.png",
    "slug": "monero"
  },
  "XNO": {
    "name": "Nano",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1567.png",
    "slug": "nano"
  },
  "XRP": {
    "name": "XRP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
    "slug": "xrp"
  },
  "XRPDOWN": {
    "name": "XRPDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7002.png",
    "slug": "xrpdown"
  },
  "XRPUP": {
    "name": "XRPUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7001.png",
    "slug": "xrpup"
  },
  "XTZ": {
    "name": "Tezos",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png",
    "slug": "tezos"
  },
  "XTZDOWN": {
    "name": "XTZDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7008.png",
    "slug": "xtzdown"
  },
  "XTZUP": {
    "name": "XTZUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7007.png",
    "slug": "xtzup"
  },
  "XVG": {
    "name": "Verge",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/693.png",
    "slug": "verge"
  },
  "XVS": {
    "name": "Venus",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7288.png",
    "slug": "venus"
  },
  "YFI": {
    "name": "yearn.finance",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png",
    "slug": "yearn-finance"
  },
  "YFIDOWN": {
    "name": "YFIDOWN",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7453.png",
    "slug": "yfidown"
  },
  "YFII": {
    "name": "DFI.Money",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/5957.png",
    "slug": "yearn-finance-ii"
  },
  "YFIUP": {
    "name": "YFIUP",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/7452.png",
    "slug": "yfiup"
  },
  "YGG": {
    "name": "Yield Guild Games",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/10688.png",
    "slug": "yield-guild-games"
  },
  "YOYO": {
    "name": "YOYO",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/26442.png",
    "slug": "yoyo"
  },
  "ZEC": {
    "name": "Zcash",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1437.png",
    "slug": "zcash"
  },
  "ZEN": {
    "name": "Horizen",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1698.png",
    "slug": "horizen"
  },
  "ZIL": {
    "name": "Zilliqa",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/2469.png",
    "slug": "zilliqa"
  },
  "ZRX": {
    "name": "0x Protocol",
    "logo": "https://s2.coinmarketcap.com/static/img/coins/64x64/1896.png",
    "slug": "0x"
  }
};
