let bots = require('../data/bots.json');
const filename = process.cwd() + '/bots.json';
const helper = require('../helpers/helper.js');

function getBots() {
    return new Promise((resolve, reject) => {
        resolve(bots)
    })
}

function getBot(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(bots, id)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    })
}

function insertBot(newBot) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(bots) };
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        };
        newBot = { ...id, ...date, ...newBot };
        bots.push(newBot);
        helper.writeJSONFile(filename, bots);
        resolve(newBot)
    })
}

function updateBot(id, newBot) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(bots, id)
        .then(bot => {
            const index = bots.findIndex(p => p.id === bot.id);
            id = { id: bot.id };
            const date = {
                createdAt: bot.createdAt,
                updatedAt: helper.newDate()
            };
            bots[index] = { ...id, ...date, ...newBot };
            helper.writeJSONFile(filename, bots);
            resolve(bots[index])
        })
        .catch(err => reject(err))
    })
}

function deleteBot(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(bots, id)
        .then(() => {
            bots = bots.filter(p => p.id !== id);
            helper.writeJSONFile(filename, bots);
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertBot,
    getBots,
    getBot,
    updateBot,
    deleteBot
};