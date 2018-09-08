/**
 * Created by Dylan on 9/8/2018.
 */
var express = require('express');
var extrasRouter = express.Router();

extrasRouter.route('/').get(function (req, res) {
    res.render('extras');
});


module.exports = extrasRouter;