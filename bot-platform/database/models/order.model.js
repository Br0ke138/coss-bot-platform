let orders = require('../data/orders.json');
const filename = __dirname + '/../data/orders.json';
const helper = require('../helpers/helper.js');

function getOrders() {
    return new Promise((resolve, reject) => {
        resolve(orders)
    })
}

function getOrder(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(orders, id)
        .then(order => resolve(order))
        .catch(err => reject(err))
    })
}

function insertOrder(newOrder) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(orders) };
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        };
        newOrder = { ...id, ...date, ...newOrder };
        orders.push(newOrder);
        helper.writeJSONFile(filename, orders);
        resolve(newOrder)
    })
}

function updateOrder(id, newOrder) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(orders, id)
        .then(order => {
            const index = orders.findIndex(p => p.id === order.id);
            id = { id: order.id };
            const date = {
                createdAt: order.createdAt,
                updatedAt: helper.newDate()
            };
            orders[index] = { ...id, ...date, ...newOrder };
            helper.writeJSONFile(filename, orders);
            resolve(orders[index])
        })
        .catch(err => reject(err))
    })
}

function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(orders, id)
        .then(() => {
            orders = orders.filter(p => p.id !== id);
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