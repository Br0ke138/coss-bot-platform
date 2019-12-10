"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {CancelOrderResponse, OrderResponse} from "./swaggerSchema";
var request_promise_native_1 = __importDefault(require("request-promise-native"));
var BotTypes;
(function (BotTypes) {
    BotTypes["GRID"] = "GRID";
})(BotTypes = exports.BotTypes || (exports.BotTypes = {}));
var BotStatus;
(function (BotStatus) {
    BotStatus["Init"] = "Init";
    BotStatus["Running"] = "Running";
    BotStatus["Stopped"] = "Stopped";
    BotStatus["Crashed"] = "Crashed";
})(BotStatus = exports.BotStatus || (exports.BotStatus = {}));
var config;
var cossApi;
var stopped = false;
process.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var bot, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(msg.action === 'start')) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + msg.id, { json: true })];
            case 2:
                bot = _a.sent();
                if (bot.config) {
                    config = bot.config;
                    // @ts-ignore
                    process.send('message', bot);
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                // @ts-ignore
                process.send(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
