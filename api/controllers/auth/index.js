const express = require('express');
const router = express.Router();

const API = '/api/auth';

const auth = require('../../config/auth');

router.get(API, (req, res) => {
   
    res.json({ version: packageJson.version });
});

router.all('*', auth.authenticate(), (req, res, next) => next());

router.get('/isauthorized', (req, res) => {
    console.log("reqid",req.userId);
    res.status(200).json({ "userId": req.userId, role: req.role, type: req.type, _id: req._id });

});
module.exports = router