// Import packages
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const http = require('http');
const request = require('request');
const requestPromise = require("request-promise-native");
const path = require('path');
const cors = require('cors');
const helper = require("./database/helpers/helper");
const router = express.Router();

const {fork} = require('child_process');
console.log("Bot running in folder: " + process.cwd());
// App
const app = express();
app.use(cors());
const port = 3000;

// Database
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./database/routes/index.routes'));

const bots = [];


let teleBot;
let chatId;

initTelegram();
function initTelegram() {
    const filename = process.cwd() + '/telegrams.json';
    let telegrams = helper.readJSONFile(filename);
    if (telegrams.length > 0) {
        if (!teleBot) {
            teleBot = new TelegramBot(telegrams[0].botId, {
                polling: true
            });
        }

        teleBot.on('message', (msg, match) => {
            const chatId = msg.chat.id;
            teleBot.sendMessage(chatId, chatId);
        });
        if (telegrams[0].chatId && telegrams[0].chatId !== "") {
            chatId = telegrams[0].chatId;
            sendTelegram('Bot platform successfully connected');
        }
    }
}

checkForRunningBots();
async function checkForRunningBots() {
    const filename = process.cwd() + '/bots.json';
    let bots = helper.readJSONFile(filename);

    if (bots.length > 0) {
        for (const bot of bots) {
            if (bot.status === 'Running') {
                bot.status = 'Crashed';

                try {
                    await requestPromise.put('http://localhost:3000/db/bots/' + bot.id, {json: true, body: bot});
                } catch (e) {
                    console.log(bot.name + ' was still running and should be in status crashed but failed to update status');
                }

            }
        }
    }
}

process.once("SIGTERM", function () {
    process.exit(0);
});
process.once("SIGINT", function () {
    process.exit(0);
});
process.once("exit", function () {
    bots.forEach(bot => {
        bot.bot.shutdown();
    })
});

app.use('/botApi/start/:id', async (req, res) => {
    const bot = bots.find(bot => {
        return bot.id === req.params.id;
    });
    if (!bot) {
        const forked = fork(process.cwd() + '/Bots/Grid/index.js');

        forked.on('message', (msg) => {
            console.log('Message from child', msg);
        });

        forked.onUnexpectedExit = function (code, signal) {
            console.log("Child process terminated with code: " + code);
        };
        forked.on("exit", forked.onUnexpectedExit);

        forked.shutdown = function () {
            this.removeListener("exit", this.onUnexpectedExit);
            this.kill("SIGTERM");
        };

        const bot = {
            id: req.params.id,
            bot: forked
        };
        bots.push(bot);

        forked.send({action: 'start', id: req.params.id});
        request.get('http://localhost:3000/db/bots/' + bot.id, {json: true}, (err, resp, body) => {
            body.status = 'Running';
            request.put('http://localhost:3000/db/bots/' + bot.id, {body: body, json: true}, (err, resp, body) => {
                if (err) {
                    res.status(500).json({err: true, msg: 'Failed to start bot'});
                } else {
                    res.status(200).json({err: true, msg: 'Bot started'});
                }
            });
        });

    } else {
        request.get('http://localhost:3000/db/bots/' + bot.id, {json: true}, (err, resp, body) => {
            if (body.status === 'Running') {
                res.status(400).json({err: false, msg: 'Bot already running'});
            } else {
                bot.bot.send({action: 'start', id: bot.id});

                body.status = 'Running';
                request.put('http://localhost:3000/db/bots/' + bot.id, {
                    body: body,
                    json: true
                }, (err, resp, body) => {
                    if (err) {
                        res.status(500).json({err: true, msg: 'Failed to start bot'});
                    } else {
                        res.status(200).json({err: true, msg: 'Bot started'});
                    }
                });
            }
        });
    }
});

app.use('/botApi/stop/:id', (req, res) => {
    const bot = bots.find(bot => {
        return bot.id === req.params.id;
    });
    if (!bot) {
        const forked = fork(process.cwd() + '/Bots/Grid/index.js');

        forked.on('message', (msg) => {
            console.log('Message from child', msg);
        });

        forked.onUnexpectedExit = function (code, signal) {
            console.log("Child process terminated with code: " + code);
        };
        forked.on("exit", forked.onUnexpectedExit);

        forked.shutdown = function () {
            this.removeListener("exit", this.onUnexpectedExit);
            this.kill("SIGTERM");
        };

        const bot = {
            id: req.params.id,
            bot: forked
        };
        bots.push(bot);

        forked.send({action: 'stop', id: req.params.id});
        res.send({msg: 'Bot will cancel orders and then exit'});
    } else {
        bot.bot.send({action: 'stop', id: req.params.id});
        res.send({msg: 'Bot will cancel orders and then exit'});
    }
});

function sendTelegram(text) {
    console.log(text);
    if (teleBot && chatId) {
        teleBot.sendMessage(chatId, text);
    }
}

router.post('/telegramApi/telegram', (req, res) => {
    sendTelegram(req.body.msg);
    res.json({success: true});
});

router.get('/telegramApi/initTelegram', (req, res) => {
    initTelegram();
    res.json({success: true});
});

app.use(router);

// Public api (Because of cors)
app.use('/api/:route', (req, res) => {
    var url = '';

    switch (req.params.route) {
        case 'trade':
            url += 'https://trade.coss.io/c/api/v1';
            break;
        case 'exchange':
            url += 'https://exchange.coss.io/api';
            break;
        case 'engine':
            url += 'https://engine.coss.io/api/v1';
            break;
    }
    url += req.url;

    request(url, {json: true}, (err, resp, body) => {
        res.header('Access-Control-Allow-Origin', '*');
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).send(body);
        }
    });
});

// Frontend
app.use(express.static(__dirname + '/frontend'));
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Start server
const server = http.createServer(app);
server.listen(port, () => {
    console.log('App listening on port ', port);
});
