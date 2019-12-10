export interface AccountBalance {
    /**
     * example:
     * ETH_BTC
     */
    currency_code?: string; // string
    /**
     * example:
     * 2MxctvXExQofAVqakPfBjKqVipfwTqwyQyF
     */
    address?: string; // string
    /**
     * example:
     * 1000.00275
     */
    total?: string; // string
    /**
     * example:
     * 994.5022
     */
    available?: string; // string
    /**
     * example:
     * 5.50055
     */
    in_order?: string; // string
}

export type AccountBalanceArray = AccountBalance[];

export interface AccountDetails {
    /**
     * example:
     * 3c05d5f4-41da-4c84-a167-XXXXXXXXX
     */
    account_id?: string; // string
    /**
     * example:
     * xyz@email.com
     */
    email?: string; // string
    /**
     * example:
     * 12345678
     */
    phone?: string; // string
    /**
     * example:
     * true
     */
    enable_google_2fa?: boolean; // boolean
    /**
     * example:
     * offline
     */
    status?: string; // string
    /**
     * example:
     * 1533546246091
     */
    create_at?: number; // int64
    /**
     * example:
     * Nick name
     */
    nick_name?: string; // string
    /**
     * example:
     * XXX@coss.io
     */
    chat_id?: string; // string
    /**
     * example:
     * XXXXXx
     */
    chat_password?: string; // string
    /**
     * example:
     * US
     */
    country?: string; // string
    /**
     * example:
     * EN
     */
    language?: string; // string
    kyc_status?: string; // string
    /**
     * example:
     * level1
     */
    kyc_level?: string; // string
    last_login_history?: {
        id?: {
            /**
             * example:
             * 1528199468
             */
            timestamp?: number; // int64
            /**
             * example:
             * 819034
             */
            machineIdentifier?: number; // int
            /**
             * example:
             * 10145
             */
            processIdentifier?: number; // int
            /**
             * example:
             * 6683435
             */
            counter?: number; // int
            /**
             * example:
             * 1528199468000
             */
            time?: number; // int64
            /**
             * example:
             * 1528199468000
             */
            date?: number; // int64
            /**
             * example:
             * 1528199468
             */
            timeSecond?: number; // int64
        };
        /**
         * example:
         * 3c05d5f4-41da-4c84-a167-XXXXXXXXX
         */
        account_id?: string; // string
        /**
         * example:
         * Nickname
         */
        nick_name?: string; // string
        /**
         * example:
         * abc@email.com
         */
        email?: string; // string
        /**
         * example:
         * 172.18.0.6
         */
        ip_address?: string; // string
        /**
         * example:
         * 1540278841682
         */
        login_at?: number; // int64
        /**
         * example:
         * Mac OS X
         */
        os_name?: string; // string
        /**
         * example:
         * Country
         */
        browser_name?: string; // string
        /**
         * example:
         * SG
         */
        country?: string; // string
        /**
         * example:
         * SG
         */
        city?: string; // string
        /**
         * example:
         * false
         */
        sentEmail?: boolean;
    };
    /**
     * example:
     * false
     */
    commission_status?: boolean;
    /**
     * example:
     * 1
     */
    allow_order?: number; // int
    /**
     * example:
     * 0
     */
    disable_withdraw?: number; // int
    /**
     * example:
     * XXXXX
     */
    referral_id?: string; // string
    chat_server?: string; // string
    exchange_fee?: {
        /**
         * example:
         * 0.2
         */
        standard_fee?: string; // string
    };
}

export interface BaseCurrency {
    /**
     * example:
     * COSS
     */
    currency_code?: string; // string
    /**
     * example:
     * 100
     */
    minimum_total_order?: string; // string
}

export interface CancelOrder {
    /**
     * example:
     * 9e5ae4dd-3369-401d-81f5-dff985e1c4e7
     */
    order_id: string; // string
    /**
     * example:
     * ETH_BTC
     */
    order_symbol: string; // string
    /**
     * example:
     * 1538114348750
     */
    timestamp: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int64
}

export interface CancelOrderResponse {
    /**
     * example:
     * 9e5ae4dd-3369-401d-81f5-dff985e1c4x7
     */
    order_id?: string; // string
    /**
     * example:
     * ETH_BTC
     */
    order_symbol?: string; // string
}

