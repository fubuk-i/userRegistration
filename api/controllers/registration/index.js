const express = require('express');
const router = express.Router();
const service = require('../../service/registration.service');

router.post('/signup', async (req, res, next) => {

    var doc = req.body;
    try {
        res.json(await service.signup(doc));
    }
    catch (err) {

        res.status(err.error.code).send(err);
    }
})

module.exports = router