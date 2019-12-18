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
    var bot, keys, _a, e_1, grids, closest, _i, _b, grid, e_2, e_3, bot, keys;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(msg.action === 'start')) return [3 /*break*/, 25];
                stop = false;
                botId = msg.id;
                // @ts-ignore
                console.log('Bot started', botId);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 23, , 25]);
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + botId, { json: true })];
            case 2:
                bot = _c.sent();
                if (!bot.config) return [3 /*break*/, 22];
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
                if (!(config.orders && config.orders.length > 0)) return [3 /*break*/, 10];
                orders = config.orders;
                sendTelegram(botName + ': Will continue operation. ' + config.orders.length + ' Orders found');
                return [4 /*yield*/, checkOrders()];
            case 9:
                _c.sent();
                _c.label = 10;
            case 10:
                if (!((!config.orders || config.orders.length < 1) && config.grids)) return [3 /*break*/, 22];
                grids = config.grids;
                closest = grids.reduce(function (prev, curr) { return (Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev); });
                grids.splice(grids.indexOf(closest), 1);
                _i = 0, _b = config.grids;
                _c.label = 11;
            case 11:
                if (!(_i < _b.length)) return [3 /*break*/, 20];
                grid = _b[_i];
                _c.label = 12;
            case 12:
                _c.trys.push([12, 14, , 19]);
                // @ts-ignore
                return [4 /*yield*/, placeOrder(parseFloat(grid) > price ? 'SELL' : 'BUY', grid.toString(), decimal_js_1.default.div(config.amountPerGrid, grid).toNumber().toFixed(config.precisionAmount), config.pair)];
            case 13:
                // @ts-ignore
                _c.sent();
                return [3 /*break*/, 19];
            case 14:
                e_2 = _c.sent();
                console.log(e_2);
                console.log('Failed to place all orders. Bot will cancel all orders it made');
                return [4 /*yield*/, sendTelegram(botName + ' failed to place all orders and will cancel already created orders')];
            case 15:
                _c.sent();
                return [4 /*yield*/, cancelAllOrders()];
            case 16:
                _c.sent();
                console.log('All orders canceled. Bot will enter status stopped');
                return [4 /*yield*/, sendTelegram(botName + ' canceled all orders')];
            case 17:
                _c.sent();
                return [4 /*yield*/, changeBotStatus(BotStatus.Stopped)];
            case 18:
                _c.sent();
                return [3 /*break*/, 19];
            case 19:
                _i++;
                return [3 /*break*/, 11];
            case 20: return [4 /*yield*/, checkOrders()];
            case 21:
                _c.sent();
                _c.label = 22;
            case 22: return [3 /*break*/, 25];
            case 23:
                e_3 = _c.sent();
                return [4 /*yield*/, changeBotStatus(BotStatus.Crashed)];
            case 24:
                _c.sent();
                console.log('Failed on startup. Bot will enter status Crashed');
                console.log(e_3);
                return [3 /*break*/, 25];
            case 25:
                if (!(msg.action === 'stop')) return [3 /*break*/, 31];
                stop = true;
                botId = msg.id;
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + botId, { json: true })];
            case 26:
                bot = _c.sent();
                botName = bot.name;
                if (!(bot.status === 'Crashed' && bot.config && bot.config.orders)) return [3 /*break*/, 28];
                orders = bot.config.orders;
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/keys/' + bot.keys.id, { json: true })];
            case 27:
                keys = _c.sent();
                cossApi = new coss_api_service_1.CossApiService(keys.public, keys.secret);
                _c.label = 28;
            case 28: return [4 /*yield*/, checkOrders()];
            case 29:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, sendTelegram(botName + ' stopped on pair: ' + bot.config.pair)];
            case 30:
                // @ts-ignore
                _c.sent();
                _c.label = 31;
            case 31: return [2 /*return*/];
        }
    });
}); });
function sendTelegram(text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_promise_native_1.default.post('http://localhost:3000/telegramApi/telegram', { body: { msg: text, type: botId }, json: true })];
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
        var e_4, filledOrders, i, _i, filledOrders_1, filledOrder, i, index, e_5, e_6, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!stop) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 6]);
                    return [4 /*yield*/, cancelAllOrders()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, changeBotStatus(BotStatus.Stopped)];
                case 3:
                    _a.sent();
                    console.log('All orders canceled. Bot will enter status stopped');
                    return [3 /*break*/, 6];
                case 4:
                    e_4 = _a.sent();
                    return [4 /*yield*/, changeBotStatus(BotStatus.Crashed)];
                case 5:
                    _a.sent();
                    console.log('Failed to cancel all orders. Bot will enter status crashed');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
                case 7:
                    if (orders.length < 1) {
                        changeBotStatus(BotStatus.Crashed);
                        // @ts-ignore
                        process.send("No orders found");
                        process.exit(0);
                    }
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 34, , 35]);
                    return [4 /*yield*/, fetchCompletedOrders(config.pair)];
                case 9:
                    filledOrders = _a.sent();
                    i = 0;
                    _a.label = 10;
                case 10:
                    if (!(i < orders.length)) return [3 /*break*/, 15];
                    _i = 0, filledOrders_1 = filledOrders;
                    _a.label = 11;
                case 11:
                    if (!(_i < filledOrders_1.length)) return [3 /*break*/, 14];
                    filledOrder = filledOrders_1[_i];
                    if (!(orders[i].order_id === filledOrder.order_id)) return [3 /*break*/, 13];
                    orders[i] = filledOrder;
                    return [4 /*yield*/, updateOrder(orders[i])];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 11];
                case 14:
                    i++;
                    return [3 /*break*/, 10];
                case 15:
                    i = 0;
                    _a.label = 16;
                case 16:
                    if (!(i < orders.length)) return [3 /*break*/, 33];
                    if (stop) {
                        return [3 /*break*/, 33];
                    }
                    if (!(orders[i].status.toUpperCase() === 'FILLED')) return [3 /*break*/, 32];
                    return [4 /*yield*/, sendTelegram(botName + ': Filled a ' + orders[i].order_side + ' order on pair ' + orders[i].order_symbol + ' with amount ' + orders[i].order_size + ' @ ' + orders[i].order_price)];
                case 17:
                    _a.sent();
                    index = config.grids.indexOf(parseFloat(orders[i].order_price));
                    if (!(orders[i].order_side === "BUY")) return [3 /*break*/, 25];
                    index--;
                    _a.label = 18;
                case 18:
                    _a.trys.push([18, 22, , 24]);
                    // @ts-ignore
                    return [4 /*yield*/, placeOrder('SELL', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 19:
                    // @ts-ignore
                    _a.sent();
                    return [4 /*yield*/, removeOrder(orders[i])];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, saveHistory(orders[i].order_id)];
                case 21:
                    _a.sent();
                    return [3 /*break*/, 24];
                case 22:
                    e_5 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_5);
                    return [4 /*yield*/, sendTelegram('Failed to place matching order. Will retry next cycle')];
                case 23:
                    _a.sent();
                    return [3 /*break*/, 24];
                case 24: return [3 /*break*/, 32];
                case 25:
                    index++;
                    _a.label = 26;
                case 26:
                    _a.trys.push([26, 30, , 32]);
                    // @ts-ignore
                    return [4 /*yield*/, placeOrder('BUY', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 27:
                    // @ts-ignore
                    _a.sent();
                    return [4 /*yield*/, removeOrder(orders[i])];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, saveHistory(orders[i].order_id)];
                case 29:
                    _a.sent();
                    return [3 /*break*/, 32];
                case 30:
                    e_6 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_6);
                    return [4 /*yield*/, sendTelegram('Failed to place matching order. Will retry next cycle')];
                case 31:
                    _a.sent();
                    return [3 /*break*/, 32];
                case 32:
                    i++;
                    return [3 /*break*/, 16];
                case 33:
                    orders = orders.filter(function (order) {
                        return order.status.toUpperCase() !== "FILLED";
                    });
                    return [3 /*break*/, 35];
                case 34:
                    e_7 = _a.sent();
                    console.log(e_7);
                    return [3 /*break*/, 35];
                case 35: return [4 /*yield*/, checkOrders()];
                case 36:
                    _a.sent();
                    return [2 /*return*/];
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
                                return [4 /*yield*/, sendTelegram(botName + ': Placed a ' + side + ' order on pair ' + symbol + ' with amount ' + amount + ' @ ' + price)];
                            case 4:
                                _a.sent();
                                orders.push(newOrder);
                                saveOrder(newOrder);
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
                                if (!(i < 3)) return [3 /*break*/, 6];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, cossApi.cancelOrder({
                                        timestamp: Date.now(),
                                        recvWindow: 99999999,
                                        order_symbol: order.order_symbol,
                                        order_id: order.order_id
                                    })];
                            case 3:
                                canceledOrder = _a.sent();
                                if (canceledOrder && canceledOrder.order_id) {
                                    console.log('Canceled Order: ' + order.order_id);
                                    index = orders.indexOf(order);
                                    orders.splice(index, 1);
                                    resolve(true);
                                    return [3 /*break*/, 6];
                                }
                                else {
                                    if (i === 2) {
                                        reject('Unable to cancel order: ' + order.order_id + order.order_price);
                                    }
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_9 = _a.sent();
                                if (i === 2) {
                                    reject('Unable to cancel order: ' + order.order_id + order.order_price);
                                }
                                return [3 /*break*/, 5];
                            case 5:
                                i++;
                                return [3 /*break*/, 1];
                            case 6: return [2 /*return*/];
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
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendTelegram(botName + ': Will cancel all orders ...')];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, orders_1, order, e_10;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, orders_1 = orders;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < orders_1.length)) return [3 /*break*/, 8];
                                        order = orders_1[_i];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 6, , 7]);
                                        return [4 /*yield*/, cancelOrder(order)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, removeOrder(order)];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, saveHistory(order.order_id)];
                                    case 5:
                                        _a.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        e_10 = _a.sent();
                                        // @ts-ignore
                                        process.send(e_10);
                                        // @ts-ignore
                                        process.exit(0);
                                        return [3 /*break*/, 7];
                                    case 7:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 8: return [4 /*yield*/, sendTelegram(botName + ': Canceled ' + orders.length + ' orders')];
                                    case 9:
                                        _a.sent();
                                        resolve(true);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function fetchCompletedOrders(symbol) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var i, completedOrders, e_11;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 6];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, cossApi.getCompletedOrders({
                                        timestamp: Date.now(),
                                        recvWindow: 99999999,
                                        symbol: symbol,
                                        limit: 50,
                                        page: 0,
                                    })];
                            case 3:
                                completedOrders = _a.sent();
                                if (completedOrders && completedOrders.list) {
                                    resolve(completedOrders.list);
                                    return [3 /*break*/, 6];
                                }
                                else {
                                    if (i === 2) {
                                        reject('Unable to fetch completed orders');
                                    }
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_11 = _a.sent();
                                if (i === 2) {
                                    reject('Unable to fetch completed orders');
                                }
                                return [3 /*break*/, 5];
                            case 5:
                                i++;
                                return [3 /*break*/, 1];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function saveHistory(order_id) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var i, tradeDetails, _i, tradeDetails_1, tradeDetail, e_12;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 10];
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 8, , 9]);
                                return [4 /*yield*/, cossApi.getTradeDetails({
                                        timestamp: Date.now(),
                                        recvWindow: 99999999,
                                        order_id: order_id
                                    })];
                            case 3:
                                tradeDetails = _a.sent();
                                _i = 0, tradeDetails_1 = tradeDetails;
                                _a.label = 4;
                            case 4:
                                if (!(_i < tradeDetails_1.length)) return [3 /*break*/, 7];
                                tradeDetail = tradeDetails_1[_i];
                                return [4 /*yield*/, request_promise_native_1.default.post('http://localhost:3000/db/historys', {
                                        json: true,
                                        body: Object.assign({ botId: botId }, tradeDetail)
                                    })];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 4];
                            case 7:
                                resolve();
                                return [3 /*break*/, 9];
                            case 8:
                                e_12 = _a.sent();
                                console.log('Unable so get profits for order: ' + order_id);
                                resolve();
                                return [3 /*break*/, 9];
                            case 9:
                                i++;
                                return [3 /*break*/, 1];
                            case 10: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function saveOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateBotOrders()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request_promise_native_1.default.post('http://localhost:3000/db/orders', { body: Object.assign({ botId: botId }, order), json: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateBotOrders()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request_promise_native_1.default.put('http://localhost:3000/db/orders/' + order.order_id, {
                            body: Object.assign({ botId: botId }, order),
                            json: true
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateBotOrders()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request_promise_native_1.default.delete('http://localhost:3000/db/orders/' + order.order_id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateBotOrders() {
    return __awaiter(this, void 0, void 0, function () {
        var bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + botId, { json: true })];
                case 1:
                    bot = _a.sent();
                    // @ts-ignore
                    bot.config.orders = orders;
                    return [4 /*yield*/, request_promise_native_1.default.put('http://localhost:3000/db/bots/' + botId, { json: true, body: bot })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
