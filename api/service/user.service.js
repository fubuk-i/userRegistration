const dao = require('../daos/index');
const winston = require('../config/winston');
const utils = require('./utils');
const bcrypt = require('bcrypt-nodejs');
const constants = require('../app-constants').APP_CONSTANTS;
const errorConstants = require('../service-error-constants').ERROR_CONSTANTS;
const ObjectID = require('mongodb').ObjectID;



exports.getUser = function (doc, user,options) {
    return new Promise(async function (resolve, reject) {
        /* */
        try {
            if (doc && user) {
                var criteria = {};
                var id = user.id;
                user = user._doc;
                var criteria = {};
                //criteria['_id'] = new ObjectID(id);
                if (doc['firstName'] && doc['firstName'] != null && doc['firstName'] != "")
                {
                criteria["firstName"] = doc['firstName'];
                }
                else if (doc['lastName'] && doc['lastName'] != null && doc['lastName'] != "")
                {
                criteria["lastName"] = doc['lastName'];
                }
                else if (doc['employeeID'] && doc['employeeID'] != null && doc['employeeID'] != "")
                {
                criteria["employeeId"] = doc['employeeID'];
                }
                var sort = {};
                if(doc.sortBy){
                    
                    if(doc.orderBy){
                    sort[doc.sortBy]   = doc.orderBy === 'desc' ? -1 : 1
                } 
                else{
                sort[doc.sortBy]   = 1;
                }
                }else{
                    sort['firstName']   = 1;
                }
                var arr = [];

                var match = { "$match": criteria }
                arr.push(match);

                

                var facet = {
                    $facet: {
                        users: [
                            {$sort: sort},
                            { $skip: options.skip },
                            { $limit: options.limit }
                        ]
                    }
                }

                arr.push(facet);
                var newUser = await dao.findAggregate("employeeData", arr);
                if (newUser) {
                    resolve(utils.createResponse('user', newUser, constants.SUCCESS, null, null))
                }
                else {
                    reject(utils.createErrorResponse(204, errorConstants.RESOURCENOTFOUND));
                }
            }
            else {
                winston.error("Invalid Payload");
                reject(utils.createErrorResponse(400, errorConstants.INVALIDPAYLOAD));
                return;
            }
        }
        catch (err) {
            winston.error(err);
            console.log("err:",err);
            reject(utils.createErrorResponse(500, errorConstants.INTERNALSERVERERROR));
        }
    });
}