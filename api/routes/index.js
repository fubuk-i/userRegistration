const routes = require('express').Router();
const registration = require('../controllers/registration');
const login = require('../controllers/login');
const user = require('../controllers/user');
const auth = require('../controllers/auth');

routes.use('/api/register', registration)
routes.use('/api/login', login)
routes.use('/api/user', user)
routes.use('/api/auth', auth)
module.exports = routes;