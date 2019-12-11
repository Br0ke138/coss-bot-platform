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
var config;
var price;
var cossApi;
var orders = [];
var stop = false;
process.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var bot, _a, e_1, grids, closest, _i, _b, grid, e_2, e_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(msg.action === 'start')) return [3 /*break*/, 16];
                // @ts-ignore
                process.send('Bot started');
                _c.label = 1;
            case 1:
                _c.trys.push([1, 15, , 16]);
                return [4 /*yield*/, request_promise_native_1.default.get('http://localhost:3000/db/bots/' + msg.id, { json: true })];
            case 2:
                bot = _c.sent();
                // @ts-ignore
                process.send(bot);
                if (!bot.config) return [3 /*break*/, 14];
                config = bot.config;
                // @ts-ignore
                process.send(config);
                cossApi = new coss_api_service_1.CossApiService(bot.keys.public, bot.keys.secret);
                // @ts-ignore
                process.send(cossApi);
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 6]);
                // @ts-ignore
                process.send('price... ');
                _a = parseFloat;
                return [4 /*yield*/, cossApi.getMarketPrice(config.pair)];
            case 4:
                price = _a.apply(void 0, [(_c.sent())[0].price]);
                // @ts-ignore
                process.send('price: ' + price);
                return [3 /*break*/, 6];
            case 5:
                e_1 = _c.sent();
                // @ts-ignore
                process.send("Unable to fetch price");
                process.exit(0);
                return [3 /*break*/, 6];
            case 6:
                if (!config.grids) return [3 /*break*/, 14];
                grids = config.grids;
                closest = grids.reduce(function (prev, curr) { return (Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev); });
                grids.splice(grids.indexOf(closest), 1);
                _i = 0, _b = config.grids;
                _c.label = 7;
            case 7:
                if (!(_i < _b.length)) return [3 /*break*/, 12];
                grid = _b[_i];
                _c.label = 8;
            case 8:
                _c.trys.push([8, 10, , 11]);
                // @ts-ignore
                return [4 /*yield*/, placeOrder(parseFloat(grid) > price ? 'SELL' : 'BUY', grid.toString(), decimal_js_1.default.div(config.amountPerGrid, grid).toNumber().toFixed(config.precisionAmount), config.pair)];
            case 9:
                // @ts-ignore
                _c.sent();
                return [3 /*break*/, 11];
            case 10:
                e_2 = _c.sent();
                console.log(e_2);
                return [3 /*break*/, 11];
            case 11:
                _i++;
                return [3 /*break*/, 7];
            case 12: return [4 /*yield*/, checkOrders()];
            case 13:
                _c.sent();
                _c.label = 14;
            case 14: return [3 /*break*/, 16];
            case 15:
                e_3 = _c.sent();
                // @ts-ignore
                process.send('err' + e_3);
                return [3 /*break*/, 16];
            case 16:
                if (msg.action === 'stop') {
                    stop = true;
                }
                return [2 /*return*/];
        }
    });
}); });
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
                    if (!(i < orders.length)) return [3 /*break*/, 17];
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
                    if (!(fetchedOrder && fetchedOrder.order_id)) return [3 /*break*/, 15];
                    orders[i] = fetchedOrder;
                    if (!(orders[i].status.toUpperCase() === "FILLED")) return [3 /*break*/, 14];
                    console.log("Found filled order", orders[i]);
                    if (!config.grids) return [3 /*break*/, 14];
                    index = config.grids.indexOf(parseFloat(orders[i].order_price));
                    if (!(orders[i].order_side === "BUY")) return [3 /*break*/, 10];
                    index--;
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, placeOrder('SELL', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_5 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_5);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 14];
                case 10:
                    index++;
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, placeOrder('BUY', config.grids[index].toString(), decimal_js_1.default.div(config.amountPerGrid, config.grids[index]).toNumber().toFixed(config.precisionAmount), config.pair)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_6 = _a.sent();
                    orders[i].status = "PARTIAL_FILL";
                    console.log(e_6);
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 16];
                case 15:
                    console.log('Unable to get last status of order:', orders[i]);
                    _a.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 1];
                case 17:
                    if (!stop) return [3 /*break*/, 22];
                    _a.label = 18;
                case 18:
                    _a.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, cancelAllOrders()];
                case 19:
                    _a.sent();
                    process.exit(0);
                    return [3 /*break*/, 21];
                case 20:
                    e_7 = _a.sent();
                    // @ts-ignore
                    process.send({ err: 'Failed to cancel orders' });
                    return [3 /*break*/, 21];
                case 21: return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, checkOrders()];
                case 23:
                    _a.sent();
                    _a.label = 24;
                case 24: return [2 /*return*/];
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
                                if (!(i < 3)) return [3 /*break*/, 6];
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
                                _a.trys.push([2, 4, , 5]);
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
                                if (newOrder && newOrder.order_id) {
                                    console.log('Placed ' + newOrder.order_side + ' Order at ' + newOrder.order_price);
                                    orders.push(newOrder);
                                    resolve(newOrder);
                                    return [3 /*break*/, 6];
                                }
                                else {
                                    if (i === 2) {
                                        reject('Unable to place order: ' + JSON.stringify(orderToPlace));
                                    }
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_8 = _a.sent();
                                if (i === 2) {
                                    reject('Unable to place order: ' + JSON.stringify(orderToPlace));
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
                                        reject('Unable to cancel order: orderId');
                                    }
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_9 = _a.sent();
                                if (i === 2) {
                                    reject('Unable to cancel order: orderId');
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
