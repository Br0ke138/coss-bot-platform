// Import packages
const express = require('express');
const http = require('http');
const request = require('request');
const path = require('path');
const cors = require('cors');

const {fork} = require('child_process');
console.log("process.cwd() = " + process.cwd());
// App
const app = express();
app.use(cors());
const port = 3000;

// Database
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./database/routes/index.routes'));

const bots = [];

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

app.use('/botApi/start/:id', (req, res) => {
    const bot = bots.find(bot => {
        return bot.id === req.params.id;
    });
    if (!bot) {
        const forked = fork(`${__dirname}/Bots/Grid/index.js`);

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

        bots.push({
            id: req.params.id,
            bot: forked
        });

        forked.send({action: 'start', id: req.params.id});
        res.send('Bot started');
    } else {
        if (bot.status !== 'Running') {
            bot.bot.send({action: 'start', id: req.params.id});
            res.send('Bot started');
        } else {
            res.send('Bot already running');
        }
    }
});

app.use('/botApi/stop/:id', (req, res) => {
    const bot = bots.find(bot => {
        return bot.id === req.params.id;
    });
    if (!bot) {
        res.send('Bot not found');
    } else {
        //if (bot.status === 'Running') {
            forked.send({action: 'stop', id: req.params.id});
            res.send('Bot will cancel orders and then exit');
        //} else {
        //    res.send('Bot not running');
        //}
    }
});

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
