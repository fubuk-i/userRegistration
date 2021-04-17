
const constants = require('../app-constants').APP_CONSTANTS;
const errorConstants = require('../service-error-constants').ERROR_CONSTANTS;

const dao = require('../daos/');


const utils = require('../service/utils');



exports.candidateMiddleware = function () {

    return async function (req, res, next) {
        var doc = req.body;
        var candidateIdDoc = {}
        if (doc.id == null)
            doc = req.query;
        if (doc.id == null)
            doc.id = req.userId;
        candidateIdDoc._id = doc.id;
        if (candidateIdDoc) {
            if (candidateIdDoc._id) {
                var user;
                console.log(req);
                        user = await dao.checkIfExists(candidateIdDoc, 'employeeData');
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    var err = utils.createErrorResponse(404, errorConstants.USER_NOT_FOUND);
                    res.status(err.error.code).send(err);
                }

            }
            else {
                var err = utils.createErrorResponse(400, errorConstants.INVALIDPAYLOAD);
                res.status(err.error.code).send(err);
            }

        }
        else {
            var err = utils.createErrorResponse(400, errorConstants.INVALIDPAYLOAD);
            res.status(err.error.code).send(err);
        }




    }


}














