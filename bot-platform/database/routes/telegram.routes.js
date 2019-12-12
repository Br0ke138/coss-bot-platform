const express = require('express');
const router = express.Router();
const telegram = require('../models/telegram.model');
const m = require('../helpers/middlewares');

/* All telegrams */
router.get('/', async (req, res) => {
    await telegram.getTelegrams()
        .then(telegrams => res.json(telegrams))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* A telegram by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await telegram.getTelegram(id)
        .then(telegram => res.json(telegram))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* Insert a new telegram */
router.post('/', m.checkFieldsTelegram, async (req, res) => {
    await telegram.insertTelegram(req.body)
        .then(telegram => res.status(201).json({
            message: `The telegram #${telegram.id} has been created`,
            content: telegram
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a telegram */
router.put('/:id', m.checkFieldsTelegram, async (req, res) => {
    const id = req.params.id;

    await telegram.updateTelegram(id, req.body)
        .then(telegram => res.json({
            message: `The telegram #${id} has been updated`,
            content: telegram
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

/* Delete a telegram */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await telegram.deleteTelegram(id)
        .then(telegram => res.json({
            message: `The telegram #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;