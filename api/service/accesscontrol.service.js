var request = require('request');
const constants = require('../app-constants').APP_CONSTANTS;
var cfg = require('../config');
const errorConstants = require('../service-error-constants').ERROR_CONSTANTS;


//exports.checkforAccessControl = function (token, role, resource, action) {
function checkforAccessControl(token, role, resource, action) {
    return new Promise(function (resolve, reject) {

        request({
            headers: {
                'Authorization': token,
                'Role': role,
                'Resource': resource,
                'Action': action

            },
            uri: cfg.accesscontrol.url,
            method: 'GET'
        }, function (err, res, body) {
            if (err) {
                reject(err)
                return
            }

            if (res.statusCode == 401) {
                reject(errorConstants.UNAUTHORIZED)
                return
            }
            else
                if (res.statusCode == 403) {
                    reject(errorConstants.FORBIDDEN)
                    return
                }
            resolve(res)
        });

        /*request.get(
            cfg.notify.url + cfg.notify.otp,
            doc,
            function (err, response, body) {
                if (err)
                    reject(constants.OTPERROR);
                resolve(response)
            }
        );*/

    })

}

exports.accessControlMiddleware = function (role, service, operation) {

    return async function (req, res, next) {
        try {
            
            if (req.headers.authorization) {
                var response = await checkforAccessControl(req.headers.authorization, role, service, operation)
                if (response && response.statusCode == 200) {
                    if (response.body){
                        console.log("Auth done");
                        var res = JSON.parse(response.body);
                        req.userId = res.userId;
                        req.adminId = res._id;
                        req.role = res.role;
                        req.type = res.type;
                    }
                    next();
                }
                else
                    res.status(401).send(errorConstants.UNAUTHORIZED)
            }
            else {

                res.status(401).send(errorConstants.UNAUTHORIZED)

            }

        }
        catch (ex) {
            if (ex == "Unauthorized") {
                res.sendStatus(401);
                return;
            }
            res.sendStatus(500);
        }

    }




}


exports.getUserMiddleware = function (role, service, operation) {

    return async function (req, res, next) {


        try {

            var doc = req.body;


            if (Swagger.validateModel(constants.USERID, doc)) {

            }
            else {
                res.status(400).send(errorConstants.INVALIDPAYLOAD)
            }



        }
        catch (ex) {
            res.sendStatus(500);
        }

    }




}









