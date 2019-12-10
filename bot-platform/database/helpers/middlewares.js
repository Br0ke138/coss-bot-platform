function checkFieldsOrder(req, res, next) {
    const {title, content, tags} = req.body;

    if (title && content && tags) {
        next()
    } else {
        res.status(400).json({message: 'fields are not good'})
    }
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

module.exports = {
    checkFieldsOrder,
    checkFieldsBot,
    checkFieldsKey
};