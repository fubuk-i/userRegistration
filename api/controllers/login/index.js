const express = require('express');
const router = express.Router();
const service = require('../../service/login.service');



router.post('/login', async (req, res, next) => {

    var doc = req.body;
    try {
        res.json(await service.login(doc));
    }
    catch (err) {

        res.status(err.error.code).send(err);
    }
})
module.exports = router