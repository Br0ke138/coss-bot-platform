import {CandleStick, Depth, ExchangeInfo, MarketPrices, MarketSummaries, TradeHistory} from "./coss-api.model";
import * as request from "request-promise-native";
import {RequestPromise} from "request-promise-native";
import {
    AccountBalanceArray,
    AccountDetails,
    CancelOrder,
    CancelOrderResponse,
    Order,
    OrderDetail,
    OrderListRequest,
    OrderListResponse,
    OrderResponse,
    TradeDetailRequest,
    TradeDetailsArray
} from "../swaggerSchema";

import CryptoJS from "crypto-js";
import querystring from "querystring";

export class CossApiService {

    private TRADE = "https://trade.coss.io/c/api/v1/";
    private ENGINE = "https://engine.coss.io/api/v1/";
    private EXCHANGE = "https://exchange.coss.io/api/";
    private WEB = "https://trade.coss.io/c/";

    private publicKey: string;
    private privateKey: string;

    private publicConfig = {
        json: true
    };

    private privateConfig = {
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '',
            'Signature': '',
            'X-Requested-With' : 'XMLHttpRequest',
            'x-coss-bot': 'CBS2312192',
        },
        body: {}
    };

    constructor(publicKey: string, privateKey: string) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.privateConfig.headers.Authorization = this.publicKey;
    }

    // Public

    publicRequest(url: string, payload: any): RequestPromise<any> {
        const query = payload ? '?' + querystring.stringify(payload) : '';
        return request.get(url + query, this.publicConfig);
    }

    // Exchange
    getMarketSummaries(): RequestPromise<MarketSummaries> {
        return this.publicRequest(this.EXCHANGE + "getmarketsummaries", null);
    }

    // Trade
    getExchangeInfo(): RequestPromise<ExchangeInfo> {
        return this.publicRequest(this.TRADE + "exchange-info", null);
    }

    getMarketPrice(pair = ""): RequestPromise<MarketPrices> {
        return this.publicRequest(this.TRADE + "market-price", {symbol: pair});
    }

    testConnection(): RequestPromise<any> {
        return this.publicRequest(this.TRADE + "ping", null);
    }

    getServerTime(): RequestPromise<any> {
        return request.get(this.TRADE + "time", {json: true});
    }

    // Engine
    getDepth(pair: string): RequestPromise<Depth> {
        return request.get(this.ENGINE + "dp?symbol=" + pair, {json: true});
    }

    getHistory(pair: string): RequestPromise<TradeHistory> {
        return this.publicRequest(this.ENGINE + "ht", {symbol: pair});
    }

    getCandlestick(pair: string): RequestPromise<CandleStick> {
        return request.get(this.ENGINE + "cs?symbol=" + pair + "&tt=15m", {json: true});
    }

    // Web
    getCoinsInfo(): RequestPromise<any> {
        return request.get(this.WEB + "coins/getinfo/all", {json: true});
    }

    getCoinsBaseList(): RequestPromise<any> {
        return request.get(this.WEB + "coins/get_base_list", {json: true});
    }

    getOrderSymbols(): RequestPromise<Array<{allow_trading: boolean, amount_limit_decimal: number, price_limit_decimal: number, symbol: string}>> {
        return this.publicRequest(this.WEB + "order/symbols", null);
    }

    // PRIVATE

    privateGet(url: string, payload: any): RequestPromise<any> {
        const config = this.privateConfig;
        config.headers.Signature = CryptoJS.HmacSHA256(querystring.stringify(payload), this.privateKey).toString(CryptoJS.enc.Hex);
        delete config.body;
        return request.get(url + '?' + querystring.stringify(payload), config);
    }

    privatePost(url: string, payload: any): RequestPromise<any> {
        const config = this.privateConfig;
        config.headers.Signature = CryptoJS.HmacSHA256(JSON.stringify(payload), this.privateKey).toString(CryptoJS.enc.Hex);
        config.body = payload;
        return request.post(url, config);
    }

    privateDelete(url: string, payload: any): RequestPromise<any> {
        const config = this.privateConfig;
        config.headers.Signature = CryptoJS.HmacSHA256(JSON.stringify(payload), this.privateKey).toString(CryptoJS.enc.Hex);
        config.body = payload;
        return request.delete(url, config);
    }


    // Balance
    getBalance(timestamp: number): RequestPromise<AccountBalanceArray> {
        return this.privateGet(this.TRADE + "account/balances", {timestamp: timestamp, recvWindow: 9999999999});
    }

    // Account details
    getAccountDetails(timestamp: number): RequestPromise<AccountDetails> {
        return this.privateGet(this.TRADE + "account/details", {timestamp: timestamp, recvWindow: 9999999999});
    }

    // Place Order
    placeOrder(order: Order): RequestPromise<OrderResponse> {
        return this.privatePost(this.TRADE + "order/add", order);
    }

    // Cancel Order
    cancelOrder(order: CancelOrder): RequestPromise<CancelOrderResponse> {
        return this.privateDelete(this.TRADE + "order/cancel", order);
    }

    // Order Detail
    getOrderDetails(order: OrderDetail): RequestPromise<OrderResponse> {
        return this.privatePost(this.TRADE + "order/details", order);
    }

    // Trade Details
    getTradeDetails(trade: TradeDetailRequest): RequestPromise<TradeDetailsArray> {
        return this.privatePost(this.TRADE + "order/trade-detail", trade);
    }

    // Open Orders
    getOpenOrders(orders: OrderListRequest): RequestPromise<OrderListResponse> {
        return request.post(this.TRADE + "order/list/open", {json: true});
    }

    // Completed Orders
    getCompletedOrders(orders: OrderListRequest): RequestPromise<OrderListResponse> {
        return this.privatePost(this.TRADE + "order/list/completed", orders);
    }

    // All Orders
    getAllOrders(orders: OrderListRequest): RequestPromise<OrderListResponse> {
        return request.post(this.TRADE + "order/list/all", {json: true});
    }
}

