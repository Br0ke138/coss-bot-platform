const express = require('express');
const router = express.Router();
const history = require('../models/history.model');
const m = require('../helpers/middlewares');

/* All historys */
router.get('/', async (req, res) => {
    await history.getHistorys()
        .then(historys => res.json(historys))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* A history by order_id */
router.get('/:order_id', async (req, res) => {
    const order_id = req.params.order_id;

    await history.getHistory(order_id)
        .then(history => res.json(history))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* Insert a new history */
router.post('/', m.checkFieldsOrder, async (req, res) => {
    await history.insertHistory(req.body)
        .then(history => res.status(201).json({
            message: `The history #${history.order_id} has been created`,
            content: history
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a history */
router.put('/:order_id', m.checkFieldsOrder, async (req, res) => {
    const order_id = req.params.order_id;

    await history.updateHistory(order_id, req.body)
        .then(history => res.json({
            message: `The history #${order_id} has been updated`,
            content: history
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

/* Delete a history */
router.delete('/:order_id', async (req, res) => {
    const order_id = req.params.order_id;

    await history.deleteHistory(order_id)
        .then(history => res.json({
            message: `The history #${order_id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;