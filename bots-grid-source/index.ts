import {CossApiService} from './coss-api/coss-api.service';
import {CancelOrderResponse, Order, OrderListResponse, OrderResponse, TradeDetailsArray} from "./swaggerSchema";
import request from "request-promise-native";
import Decimal from "decimal.js";

export interface Bot {
    id?: string;
    name: string;
    type: BotTypes;
    status?: BotStatus;
    orders?: Array<string>;
    config?: Config;
    keys: { id: string, name: string };
}

export enum BotTypes {
    'GRID' = 'GRID',
}

export enum BotStatus {
    'Init' = 'Init',
    'Running' = 'Running',
    'Stopped' = 'Stopped',
    'Crashed' = 'Crashed',
}

export interface Config {
    pair: string;
    upperWall: string;
    lowerWall: string;
    numberOfGrids: string;
    amountPerGrid: string;
    grids?: Array<number>;
    orders?: Array<OrderResponse>;
    precisionPrice?: number;
    precisionAmount?: number;
}

export interface Key {
    id?: number;
    name: string;
    public: string;
    secret: string;
}

let botId: string;
let botName: string;
let config: Config;
let price: number;
let cossApi: CossApiService;
let orders: Array<OrderResponse> = [];

let stop = false;
process.on('message', async (msg) => {
    if (msg.action === 'start') {
        stop = false;
        botId = msg.id;
        // @ts-ignore
        console.log('Bot started', botId);
        try {
            const bot: Bot = await request.get('http://localhost:3000/db/bots/' + botId, {json: true});

            if (bot.config) {
                config = bot.config;
                botName = bot.name;

                await sendTelegram(botName + ' started on pair: ' + config.pair);
                const keys: Key = await request.get('http://localhost:3000/db/keys/' + bot.keys.id, {json: true});
                cossApi = new CossApiService(keys.public, keys.secret);
                if ((!config.orders || config.orders.length < 1) && config.grids) {
                    try {
                        price = parseFloat((await cossApi.getMarketPrice(config.pair))[0].price);


                        let grids = config.grids;
                        const closest = grids.reduce((prev, curr) => (Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev));
                        grids.splice(grids.indexOf(closest), 1);

                        for (let grid of config.grids) {
                            try {
                                // @ts-ignore
                                await placeOrder(parseFloat(grid) > price ? 'SELL' : 'BUY', grid.toString(), Decimal.div(config.amountPerGrid, grid).toNumber().toFixed(config.precisionAmount), config.pair);
                            } catch (e) {
                                console.log(e);
                                console.log('Failed to place all orders. Bot will cancel all orders it made');
                                await sendTelegram(botName + ' failed to place all orders and will cancel already created orders');
                                await cancelAllOrders();
                                console.log('All orders canceled. Bot will enter status stopped');
                                await sendTelegram(botName + ' canceled all orders');
                                await changeBotStatus(BotStatus.Stopped);
                            }
                        }

                        await checkOrders();

                    } catch (e) {
                        // @ts-ignore
                        console.log("Unable to fetch price", botId);
                        await changeBotStatus(BotStatus.Crashed);
                    }
                }
                if (config.orders && config.orders.length > 0) {
                    orders = config.orders;
                    sendTelegram(botName + ': Will continue operation. ' + config.orders.length + ' Orders found');
                    await checkOrders();
                }
            } else {
                throw 'No Config found';
            }
        } catch (e) {
            await changeBotStatus(BotStatus.Crashed);
            console.log('Failed on startup. Bot will enter status Crashed');
            console.log(e);
        }
    }
    if (msg.action === 'stop') {
        stop = true;
        botId = msg.id;
        const bot: Bot = await request.get('http://localhost:3000/db/bots/' + botId, {json: true});
        botName = bot.name;
        if (bot.status === 'Crashed' && bot.config && bot.config.orders) {
            orders = bot.config.orders;
            const keys: Key = await request.get('http://localhost:3000/db/keys/' + bot.keys.id, {json: true});
            cossApi = new CossApiService(keys.public, keys.secret);
            await checkOrders();
        }
        // @ts-ignore
        await sendTelegram(botName + ' stopped on pair: ' + bot.config.pair);
    }
});

