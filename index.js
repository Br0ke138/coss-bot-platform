const request = require("request-promise-native");
const CryptoJS = require('crypto-js');
const querystring = require('querystring');
const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let publicKey = '';
let privateKey = '';

askForKeys();

async function askForKeys() {
    readline.question(`Enter public key: `, async (key1) => {
        publicKey = key1;
        readline.question(`Enter private key: `, async (key2) => {
            privateKey = key2
            try {
                const serverTimeObj = await request.get('https://trade.coss.io/c/api/v1/time', {json: true});
                console.log('Server time: ' + serverTimeObj.server_time);
                const balance = await getBalance();
                if (balance.includes('html')) {
                    fs.writeFileSync(process.cwd() + '/log.txt', balance);
                    throw 'Invalid keys';
                }
                console.log('Success');
            } catch (e) {
                fs.writeFileSync(process.cwd() + '/log.txt', JSON.stringify(e));
                console.log('Error');
                console.log(e.error);
            }

            await askForKeys();
        })
    })
}

function getBalance() {
    return privateGet("https://trade.coss.io/c/api/v1/account/balances", {timestamp: Date.now() + 100000, recvWindow: 9999999999});
}

function privateGet(url, payload) {
    console.log('Request time: ' + payload.timestamp);
    const config = {
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': publicKey,
            'Signature': CryptoJS.HmacSHA256(querystring.stringify(payload), privateKey).toString(CryptoJS.enc.Hex),
            'X-Requested-With' : 'XMLHttpRequest'
        }
    };
    return request.get(url + '?' + querystring.stringify(payload), config);
}