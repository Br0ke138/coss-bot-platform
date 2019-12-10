const express = require('express');
const router = express.Router();
const bot = require('../models/bot.model');
const m = require('../helpers/middlewares');

/* All bots */
router.get('/', async (req, res) => {
    await bot.getBots()
        .then(bots => res.json(bots))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* A bot by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await bot.getBot(id)
        .then(bot => res.json(bot))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* Insert a new bot */
router.post('/', m.checkFieldsBot, async (req, res) => {
    await bot.insertBot(req.body)
        .then(bot => res.status(201).json({
            message: `The bot #${bot.id} has been created`,
            content: bot
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a bot */
router.put('/:id', m.checkFieldsBot, async (req, res) => {
    const id = req.params.id;

    await bot.updateBot(id, req.body)
        .then(bot => res.json({
            message: `The bot #${id} has been updated`,
            content: bot
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

/* Delete a bot */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await bot.deleteBot(id)
        .then(bot => res.json({
            message: `The bot #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;