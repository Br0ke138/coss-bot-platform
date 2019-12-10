
// exchange-info
export interface ExchangeInfo {
    timezone: string;
    server_time: number;
    rate_limits: Array<RateLimit>;
    base_currencies: Array<BaseCurrency>;
    coins: Array<Coin>;
    symbols: Array<Symbol>;
}

export interface RateLimit {
    type: string;
    interval: string;
    limit: number;
}

export interface BaseCurrency {
    currency_code: string;
    minimum_total_order: number;
}

export interface Coin {
    currency_code: string;
    name: string;
    minimum_order_amount: number;
}

export interface Symbol {
    symbol: string;
    amount_limit_decimal: number;
    price_limit_decimal: number;
    allow_trading: boolean;
}

// getmarketsummaries
export interface MarketSummaries {
    success: boolean;
    message: string;
    result: Array<MarketSummary>;
    volumes: Array<CoinVolume>;
    t: number;
}

export interface MarketSummary {
    MarketName: string;
    High: number;
    Low: number;
    BaseVolume: number;
    Last: number;
    TimeStamp: string;
    Volume: number;
    Bid: number | string;
    Ask: number | string;
    PrevDay: number;
}

export interface CoinVolume {
    CoinName: string;
    Volume: number;
}

// market-price
export interface MarketPrices extends Array<MarketPrice> {}

export interface MarketPrice {
    symbol: string;
    price: string;
    updated_time: number;
}

// dp Depth
export interface Depth {
    symbol: string;
    limit: number;
    asks: Array<DepthEntry>;
    bids: Array<DepthEntry>;
    time: number;
}

export interface DepthEntry extends Array<string> {
    0: string;
    1: string;
}

// ht History
export interface TradeHistory {
    symbol: string;
    limit: number;
    history: Array<TradeHistoryEntry>;
    time: number;
}

export interface TradeHistoryEntry {
    id: number;
    price: string;
    qty: string;
    isBuyerMaker: boolean;
    time: number;
}

// cs CandleStick
export interface CandleStick {
    "tt": string;
    "symbol": string;
    "nextTime": number;
    "series": Array<CandleStickEntry>;
    "limit": number;
}

export interface CandleStickEntry extends Array<any> {}

export interface TKWS {
    d: Array<TKEntry>;
    e: string;
    t: number;
}

export interface TKEntry {
    c: string;
    ch: string;
    h: string;
    l: string;
    n: string;
    o: string;
    pc: string;
    q: string;
    s: string;
    t: number;
}
