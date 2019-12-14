const helper = require('../helpers/helper.js');
const filename = process.cwd() + '/historys.json';
let historys = helper.readJSONFile(filename);

function getHistorys() {
    return new Promise((resolve, reject) => {
        resolve(historys)
    })
}

function getHistory(history_id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(historys, history_id)
        .then(history => resolve(history))
        .catch(err => reject(err))
    })
}

function insertHistory(newHistory) {
    return new Promise((resolve, reject) => {
        historys.push(newHistory);
        helper.writeJSONFile(filename, historys);
        resolve(newHistory)
    })
}

function updateHistory(history_id, newHistory) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(historys, history_id)
        .then(history => {
            const index = historys.findIndex(p => p.history_id === history.history_id);
            historys[index] = { ...newHistory };
            helper.writeJSONFile(filename, historys);
            resolve(historys[index])
        })
        .catch(err => reject(err))
    })
}

function deleteHistory(history_id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayOrders(historys, history_id)
        .then(() => {
            historys = historys.filter(p => p.history_id !== history_id);
            helper.writeJSONFile(filename, historys);
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertHistory,
    getHistorys,
    getHistory,
    updateHistory,
    deleteHistory
};