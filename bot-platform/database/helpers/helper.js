const fs = require('fs');
const uuid = require('uuid');

const getNewId = (array) => {
    return uuid.v4();
};

const newDate = () => new Date().toString();

function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id === id);
        if (!row) {
            reject({
                message: 'ID is not good',
                status: 404
            })
        }
        resolve(row)
    })
}

function mustBeInArrayOrders(array, order_id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.order_id === order_id);
        if (!row) {
            reject({
                message: 'ID is not good',
                status: 404
            })
        }
        resolve(row)
    })
}

function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

function readJSONFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename));
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('Bot will create ' + filename + '.json to store data');
            writeJSONFile(filename, []);
        } else {
            console.log(e);
            console.log('It seems an error occured. Its not guaranteed that the bot works!');
        }
        return [];
    }

}

module.exports = {
    getNewId,
    newDate,
    mustBeInArray,
    mustBeInArrayOrders,
    writeJSONFile,
    readJSONFile
};