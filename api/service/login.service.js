const dao = require('../daos/index');
const winston = require('../config/winston');
const UserDa = require('../models/user/user.da');
const utils = require('./utils');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user/user.model');
//const constants = require('../app-constants').APP_CONSTANTS;
const errorConstants = require('../service-error-constants').ERROR_CONSTANTS;
const ObjectID = require('mongodb').ObjectID;


exports.login = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc && doc.email && doc.password) {
                UserDa.getUser(doc.email)
                .then((user) => { user.authenticate(doc.password, async (isMatch) => {
                    if (!isMatch) {
                        winston.error("Password not matched");
                        reject(utils.createErrorResponse(422, errorConstants.OLDPASSWORDISWRONG));
                        return;
                    }
                    var empcriteria = {};
                    empcriteria['email'] = doc['email'];
                    var employee = await dao.checkIfExists(empcriteria, "employeeData");
                    employee = employee._doc;
                    if (!employee) {
                        winston.error("Resource not found");
                        reject(utils.createErrorResponse(404, errorConstants.RESOURCENOTFOUND));
                        return;
                    }
                    user.generateToken(user, (token) => {
                        var response = {"accessToken": token,
                        "userId": user._id,
                        "email": user.email,
                        "firstName": employee.firstName,
                        "lastName": employee.lastName,
                        'employeeId': employee.employeeId
                    };
                    resolve(utils.createResponse('user', response, "SUCCESS", "200", null));
                        });
                
            });
        }).catch((err) => {
                    winston.error('signup ' + err);
                    reject(utils.createErrorResponse(500, "Invalid username"));
                });
                
                }
            else {
                winston.error("invalid payload");
                reject(utils.createErrorResponse(400, "errorConstants.INVALIDPAYLOAD"));
                return;
            }
        }
        catch (ex) {
            winston.error('signup ' + ex + ' input' + doc);
            reject(utils.createErrorResponse(500, "errorConstants.INTERNALSERVERERROR"));
        }

    });
}