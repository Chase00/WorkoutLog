var express = require('express');
var router = express.Router();
const sequelize = require('../db');
const Log = sequelize.import('../models/log');
const validateSession = require('../middleware/validate-session');

// /api/log/
router.get('/', (req, res) => res.send('Default endpoint.. hello')) 


// GET /api/log/ - get all logs for a user
router.get('/log', validateSession, (req, res) => {
    Log.findAll()
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500));
});


// POST /api/log/ - Create a workout log
router.post('/', validateSession, (req, res) => {
    if (!req.errors) {
        const logFromRequest = {
            description: req.body.description,
            definition: req.body.definition,
            result: req.body.result,
            owner: req.user.id,
        };

        Log.create(logFromRequest)
        .then(newLog => res.status(200).json(newLog))
        .catch(err => res.json(err))
    } else {
    res.status(500).json(req.errors);
    }
});


// GET /api/log/:id - get a log by an id for a user
router.get('/:id', validateSession, (req, res) => {
    Log.findOne({ where: { owner: req.user.id, id: req.params.id }})
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json(err));
});


// PUT /api/log/:id - update a log for a user
router.put('/:id', validateSession, (req, res) => {
    if (!req.errors) {
        Log.update(req.body, { where: { owner: req.user.id, id: req.params.id }})
            .then(log => res.status(200).json(log))
            .catch(err => res.status(500).json(err));
    } else {
        res.status(500).json(req.errors);
    }
});


// DELTE /api/log/:id - delete a log for a user
router.delete('/:id', validateSession, (req, res) => {
    if (!req.errors) {
        Log.destroy({ where: { owner: req.user.id, id: req.params.id }})
            .then(log => res.status(200).json(log))
            .catch(err => res.status(500).json(err));
    } else {
        res.status(500).json(req.errors);
    }
})

module.exports = router;