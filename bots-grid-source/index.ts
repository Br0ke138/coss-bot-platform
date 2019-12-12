import {CossApiService} from './coss-api/coss-api.service';
import {CancelOrderResponse, OrderResponse} from "./swaggerSchema";
import request from "request-promise-native";
import Decimal from "decimal.js";

export interface Bot {
    id?: string;
    name: string;
    type: BotTypes;
    status?: BotStatus;
    orders?: Array<string>;
    config?: Config;
    keys: {id: string, name: string};
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
                const keys: Key = await request.get('http://localhost:3000/db/keys/'+ bot.keys.id, {json: true});
                cossApi = new CossApiService(keys.public, keys.secret);

                try {
                    price = parseFloat((await cossApi.getMarketPrice(config.pair))[0].price);
                } catch (e) {
                    // @ts-ignore
                    console.log("Unable to fetch price", botId);
                    process.exit(0);
                }


                if (config.grids) {
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
                }
            }
        } catch (e) {
            await changeBotStatus(BotStatus.Crashed);
            console.log('Failed on startup. Bot will enter status Crashed');
            console.log(e);
        }
    }
    if (msg.action === 'stop') {
        stop = true;
    }
});



async function sendTelegram(text: string) {
    await request.post('http://localhost:3000/telegram', {body: text});
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
    if (orders.length < 1) {
        // @ts-ignore
        process.send("No orders found");
        process.exit(0);
    }
    orders = orders.filter(order => {
        return order.status.toUpperCase() !== "FILLED"
    });

    for (let i = 0; i < orders.length; i++) {
        let fetchedOrder;
        try {
            fetchedOrder = await cossApi.getOrderDetails({
                order_id: orders[i].order_id,
                recvWindow: 9999999,
                timestamp: Date.now()
            });
        } catch (e) {

        }

        if (fetchedOrder && fetchedOrder.order_id) {
            orders[i] = fetchedOrder;

            if (orders[i].status.toUpperCase() === "FILLED") {
                console.log("Found filled order", orders[i]);
                await sendTelegram('Order filled: \n\n' + JSON.stringify(orders[i], null, 2));
                if (config.grids) {
                    let index = config.grids.indexOf(parseFloat(orders[i].order_price));

                    if (orders[i].order_side === "BUY") {
                        index--;
                        try {
                            await placeOrder('SELL', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
                            await sendTelegram('Failed to place matching order. Will retry next cycle');
                        }
                    } else {
                        index++;
                        try {
                            await placeOrder('BUY', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
                            await sendTelegram('Failed to place matching order. Will retry next cycle');
                        }
                    }
                }
            }
        } else {
            console.log('Unable to get last status of order:', orders[i]);
        }
    }
    if (stop) {
        try {
            await cancelAllOrders();
            await changeBotStatus(BotStatus.Stopped);
            console.log('All orders canceled. Bot will enter status stopped');
            process.exit(0);
        } catch (e) {
            await changeBotStatus(BotStatus.Crashed);
            console.log('Failed to cancel all orders. Bot will enter status crashed');
        }
    } else {
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
                    console.log(orderToPlace);
                    await sendTelegram(JSON.stringify(orderToPlace, undefined, 2));
                    orders.push(newOrder);
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
                    await sendTelegram('Canceled Order: ' + order.order_id);
                    const index = orders.indexOf(order);
                    orders.splice(index, 1);
                    resolve(true);
                    break;
                } else {
                    if (i === 2) {
                        reject('Unable to cancel order: orderId');
                    }
                }
            } catch (e) {
                if (i === 2) {
                    reject('Unable to cancel order: orderId');
                }
            }
        }
    });
}

async function cancelAllOrders(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        for (let order of orders) {
            try {
                await cancelOrder(order);
            } catch (e) {
                // @ts-ignore
                process.send(e);
                // @ts-ignore
                process.exit(0);
            }
        }
        resolve(true);
    });
}