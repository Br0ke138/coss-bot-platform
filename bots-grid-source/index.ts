// import {CossApiService} from './coss-api/coss-api.service';
// import {CancelOrderResponse, OrderResponse} from "./swaggerSchema";
import request from "request-promise-native";

let config: any;

process.on('message', async (msg) => {
    if (msg.action === 'start') {
        try {
            const bot = await request.get('http://localhost:3000/db/bots/' + msg.id, {json: true});
            config = bot.config;
            // @ts-ignore
            process.send(config);
        } catch (e) {
            // @ts-ignore
            process.send(e);
        }
    }
});
//
// const Decimal = require('decimal');
//
// // --------------------------------------------------------
//
// const cossApi = new CossApiService(config.PUBLIC_KEY, config.PRIVATE_KEY);
//
// let orders: Array<OrderResponse> = [];
// let GRID_LEVELS: Array<string> = [];
// let precision: number;
//
// const UPPER_WALL = config.UPPER_WALL;
// const LOWER_WALL = config.LOWER_WALL;
// const NUMBER_OF_GRIDS = config.NUMBER_OF_GRIDS;
// const AMOUNT_PER_GRID = config.AMOUNT_PER_GRID;
// const PAIR = config.PAIR;
// const MARGIN = (UPPER_WALL - LOWER_WALL) / NUMBER_OF_GRIDS;
//
// (async () => {
//
//     if (config.KEEP_ORDERS_ON_RESTART) {
//         GRID_LEVELS = db.get('grids').value();
//         orders = db.get('orders').value();
//     } else {
//         const ordersToCancel = db.get('orders').value();
//
//         for (let order of ordersToCancel) {
//             try {
//                 await cancelOrder(order);
//             } catch (e) {
//                 // @ts-ignore
//                 process.send(e);
//                 // @ts-ignore
//                 process.send("Please cancel orders manually and delete content of /build/db.json and then restart the bot");
//                 process.exit(0);
//             }
//         }
//     }
//
//     try {
//         const symbols = await cossApi.getOrderSymbols();
//         const found = symbols.filter(symbol => {
//             return symbol.symbol === config.PAIR;
//         });
//         if (found.length !== 1) {
//             console.log("Pair not found");
//             process.exit(0);
//         }
//         precision = found[0].price_limit_decimal;
//     } catch (e) {
//         console.log("Pair not found");
//         process.exit(0);
//     }
//     let price: string;
//     let currentPrice: number;
//     try {
//         price = (await cossApi.getMarketPrice(PAIR))[0].price;
//         currentPrice = parseFloat(price);
//     } catch (e) {
//         console.log("Unable to fetch price");
//         process.exit(0);
//     }
//
//     if (GRID_LEVELS.length < 1) {
//         for (let i = 0; i < NUMBER_OF_GRIDS; i++) {
//             // @ts-ignore
//             GRID_LEVELS.push((Decimal(UPPER_WALL).sub(Decimal(MARGIN).mul(i)).toNumber()).toFixed(precision))
//         }
//     }
//
//     const closest = GRID_LEVELS.reduce((prev, curr) => (Math.abs(parseFloat(curr) - currentPrice) < Math.abs(parseFloat(prev) - currentPrice) ? curr : prev));
//     GRID_LEVELS.splice(GRID_LEVELS.indexOf(closest), 1);
//
//     db.set('grids', GRID_LEVELS).write();
//
//     for (let level of GRID_LEVELS) {
//         try {
//             // @ts-ignore
//             await placeOrder(parseFloat(level) > currentPrice ? 'SELL' : 'BUY', level, AMOUNT_PER_GRID.toString(), PAIR);
//         } catch (e) {
//             console.log(e);
//         }
//     }
//
//     await checkOrders();
// })();
//
//
// async function checkOrders() {
//     if (orders.length < 1) {
//         console.log("No orders found");
//         process.exit(0);
//     }
//     console.log("check");
//     orders = orders.filter(order => {
//         return order.status.toUpperCase() !== "FILLED"
//     });
//
//     for (let i = 0; i < orders.length; i++) {
//         let fetchedOrder;
//         try {
//             fetchedOrder = await cossApi.getOrderDetails({
//                 order_id: orders[i].order_id,
//                 recvWindow: 9999999,
//                 timestamp: Date.now()
//             });
//         } catch (e) {
//
//         }
//
//         if (fetchedOrder && fetchedOrder.order_id) {
//             orders[i] = fetchedOrder;
//
//             if (orders[i].status.toUpperCase() === "FILLED") {
//                 console.log("Found filled order", orders[i]);
//                 let index = GRID_LEVELS.indexOf(parseFloat(orders[i].order_price).toFixed(precision));
//
//                 if (orders[i].order_side === "BUY") {
//                     index--;
//                     try {
//                         await placeOrder('SELL', GRID_LEVELS[index], AMOUNT_PER_GRID.toString(), PAIR);
//                     } catch (e) {
//                         orders[i].status = "PARTIAL_FILL";
//                         console.log(e);
//                     }
//                 } else {
//                     index++;
//                     try {
//                         await placeOrder('BUY', GRID_LEVELS[index], AMOUNT_PER_GRID.toString(), PAIR);
//                     } catch (e) {
//                         orders[i].status = "PARTIAL_FILL";
//                         console.log(e);
//                     }
//                 }
//             }
//         } else {
//             console.log('Unable to get last status of order:', orders[i]);
//         }
//     }
//     await checkOrders();
// }
//
// async function placeOrder(side: 'SELL' | 'BUY', price: string, amount: string, symbol: string): Promise<OrderResponse> {
//     return new Promise(async (resolve, reject) => {
//         for (let i = 0; i < 3; i++) {
//             const orderToPlace = {
//                 order_price: price,
//                 order_side: side,
//                 order_size: amount,
//                 order_symbol: symbol,
//                 recvWindow: 99999999,
//                 timestamp: Date.now(),
//                 type: 'limit'
//             };
//
//             try {
//                 const newOrder = await cossApi.placeOrder({
//                     order_price: price,
//                     order_side: side,
//                     order_size: amount,
//                     order_symbol: symbol,
//                     recvWindow: 99999999,
//                     timestamp: Date.now(),
//                     type: 'limit'
//                 });
//
//                 if (newOrder && newOrder.order_id) {
//                     console.log('Placed ' + newOrder.order_side + ' Order at ' + newOrder.order_price);
//                     orders.push(newOrder);
//                     db.set('orders', orders).write();
//                     resolve(newOrder);
//                     break;
//                 } else {
//                     if (i === 2) {
//                         reject('Unable to place order: ' + orderToPlace);
//                     }
//                 }
//             } catch (e) {
//                 if (i === 2) {
//                     reject('Unable to place order: ' + orderToPlace);
//                 }
//             }
//         }
//     });
// }
//
// async function cancelOrder(order: OrderResponse): Promise<boolean> {
//     return new Promise(async (resolve, reject) => {
//         for (let i = 0; i < 3; i++) {
//             try {
//                 const canceledOrder: CancelOrderResponse = await cossApi.cancelOrder({
//                     timestamp: Date.now(),
//                     recvWindow: 99999999,
//                     order_symbol: order.order_symbol,
//                     order_id: order.order_id
//                 });
//
//                 if (canceledOrder && canceledOrder.order_id) {
//                     console.log('Canceled Order: ' + order.order_id);
//                     const index = orders.indexOf(order);
//                     orders.splice(index, 1);
//                     db.set('orders', orders).write();
//                     resolve(true);
//                     break;
//                 } else {
//                     if (i === 2) {
//                         reject('Unable to cancel order: orderId');
//                     }
//                 }
//             } catch (e) {
//                 if (i === 2) {
//                     reject('Unable to cancel order: orderId');
//                 }
//             }
//         }
//     });
// }