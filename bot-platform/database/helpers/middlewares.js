function checkFieldsOrder(req, res, next) {
    next()
}

function checkFieldsBot(req, res, next) {
    const {name, type} = req.body;

    if (name && type) {
        next()
    } else {
        res.status(400).json({message: 'fields are not good'})
    }
}

function checkFieldsKey(req, res, next) {
    const {name, public, secret} = req.body;

    if (name && public && secret) {
        next()
    } else {
        res.status(400).json({message: 'fields are not good'})
    }
}

function checkFieldsTelegram(req, res, next) {
    const {botId, chatId} = req.body;
    next()
}

module.exports = {
    checkFieldsOrder,
    checkFieldsBot,
    checkFieldsKey,
    checkFieldsTelegram
};