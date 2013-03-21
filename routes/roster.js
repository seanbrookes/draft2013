/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:57 PM
 *
 */
var Roster = require('../models/roster-model');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'user.log' })
    ]
});
exports.getRoster = function(req,res){
    var rosterSlug = req.params.name;
    if (rosterSlug){
        logger.info('GET ROSTER: ' + rosterSlug);

        // check if roster exists
        Roster.find({slug:rosterSlug},function(err,doc){
            if (err){
                logger.error('error looking up roster: ' + err.message);
                return res.send(500,'error looking up roster: ' + err.message);
            }
            if(!doc){
                logger.warn('expecting roster doc but none returned ');
                return res.send(200,'expecting roster doc but none returned ');

            }
            logger.info('roster doc: ' + JSON.stringify(doc));
            return res.send(doc);
        });


    }
    else{
        logger.warn('no roster name supplied');
        res.send(400,'no roster name supplied');
    }
}