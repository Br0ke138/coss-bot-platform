const helper = require('../helpers/helper.js');
const filename = process.cwd() + '/telegrams.json';
let telegrams = helper.readJSONFile(filename);

function getTelegrams() {
    return new Promise((resolve, reject) => {
        resolve(telegrams)
    })
}

function getTelegram(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(telegrams, id)
        .then(telegram => resolve(telegram))
        .catch(err => reject(err))
    })
}

function insertTelegram(newTelegram) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(telegrams) };
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        };
        newTelegram = { ...id, ...date, ...newTelegram };
        telegrams.push(newTelegram);
        helper.writeJSONFile(filename, telegrams);
        resolve(newTelegram)
    })
}

function updateTelegram(id, newTelegram) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(telegrams, id)
        .then(telegram => {
            const index = telegrams.findIndex(p => p.id === telegram.id);
            id = { id: telegram.id };
            const date = {
                createdAt: telegram.createdAt,
                updatedAt: helper.newDate()
            };
            telegrams[index] = { ...id, ...date, ...newTelegram };
            helper.writeJSONFile(filename, telegrams);
            resolve(telegrams[index])
        })
        .catch(err => reject(err))
    })
}

function deleteTelegram(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(telegrams, id)
        .then(() => {
            telegrams = telegrams.filter(p => p.id !== id);
            helper.writeJSONFile(filename, telegrams);
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertTelegram,
    getTelegrams,
    getTelegram,
    updateTelegram,
    deleteTelegram
};