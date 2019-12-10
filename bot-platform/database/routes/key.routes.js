const express = require('express');
const router = express.Router();
const key = require('../models/key.model');
const m = require('../helpers/middlewares');

/* All keys */
router.get('/', async (req, res) => {
    await key.getKeys()
        .then(keys => res.json(keys))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* A key by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await key.getKey(id)
        .then(key => res.json(key))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            } else {
                res.status(500).json({message: err.message})
            }
        })
});

/* Insert a new key */
router.post('/', m.checkFieldsKey, async (req, res) => {
    await key.insertKey(req.body)
        .then(key => res.status(201).json({
            message: `The key #${key.id} has been created`,
            content: key
        }))
        .catch(err => res.status(500).json({message: err.message}))
});

/* Update a key */
router.put('/:id', m.checkFieldsKey, async (req, res) => {
    const id = req.params.id;

    await key.updateKey(id, req.body)
        .then(key => res.json({
            message: `The key #${id} has been updated`,
            content: key
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

/* Delete a key */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await key.deleteKey(id)
        .then(key => res.json({
            message: `The key #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({message: err.message})
            }
            res.status(500).json({message: err.message})
        })
});

module.exports = router;