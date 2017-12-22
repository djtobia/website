var express = require('express');
var contactRouter = express.Router();
contactRouter.route('/').get(function (req, res) {
    res.render('contact');
});


module.exports = contactRouter;