/**
 * Simple Framework One
 *
 * User: sean
 * Date: 24/01/13
 * Time: 11:38 PM
 *
 * admin.js
 *
 *
 * 5107711b5fa820841a000001
 *
 * accountStatus
 *
 * adminsf1@beachair.ca - hawkeye4
 *
 */
var User = require('../models/user-model');
var winston = require('winston');
var events = require('events');
var EE = require('events').EventEmitter;

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'pendinguser.log' })
	]
});

exports.getPendingAccountList = function(req, res){
	User.find({accountStatus:'pending'},function(err,dox){
		if(err){
			logger.error(err.message);
			return res.send(400);
		}
		return res.send(dox);
	});
};
