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

/* A order by order_id */
router.get('/:order_id', async (req, res) => {
    const order_id = req.params.order_id;

    await order.getOrder(order_id)
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
            message: `The order #${order.order_id} has been created`,
            content: order
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a order */
router.put('/:order_id', m.checkFieldsOrder, async (req, res) => {
    const order_id = req.params.order_id;

    await order.updateOrder(order_id, req.body)
        .then(order => res.json({
            message: `The order #${order_id} has been updated`,
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
router.delete('/:order_id', async (req, res) => {
    const order_id = req.params.order_id;

    await order.deleteOrder(order_id)
        .then(order => res.json({
            message: `The order #${order_id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;