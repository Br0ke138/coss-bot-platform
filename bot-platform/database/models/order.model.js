const helper = require('../helpers/helper.js');
const filename = process.cwd() + '/orders.json';
let orders = helper.readJSONFile(filename);

function getOrders() {
    return new Promise((resolve, reject) => {
        resolve(orders)
    })
}

function getOrder(order_id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(orders, order_id)
        .then(order => resolve(order))
        .catch(err => reject(err))
    })
}

function insertOrder(newOrder) {
    return new Promise((resolve, reject) => {
        orders.push(newOrder);
        helper.writeJSONFile(filename, orders);
        resolve(newOrder)
    })
}

function updateOrder(order_id, newOrder) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(orders, order_id)
        .then(order => {
            const index = orders.findIndex(p => p.order_id === order.order_id);
            orders[index] = { ...newOrder };
            helper.writeJSONFile(filename, orders);
            resolve(orders[index])
        })
        .catch(err => reject(err))
    })
}

function deleteOrder(order_id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(orders, order_id)
        .then(() => {
            orders = orders.filter(p => p.order_id !== order_id);
            helper.writeJSONFile(filename, orders);
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
};