const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

mongoose.set('debug', true);


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'E-Mail is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdDate: {
        type: String,
    },
    userId: {
        type: String,
        required: [true, 'User id is required']
    }
});

UserSchema.pre('save', function preSave(next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        // set hash
        this.password = bcrypt.hashSync(this.password, salt);
    }

    const now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});

/**
 * Authenticate method to compare the passed password
 *
 * @param password
 * @param next
 */
UserSchema.methods.authenticate = function authenticate(password, next) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        next(isMatch);
    });
};

/**
 * Method to generate the json webtoken;
 *
 * @param user
 * @param next
 */
UserSchema.methods.generateToken = function generateToken(user, next) {
    const payload = {
        id: user._id,
        email: user.email,
        userId: user.userId
    };

    const options = {
        expiresIn: 10080
    };

    const token = jwt.sign(payload, config.jwt.secret, options);

    next(`JWT ${token}`);
};

module.exports = mongoose.model('user', UserSchema);
