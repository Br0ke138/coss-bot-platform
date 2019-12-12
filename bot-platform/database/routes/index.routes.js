const express = require('express');
const router = express.Router();

router.use('/db/orders', require('./order.routes'));
router.use('/db/bots', require('./bot.routes'));
router.use('/db/keys', require('./key.routes'));
router.use('/db/telegrams', require('./telegram.routes'));

module.exports = router;