const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('../models/user/user.model');
const config = require('../config');

module.exports = {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: config.jwt.session }),
    setJwtStrategy
};

function setJwtStrategy() {
    const opts = {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeader(),
        secretOrKey: config.jwt.secret,
        passReqToCallback: true
    };
    const strategy = new passportJwt.Strategy(opts, (req, jwtPayload, done) => {
        const _id = jwtPayload.id;
        req['userId'] = jwtPayload.userId;
        req['_id'] = jwtPayload.id;
        req['role'] = jwtPayload.role;
        User.findOne({ _id }, (err, user) => {
            if (err) done(err, false);
            done(null, user || false);
        });
    });

    passport.use(strategy);
}