async function sendTelegram(text: string) {
    await request.post('http://localhost:3000/telegramApi/telegram', {body: {msg: text, type: botId}, json: true});
}

async function changeBotStatus(status: BotStatus) {
    const bot: Bot = await request.get('http://localhost:3000/db/bots/' + botId, {json: true});
    bot.status = status;
    await request.put({
        url: 'http://localhost:3000/db/bots/' + botId,
        body: bot,
        json: true
    });
    await sendTelegram(botName + ' changed status: ' + status);
}


async function checkOrders() {
    if (stop) {
        try {
            await cancelAllOrders();
            await changeBotStatus(BotStatus.Stopped);
            console.log('All orders canceled. Bot will enter status stopped');
        } catch (e) {
            await changeBotStatus(BotStatus.Crashed);
            console.log('Failed to cancel all orders. Bot will enter status crashed');
        }
        return;
    } else {
        if (orders.length < 1) {
            changeBotStatus(BotStatus.Crashed);
            // @ts-ignore
            process.send("No orders found");
            process.exit(0);
        }

        try {
            const filledOrders = await fetchCompletedOrders(config.pair);
            for (let i = 0; i < orders.length; i++) {
                for (let filledOrder of filledOrders) {
                    if (orders[i].order_id === filledOrder.order_id) {
                        orders[i] = filledOrder;
                        await updateOrder(orders[i]);
                    }
                }
            }

            for (let i = 0; i < orders.length; i++) {
                if (stop) {
                    break;
                }
                if (orders[i].status.toUpperCase() === 'FILLED') {
                    await sendTelegram(botName + ': Filled a ' + orders[i].order_side + ' order on pair ' + orders[i].order_symbol + ' with amount ' + orders[i].order_size + ' @ ' + orders[i].order_price);

                    // @ts-ignore
                    let index = config.grids.indexOf(parseFloat(orders[i].order_price));

                    if (orders[i].order_side === "BUY") {
                        index--;
                        try {
                            // @ts-ignore
                            await placeOrder('SELL', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                            await removeOrder(orders[i]);
                            await saveHistory(orders[i].order_id);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
                            await sendTelegram('Failed to place matching order. Will retry next cycle');
                        }
                    } else {
                        index++;
                        try {
                            // @ts-ignore
                            await placeOrder('BUY', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                            await removeOrder(orders[i]);
                            await saveHistory(orders[i].order_id);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
                            await sendTelegram('Failed to place matching order. Will retry next cycle');
                        }
                    }
                }
            }

            orders = orders.filter(order => {
                return order.status.toUpperCase() !== "FILLED"
            });
        } catch (e) {
            console.log(e);
        }

        await checkOrders();
    }
}

async function placeOrder(side: 'SELL' | 'BUY', price: string, amount: string, symbol: string): Promise<OrderResponse> {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            const orderToPlace = {
                order_price: price,
                order_side: side,
                order_size: amount,
                order_symbol: symbol,
                recvWindow: 99999999,
                timestamp: Date.now(),
                type: 'limit'
            };

            try {
                const newOrder = await cossApi.placeOrder({
                    order_price: price,
                    order_side: side,
                    order_size: amount,
                    order_symbol: symbol,
                    recvWindow: 99999999,
                    timestamp: Date.now(),
                    type: 'limit'
                });

                if (newOrder && newOrder.order_id) {
                    await sendTelegram(botName + ': Placed a ' + side + ' order on pair ' + symbol + ' with amount ' + amount + ' @ ' + price);
                    orders.push(newOrder);
                    saveOrder(newOrder);
                    resolve(newOrder);
                    break;
                } else {
                    if (i === 2) {
                        reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                    }
                }
            } catch (e) {
                console.log(e);
                if (i === 2) {
                    reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                }
            }
        }
    });
}

