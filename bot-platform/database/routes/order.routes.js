const express = require('express');
const router = express.Router();
const order = require('../models/order.model');
const m = require('../helpers/middlewares');

/* All orders */
router.get('/', async (req, res) => {
    await order.getOrders()
        .then(orders => res.json(orders))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* A order by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await order.getOrder(id)
        .then(order => res.json(order))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* Insert a new order */
router.post('/', m.checkFieldsOrder, async (req, res) => {
    await order.insertOrder(req.body)
        .then(order => res.status(201).json({
            message: `The order #${order.id} has been created`,
            content: order
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a order */
router.put('/:id', m.checkFieldsOrder, async (req, res) => {
    const id = req.params.id;

    await order.updateOrder(id, req.body)
        .then(order => res.json({
            message: `The order #${id} has been updated`,
            content: order
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

/* Delete a order */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await order.deleteOrder(id)
        .then(order => res.json({
            message: `The order #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;