export interface Coin {
    /**
     * example:
     * USDT
     */
    currency_code?: string; // string
    /**
     * example:
     * Tether
     */
    name?: string; // string
    /**
     * example:
     * 1
     */
    minimum_order_amount?: string; // string
}

export interface CoinVolume {
    /**
     * example:
     * BTC
     */
    CoinName?: string; // string
    /**
     * example:
     * 571.64749041
     */
    Volume?: number; // int64
}

export interface Depth {
    /**
     * example:
     * COSS_ETH
     */
    symbol?: string; // string
    /**
     * example:
     * 10
     */
    limit?: number; // int32
    asks?: string[];
    bids?: string[];
    /**
     * example:
     * 1538114348750
     */
    time?: number; // int64
}

export interface ErrorResponse {
    /**
     * example:
     * 400
     */
    error?: string; // string
    /**
     * example:
     * INVALID_DATA
     */
    error_description?: string; // string
}

export interface ExchangeInfo {
    /**
     * example:
     * UTC
     */
    timezone?: string; // string
    /**
     * example:
     * 1530683054384
     */
    server_time?: number; // int64
    rate_limits?: RateLimit[];
    base_currencies?: BaseCurrency[];
    coins?: Coin[];
    symbols?: Symbol[];
}

export interface MarketPrice {
    /**
     * example:
     * ETH_BTC
     */
    symbol?: string; // string
    /**
     * example:
     * 0.01234567
     */
    price?: string; // string
    /**
     * example:
     * 1538116102137
     */
    updated_time?: number; // int64
}

export type MarketPriceArray = MarketPrice[];

export interface MarketSummariesResponse {
    /**
     * example:
     * true
     */
    success?: string; // string
    /**
     * example:
     */
    message?: string; // string
    result?: MarketSummary[];
    volumes?: CoinVolume[];
    /**
     * example:
     * 1531208813959
     */
    t?: number; // int64
}

export interface MarketSummary {
    /**
     * example:
     * ETH_BTC
     */
    MarketName?: string; // string
    /**
     * example:
     * 0.00018348
     */
    High?: number; // int64
    /**
     * example:
     * 0.00015765
     */
    Low?: number; // int64
    /**
     * example:
     * 240.82775523
     */
    BaseVolume?: number; // int64
    /**
     * example:
     * 0.00017166
     */
    Last?: number; // int64
    /**
     * example:
     * 02018-07-10T07:46:47.958Z
     */
    TimeStamp?: string; // string
    /**
     * example:
     * 1426236.4862518935
     */
    Volume?: number; // int64
    /**
     * example:
     * 14262360.00017663
     */
    Bid?: string; // string
    /**
     * example:
     * 0.00017001
     */
    Ask?: string; // string
    /**
     * example:
     * 0.00017166
     */
    PrevDay?: number; // int64
}

export interface Order {
    /**
     * example:
     * ETH_BTC
     */
    order_symbol: string; // string
    /**
     * example:
     * 1.00234567
     */
    order_price: string; // string
    /**
     * example:
     * 1.00234555
     */
    stop_price?: string; // string
    /**
     * Order side (BUY or SELL)
     * example:
     * BUY
     */
    order_side: "BUY" | "SELL";
    /**
     * example:
     * 1000
     */
    order_size: string; // string
    /**
     * order type (e.g. limit)
     * example:
     * limit
     */
    type: "market" | "limit";
    /**
     * example:
     * 1538114348750
     */
    timestamp: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int32
}

export interface OrderAllRequest {
    /**
     * example:
     * ETH_BTC
     */
    symbol: string; // string
    /**
     * example:
     * order id to fetch from
     */
    from_id?: string; // string
    /**
     * example:
     * default and maximum is 50
     */
    limit?: number; // int32
    /**
     * example:
     * 1530682938651
     */
    timestamp: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int32
}

export type OrderAllResponse = OrderResponse[];

export interface OrderDetail {
    /**
     * example:
     * 9e5ae4dd-3369-401d-81f5-dff985e1cxyz
     */
    order_id: string; // string
    /**
     * example:
     * 1538114348750
     */
    timestamp: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int64
}

export interface OrderListRequest {
    /**
     * example:
     * 10
     */
    limit?: number; // int32
    /**
     * example:
     * 0
     */
    page?: number; // int32
    /**
     * example:
     * ETH_BTC
     */
    symbol: string; // string
    /**
     * example:
     * 1429514463299
     */
    timestamp: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int32
}