async function cancelOrder(order: OrderResponse): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            try {
                const canceledOrder: CancelOrderResponse = await cossApi.cancelOrder({
                    timestamp: Date.now(),
                    recvWindow: 99999999,
                    order_symbol: order.order_symbol,
                    order_id: order.order_id
                });

                if (canceledOrder && canceledOrder.order_id) {
                    console.log('Canceled Order: ' + order.order_id);
                    const index = orders.indexOf(order);
                    orders.splice(index, 1);
                    resolve(true);
                    break;
                } else {
                    if (i === 2) {
                        reject('Unable to cancel order: ' + order.order_id + order.order_price);
                    }
                }
            } catch (e) {
                if (i === 2) {
                    reject('Unable to cancel order: ' + order.order_id + order.order_price);
                }
            }
        }
    });
}

async function cancelAllOrders(): Promise<boolean> {
    await sendTelegram(botName + ': Will cancel all orders ...');
    return new Promise(async (resolve, reject) => {
        for (let order of orders) {
            try {
                await cancelOrder(order);
                await removeOrder(order);
                await saveHistory(order.order_id);

                // await sendTelegram(botName + ': Canceled a ' + order.order_side + ' order on pair ' + order.order_symbol + ' with amount ' + order.order_size + ' @ ' + order.order_price);
            } catch (e) {
                // @ts-ignore
                process.send(e);
                // @ts-ignore
                process.exit(0);
            }
        }
        await sendTelegram(botName + ': Canceled ' + orders.length + ' orders');
        resolve(true);
    });
}

async function fetchCompletedOrders(symbol: string): Promise<Array<OrderResponse>> {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            try {
                const completedOrders: OrderListResponse = await cossApi.getCompletedOrders({
                    timestamp: Date.now(),
                    recvWindow: 99999999,
                    symbol: symbol,
                    limit: 50,
                    page: 0,
                });

                if (completedOrders && completedOrders.list) {
                    resolve(completedOrders.list);
                    break;
                } else {
                    if (i === 2) {
                        reject('Unable to fetch completed orders');
                    }
                }
            } catch (e) {
                if (i === 2) {
                    reject('Unable to fetch completed orders');
                }
            }
        }
    });
}

async function saveHistory(order_id: string) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            try {
                const tradeDetails: TradeDetailsArray = await cossApi.getTradeDetails({
                    timestamp: Date.now(),
                    recvWindow: 99999999,
                    order_id: order_id
                });

                for (let tradeDetail of tradeDetails) {
                    await request.post('http://localhost:3000/db/historys', {
                        json: true,
                        body: Object.assign({botId: botId}, tradeDetail)
                    });
                }
                resolve();
            } catch (e) {
                console.log('Unable so get profits for order: ' + order_id);
                resolve();
            }
        }
    })
}

async function saveOrder(order: OrderResponse) {
    await updateBotOrders();
    await request.post('http://localhost:3000/db/orders', {body: Object.assign({botId: botId}, order), json: true})
}

async function updateOrder(order: OrderResponse) {
    await updateBotOrders();
    await request.put('http://localhost:3000/db/orders/' + order.order_id, {
        body: Object.assign({botId: botId}, order),
        json: true
    })
}

async function removeOrder(order: OrderResponse) {
    await updateBotOrders();
    await request.delete('http://localhost:3000/db/orders/' + order.order_id);
}

async function updateBotOrders() {
    const bot: Bot = await request.get('http://localhost:3000/db/bots/' + botId, {json: true});
    // @ts-ignore
    bot.config.orders = orders;
    await request.put('http://localhost:3000/db/bots/' + botId, {json: true, body: bot});
}
