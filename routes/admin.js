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
var User = require('../models/user-model'),
	PendingUser = require('../models/pendingUser-model'),
	winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'pendinguser.log' })
	]
});
exports.getPendingAccountList = function(req, res){

	PendingUser.find(function(err,doc){
		logger.info('exports.getPendingAccountList we have accounts ');
		res.send(doc);
	});
};
