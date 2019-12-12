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
var coss_api_service_1 = require("./coss-api/coss-api.service");
var request_promise_native_1 = __importDefault(require("request-promise-native"));
var decimal_js_1 = __importDefault(require("decimal.js"));
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
var botId;
var botName;
var config;
var price;
var cossApi;
var orders = [];
var stop = false;
process.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var bot, keys, _a, e_1, grids, closest, _i, _b, grid, e_2, e_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(msg.action === 'start')) return [3 /*break*/, 23];
                stop = false;
                botId = msg.id;
                // @ts-ignore
                console.log('Bot started', botId);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 21, , 23]);
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + botId, { json: true })];
            case 2:
                bot = _c.sent();
                if (!bot.config) return [3 /*break*/, 20];
                config = bot.config;
                botName = bot.name;
                return [4 /*yield*/, sendTelegram(botName + ' started on pair: ' + config.pair)];
            case 3:
                _c.sent();
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/keys/' + bot.keys.id, { json: true })];
            case 4:
                keys = _c.sent();
                cossApi = new coss_api_service_1.CossApiService(keys.public, keys.secret);
                _c.label = 5;
            case 5:
                _c.trys.push([5, 7, , 8]);
                _a = parseFloat;
                return [4 /*yield*/, cossApi.getMarketPrice(config.pair)];
            case 6:
                price = _a.apply(void 0, [(_c.sent())[0].price]);
                return [3 /*break*/, 8];
            case 7:
                e_1 = _c.sent();
                // @ts-ignore
                console.log("Unable to fetch price", botId);
                process.exit(0);
                return [3 /*break*/, 8];
            case 8:
                if (!config.grids) return [3 /*break*/, 20];
                grids = config.grids;
                closest = grids.reduce(function (prev, curr) { return (Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev); });
                grids.splice(grids.indexOf(closest), 1);
                _i = 0, _b = config.grids;
                _c.label = 9;
            case 9:
                if (!(_i < _b.length)) return [3 /*break*/, 18];
                grid = _b[_i];
                _c.label = 10;
            case 10:
                _c.trys.push([10, 12, , 17]);
                // @ts-ignore
                return [4 /*yield*/, placeOrder(parseFloat(grid) > price ? 'SELL' : 'BUY', grid.toString(), decimal_js_1.default.div(config.amountPerGrid, grid).toNumber().toFixed(config.precisionAmount), config.pair)];
            case 11:
                // @ts-ignore
                _c.sent();
                return [3 /*break*/, 17];
            case 12:
                e_2 = _c.sent();
                console.log(e_2);
                console.log('Failed to place all orders. Bot will cancel all orders it made');
                return [4 /*yield*/, sendTelegram(botName + ' failed to place all orders and will cancel already created orders')];
            case 13:
                _c.sent();
                return [4 /*yield*/, cancelAllOrders()];
            case 14:
                _c.sent();
                console.log('All orders canceled. Bot will enter status stopped');
                return [4 /*yield*/, sendTelegram(botName + ' canceled all orders')];
            case 15:
                _c.sent();
                return [4 /*yield*/, changeBotStatus(BotStatus.Stopped)];
            case 16:
                _c.sent();
                return [3 /*break*/, 17];
            case 17:
                _i++;
                return [3 /*break*/, 9];
            case 18: return [4 /*yield*/, checkOrders()];
            case 19:
                _c.sent();
                _c.label = 20;
            case 20: return [3 /*break*/, 23];
            case 21:
                e_3 = _c.sent();
                return [4 /*yield*/, changeBotStatus(BotStatus.Crashed)];
            case 22:
                _c.sent();
                console.log('Failed on startup. Bot will enter status Crashed');
                console.log(e_3);
                return [3 /*break*/, 23];
            case 23:
                if (msg.action === 'stop') {
                    stop = true;
                }
                return [2 /*return*/];
        }
    });
}); });
function sendTelegram(text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_promise_native_1.default.post('http://localhost:3000/telegram', { body: text })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function changeBotStatus(status) {
    return __awaiter(this, void 0, void 0, function () {
        var bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + botId, { json: true })];
                case 1:
                    bot = _a.sent();
                    bot.status = status;
                    return [4 /*yield*/, request_promise_native_1.default.put({
                            url: 'http://localhost:3000/db/bots/' + botId,
                            body: bot,
                            json: true
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sendTelegram(botName + ' changed status: ' + status)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkOrders() {
    return __awaiter(this, void 0, void 0, function () {
        var i, fetchedOrder, e_4, index, e_5, e_6, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (orders.length < 1) {
                        // @ts-ignore
                        process.send("No orders found");
                        process.exit(0);
                    }
                    orders = orders.filter(function (order) {
                        return order.status.toUpperCase() !== "FILLED";
                    });
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < orders.length)) return [3 /*break*/, 20];
                    fetchedOrder = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cossApi.getOrderDetails({
                            order_id: orders[i].order_id,
                            recvWindow: 9999999,
                            timestamp: Date.now()
                        })];
                case 3:
                    fetchedOrder = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!(fetchedOrder && fetchedOrder.order_id)) return [3 /*break*/, 18];
                    orders[i] = fetchedOrder;
                    if (!(orders[i].status.toUpperCase() === "FILLED")) return [3 /*break*/, 17];
                    console.log("Found filled order", orders[i]);
                    return [4 /*yield*/, sendTelegram('Order filled: \n\n' + JSON.stringify(orders[i], null, 2))];
                case 6:
                    _a.sent();
                    if (!config.grids) return [3 /*break*/, 17];
                    index = config.grids.indexOf(parseFloat(orders[i].order_price));
                    if (!(orders[i].order_side === "BUY")) return [3 /*break*/, 12];
                    index--;
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 11]);
                    return [4 /*yield*/, placeOrder('SELL', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 9:
                    e_5 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_5);
                    return [4 /*yield*/, sendTelegram('Failed to place matching order. Will retry next cycle')];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 17];
                case 12:
                    index++;
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 17]);
                    return [4 /*yield*/, placeOrder('BUY', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 15:
                    e_6 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_6);
                    return [4 /*yield*/, sendTelegram('Failed to place matching order. Will retry next cycle')];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 17: return [3 /*break*/, 19];
                case 18:
                    console.log('Unable to get last status of order:', orders[i]);
                    _a.label = 19;
                case 19:
                    i++;
                    return [3 /*break*/, 1];
                case 20:
                    if (!stop) return [3 /*break*/, 27];
                    _a.label = 21;
                case 21:
                    _a.trys.push([21, 24, , 26]);
                    return [4 /*yield*/, cancelAllOrders()];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, changeBotStatus(BotStatus.Stopped)];
                case 23:
                    _a.sent();
                    console.log('All orders canceled. Bot will enter status stopped');
                    process.exit(0);
                    return [3 /*break*/, 26];
                case 24:
                    e_7 = _a.sent();
                    return [4 /*yield*/, changeBotStatus(BotStatus.Crashed)];
                case 25:
                    _a.sent();
                    console.log('Failed to cancel all orders. Bot will enter status crashed');
                    return [3 /*break*/, 26];
                case 26: return [3 /*break*/, 29];
                case 27: return [4 /*yield*/, checkOrders()];
                case 28:
                    _a.sent();
                    _a.label = 29;
                case 29: return [2 /*return*/];
            }
        });
    });
}
function placeOrder(side, price, amount, symbol) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var i, orderToPlace, newOrder, e_8;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 9];
                                orderToPlace = {
                                    order_price: price,
                                    order_side: side,
                                    order_size: amount,
                                    order_symbol: symbol,
                                    recvWindow: 99999999,
                                    timestamp: Date.now(),
                                    type: 'limit'
                                };
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 7, , 8]);
                                return [4 /*yield*/, cossApi.placeOrder({
                                        order_price: price,
                                        order_side: side,
                                        order_size: amount,
                                        order_symbol: symbol,
                                        recvWindow: 99999999,
                                        timestamp: Date.now(),
                                        type: 'limit'
                                    })];
                            case 3:
                                newOrder = _a.sent();
                                if (!(newOrder && newOrder.order_id)) return [3 /*break*/, 5];
                                console.log(orderToPlace);
                                return [4 /*yield*/, sendTelegram(JSON.stringify(orderToPlace, undefined, 2))];
                            case 4:
                                _a.sent();
                                orders.push(newOrder);
                                resolve(newOrder);
                                return [3 /*break*/, 9];
                            case 5:
                                if (i === 2) {
                                    reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                                }
                                _a.label = 6;
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                e_8 = _a.sent();
                                console.log(e_8);
                                if (i === 2) {
                                    reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                                }
                                return [3 /*break*/, 8];
                            case 8:
                                i++;
                                return [3 /*break*/, 1];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function cancelOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var i, canceledOrder, index, e_9;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 9];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 7, , 8]);
                                return [4 /*yield*/, cossApi.cancelOrder({
                                        timestamp: Date.now(),
                                        recvWindow: 99999999,
                                        order_symbol: order.order_symbol,
                                        order_id: order.order_id
                                    })];
                            case 3:
                                canceledOrder = _a.sent();
                                if (!(canceledOrder && canceledOrder.order_id)) return [3 /*break*/, 5];
                                console.log('Canceled Order: ' + order.order_id);
                                return [4 /*yield*/, sendTelegram('Canceled Order: ' + order.order_id)];
                            case 4:
                                _a.sent();
                                index = orders.indexOf(order);
                                orders.splice(index, 1);
                                resolve(true);
                                return [3 /*break*/, 9];
                            case 5:
                                if (i === 2) {
                                    reject('Unable to cancel order: orderId');
                                }
                                _a.label = 6;
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                e_9 = _a.sent();
                                if (i === 2) {
                                    reject('Unable to cancel order: orderId');
                                }
                                return [3 /*break*/, 8];
                            case 8:
                                i++;
                                return [3 /*break*/, 1];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function cancelAllOrders() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, orders_1, order, e_10;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, orders_1 = orders;
                                _a.label = 1;
                            case 1:
                                if (!(_i < orders_1.length)) return [3 /*break*/, 6];
                                order = orders_1[_i];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, cancelOrder(order)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                e_10 = _a.sent();
                                // @ts-ignore
                                process.send(e_10);
                                // @ts-ignore
                                process.exit(0);
                                return [3 /*break*/, 5];
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6:
                                resolve(true);
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
