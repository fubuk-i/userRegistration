const dao = require('../daos/index');
const winston = require('../config/winston');
const utils = require('./utils');
const bcrypt = require('bcrypt-nodejs');
//const constants = require('../app-constants').APP_CONSTANTS;
const errorConstants = require('../service-error-constants').ERROR_CONSTANTS;




exports.addTestData = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc) {
               
                    await dao.insert(doc, "products");

                    var newProduct = await dao.checkIfExists(doc, "test")
                    resolve(utils.createResponse('product', newProduct, "constants.SUCCESS", "200", null));
                }
                
            
           
            else {
                winston.error("invalid payload");
                reject(utils.createErrorResponse(400, "errorConstants.INVALIDPAYLOAD"));
                return;
            }
        }
        catch (ex) {
            winston.error('addNewProduct ' + ex + ' input' + doc);
            reject(utils.createErrorResponse(500, "errorConstants.INTERNALSERVERERROR"));
        }

    });
}
exports.signup = function (doc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (doc && doc.email && doc.employeeId) {
                var criteria = {};
            //email
                var emailCriteria = {};
                emailCriteria['email'] = doc['email'];

            //employeeId
                var empIdCriteria = {};
                empIdCriteria['employeeId'] = doc['employeeId'];

                var orQuery = [];
                orQuery.push(emailCriteria);
                orQuery.push(empIdCriteria);
                criteria['$or'] = orQuery;

                var existingRegistration = await dao.checkIfExists(criteria, 'employeeData');
                if(existingRegistration == null){
                    var register = {};
                    register['firstName'] = doc['firstName'];
                    register['lastName'] = doc['lastName'];
                    register['email'] = doc['email'];
                    register['employeeId'] = doc['employeeId'];
                    register['organizationName'] = doc['organizationName'];
                    register['createdDate'] = new Date();
                    var result = await dao.insert(register, "employeeData");

                    if(result){
                        var regUser = await dao.checkIfExists(criteria, 'employeeData');
                        var user = {};
                        if (regUser)
                            user['userId'] = regUser.id;
                        user['email'] = doc['email'];
                        const salt = bcrypt.genSaltSync(10);
                        user['password'] = bcrypt.hashSync(doc['password'], salt);
                        user['createdDate'] =  new Date();
                        var response = await dao.insert(user, 'users');
                        if(response){
                            resolve(utils.createResponse('user', response, "SUCCESS", "200", null));
                        }
                        else{
                            winston.error("Internal server error");
                            reject(utils.createErrorResponse(408, errorConstants.FAILEDTOCREATEUSER));
                            return;
                        }
                    }
                    else {
                        winston.error("Failed to create user");
                    reject(utils.createErrorResponse(408, errorConstants.FAILEDTOCREATEUSER));
                    return;
                    }
                }
                else{
                    winston.error("User already exist");
                    reject(utils.createErrorResponse(409, errorConstants.RESOURCEALREADYEXISTS));
                    return;
                }
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