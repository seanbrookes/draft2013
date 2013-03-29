/**
 * Draft 2013
 *
 * User: sean
 * Date: 29/03/13
 * Time: 9:33 AM
 *
 */


var ChatMessage = require('../models/chatmessage-model');
var winston = require('winston');
var url = require('url');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'draftpick.log' })
    ]
});
exports.getDraftTranscript = function(req,res){
    var queryData = url.parse(req.url, true).query;
    logger.info('|');
    logger.info('| chat transcript');
    logger.info('|');
    if ((queryData.chatDirection) && (queryData.chatDirection === 'newest-at-top')){
        var sortDirection = queryData.chatDirection;
        logger.info('|');
        logger.info('| NEWEST AT TOP');
        logger.info('|');

        //logger.info('chat transcript sortDirection: ' + sortDirection);
        // sort direction
        // of this extends by one more it should be

        ChatMessage.find().sort('-messageTimeStamp').execFind(function(err,dox){
            if (err){
                logger.error('exception getting chat trascript: ' + err.message);
                return res.send(500,'exception getting chat trascript: ' + err.message);
            }
            res.send(dox);
        });


    }
    else{
        logger.info('|');
        logger.info('| NEWEST AT BOTTOM');
        logger.info('|');

        ChatMessage.find(function(err,dox){
            if (err){
                logger.error('exception getting chat trascript: ' + err.message);
                return res.send(500,'exception getting chat trascript: ' + err.message);
            }
            res.send(dox);
        });
    }



};