export interface OrderListResponse {
    /**
     * example:
     * 2
     */
    total?: number; // int32
    list?: OrderResponse[];
}

export interface OrderResponse {
    /**
     * example:
     * 9e5ae4dd-3369-401d-81f5-dff985e1c4ty
     */
    order_id: string; // string
    /**
     * example:
     * 9e5ae4dd-3369-401d-81f5-dff985e1c4a6
     */
    account_id?: string; // string
    /**
     * example:
     * ETH_BTC
     */
    order_symbol: string; // string
    /**
     * example:
     * BUY
     */
    order_side: "SELL" | "BUY"; // string
    /**
     * example:
     * OPEN
     */
    status: "OPEN" | "CANCELLED" | "FILLED" | "PARTIAL_FILL" | "CANCELLING"; // string
    /**
     * example:
     * 1538114348750
     */
    createTime?: number; // int64
    /**
     * example:
     * limit
     */
    type?: string; // string
    /**
     * example:
     * 0.12345678
     */
    order_price: string; // string
    /**
     * example:
     * 10.12345678
     */
    order_size: string; // string
    /**
     * example:
     * 0
     */
    executed?: string; // string
    /**
     * example:
     * 02.12345678
     */
    stop_price?: string; // string
    /**
     * example:
     * 1.12345678
     */
    avg?: string; // string
    /**
     * example:
     * 2.12345678
     */
    total?: string; // string
}

export interface RateLimit {
    /**
     * example:
     * REQUESTS
     */
    type?: string; // string
    /**
     * example:
     * MINUTE
     */
    interval?: string; // string
    /**
     * example:
     * 60
     */
    limit?: number; // int32
}

export interface ServerStatusInfo {
    /**
     * example:
     * true
     */
    result?: boolean;
}

export interface ServerTimeInfo {
    /**
     * example:
     * 1545196121361
     */
    server_time?: number; // int64
}

export interface Symbol {
    /**
     * example:
     * COSS_ETH
     */
    symbol?: string; // string
    /**
     * example:
     * 0
     */
    amount_limit_decimal?: number; // int32
    /**
     * example:
     * 8
     */
    price_limit_decimal?: number; // int32
    /**
     * example:
     * true
     */
    allow_trading?: boolean; // boolean
}

export interface TradeDetail {
    /**
     * example:
     * 6e34eb38892faf4c3528ab89
     */
    hex_id?: string; // string
    /**
     * example:
     * COSS_ETH
     */
    symbol?: string; // string
    /**
     * example:
     * 08098534-ae65-452e-9a84-5b79a5160b5g
     */
    order_id?: string; // string
    /**
     * example:
     * BUY
     */
    order_side?: string; // string
    /**
     * example:
     * 0.00064600
     */
    price?: string; // string
    /**
     * example:
     * 10
     */
    quantity?: string; // string
    /**
     * example:
     * 0.00700000 COSS
     */
    fee?: string; // string
    /**
     * example:
     * 0.00646000 ETH
     */
    total?: string; // string
    /**
     * example:
     * 1545196121361
     */
    timestamp?: number; // int64
}

export interface TradeDetailRequest {
    /**
     * example:
     * 08098534-ae65-452e-9a84-5b79a5160b5g
     */
    order_id?: string; // string
    /**
     * example:
     * 1545196121361
     */
    timestamp?: number; // int64
    /**
     * example:
     * 5000
     */
    recvWindow?: number; // int
}

export type TradeDetailsArray = TradeDetail[];

export interface TradeHistory {
    /**
     * example:
     * 139638
     */
    id?: string; // string
    /**
     * example:
     * 0.00001723
     */
    price?: string; // string
    /**
     * example:
     * 81.00000000
     */
    qty?: string; // string
    /**
     * example:
     * false
     */
    isBuyerMaker?: boolean;
    /**
     * example:
     * 1529262196270
     */
    time?: number; // int64
}

export interface TradeHistoryResponse {
    /**
     * example:
     * ETH_BTC
     */
    symbol?: string; // string
    /**
     * max number of records in array
     * example:
     * 100
     */
    limit?: number; // int
    history?: TradeHistory[];
    /**
     * example:
     * 1529298130192
     */
    time?: number; // int64
}
