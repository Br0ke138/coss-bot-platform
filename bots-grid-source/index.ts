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
    keys: {public: string, secret: string};
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

let config: Config;
let price: number;
let cossApi: CossApiService;
let orders: Array<OrderResponse> = [];

let stop = false;

process.on('message', async (msg) => {
    if (msg.action === 'start') {
        // @ts-ignore
        process.send('Bot started');
        try {
            const bot: Bot = await request.get('http://localhost:3000/db/bots/' + msg.id, {json: true});
            // @ts-ignore
            process.send(bot);
            if (bot.config) {
                config = bot.config;
                // @ts-ignore
                process.send(config);

                cossApi = new CossApiService(bot.keys.public, bot.keys.secret);
                // @ts-ignore
                process.send(cossApi);
                try {
                    // @ts-ignore
                    process.send('price... ');
                    price = parseFloat((await cossApi.getMarketPrice(config.pair))[0].price);
                    // @ts-ignore
                    process.send('price: ' + price);
                } catch (e) {
                    // @ts-ignore
                    process.send("Unable to fetch price");
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
                        }
                    }

                    await checkOrders();
                }
            }
        } catch (e) {
            // @ts-ignore
            process.send('err' + e);
        }
    }
    if (msg.action === 'stop') {
        stop = true;
    }
});


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
                if (config.grids) {
                    let index = config.grids.indexOf(parseFloat(orders[i].order_price));

                    if (orders[i].order_side === "BUY") {
                        index--;
                        try {
                            await placeOrder('SELL', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
                        }
                    } else {
                        index++;
                        try {
                            await placeOrder('BUY', config.grids[index].toString(), Decimal.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair);
                        } catch (e) {
                            orders[i].status = "PARTIAL_FILL";
                            console.log(e);
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
            process.exit(0);
        } catch (e) {
            // @ts-ignore
            process.send({err: 'Failed to cancel orders'});
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
                    console.log('Placed ' + newOrder.order_side + ' Order at ' + newOrder.order_price);
                    orders.push(newOrder);
                    resolve(newOrder);
                    break;
                } else {
                    if (i === 2) {
                        reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                    }
                }
            } catch (e) {
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