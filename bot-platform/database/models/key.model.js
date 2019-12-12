const helper = require('../helpers/helper.js');
const filename = process.cwd() + '/keys.json';
let keys = helper.readJSONFile(filename);

function getKeys() {
    return new Promise((resolve, reject) => {
        resolve(keys)
    })
}

function getKey(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(keys, id)
        .then(key => resolve(key))
        .catch(err => reject(err))
    })
}

function insertKey(newKey) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(keys) };
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        };
        newKey = { ...id, ...date, ...newKey };
        keys.push(newKey);
        helper.writeJSONFile(filename, keys);
        resolve(newKey)
    })
}

function updateKey(id, newKey) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(keys, id)
        .then(key => {
            const index = keys.findIndex(p => p.id === key.id);
            id = { id: key.id };
            const date = {
                createdAt: key.createdAt,
                updatedAt: helper.newDate()
            };
            keys[index] = { ...id, ...date, ...newKey };
            helper.writeJSONFile(filename, keys);
            resolve(keys[index])
        })
        .catch(err => reject(err))
    })
}

function deleteKey(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(keys, id)
        .then(() => {
            keys = keys.filter(p => p.id !== id);
            helper.writeJSONFile(filename, keys);
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertKey,
    getKeys,
    getKey,
    updateKey,
    deleteKey
};