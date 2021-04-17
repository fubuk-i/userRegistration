const Q = require('q');
const User = require('./user.model');

module.exports = {
    getByEmail,
    getUser,
    create,
    remove
};

function getByEmail(email) {
    const deferred = Q.defer();
    var criteria = {};
    criteria.email = email;
    User.findOne(criteria, (err, user) => {
        if (err) deferred.reject(err);

        deferred.resolve(user);
    });

    return deferred.promise;
}


function getUser(username) {
    console.log("getUser username",username);
    const deferred = Q.defer();
    var orArray = [];

    var emailQuery = {};
    emailQuery.email = username;
    console.log("emailQuery",emailQuery);
    orArray.push(emailQuery);

    /* var mobileQuery = {};
     mobileQuery.mobileNumber = username;
     orArray.push(mobileQuery);
 
     var UIDQuery = {};
     UIDQuery.UID = username;
     orArray.push(UIDQuery);*/

    var criteria = {};
    criteria.$or = orArray;
   // criteria['status'] = "ACTIVE";

    User.findOne(criteria, (err, user) => {
        if (err) deferred.reject(err);

        deferred.resolve(user);
    });

    return deferred.promise;
}

function create(email, mobileNumber, password, role, userId, type, status) {
    const deferred = Q.defer();
    let today = new Date();
    const newUser = new User({
        email,
        mobileNumber,
        password,
        role,
        today,
        userId,
        type,
        status
    });

    newUser.save((err, user) => {
        if (err)
            deferred.reject(err);

        deferred.resolve(user);
    });

    return deferred.promise;
}

function remove(id) {
    const deferred = Q.defer();
    User.remove({ _id: id }, (err, user) => {
        if (err) deferred.reject(err);

        deferred.resolve(user);
    });

    return deferred.promise;
}
