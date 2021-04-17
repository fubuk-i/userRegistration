const express = require('express');
const router = express.Router();
const service = require('../../service/user.service');
const candidateMiddleware = require('../../middleware/candidate.middleware');
const authService = require('../../service/accesscontrol.service');
const constants = require('../../app-constants').APP_CONSTANTS;

router.get('/getUser', authService.accessControlMiddleware(constants.USER, 'candidate', constants.POST), candidateMiddleware.candidateMiddleware(), async (req, res, next) => {
    var doc = req.query;
    var user = req.user;
    var page = doc.page ? doc.page : 1;
    try {
        var options = { skip: '', limit: '' };
        if (page && page != 'null' && page != '') {
            var recordsPerPage = 10;
            if (doc.recordsPerPage && doc.recordsPerPage != 'null' && doc.recordsPerPage != '')
                {
                recordsPerPage = parseInt(doc.recordsPerPage);
        }
            options.skip = page ? page * recordsPerPage - recordsPerPage : 0;
            options.limit = recordsPerPage;
        }
        var response = await service.getUser(doc, user, options);
        res.json(response);
    }
    catch (err) {
        console.log("err in con",err)
        res.status(err.error.code).send(err);
    }
})


module.exports = router