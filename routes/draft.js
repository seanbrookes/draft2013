/**
 * Draft 2013
 *
 * User: sean
 * Date: 23/03/13
 * Time: 7:35 PM
 *
 */
var Draft = require('../models/draft-model');
var DraftPick = require('../models/draftpick-model');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'draftpick.log' })
    ]
});
exports.createDraft = function(req,res){
    var draft = new Draft({
        year:2013
    });

//    draft.save(function(err) {
//        if (err){
//            logger.error('error creating draft: ' + err.message);
//            return res.send(400,err.message);
//        }
//        return res.send(200);
//    });
};
exports.createDraftList = function(req,res){

    // get a list of draft picks from a config
    // or set up a loop of loops
    var bEvenRound = false;
    var currentPickNumber = 1;
    var currentRound = 1;
    var currentRoundIndex = 1;
    var currentRoster = 'mashers';
    var totalRounds = 16;
    var roundPickCount = 5;
    var roundCount = 16;
    var pickOrderArray = ['mashers','bashers','rallycaps','hooters','stallions'];
    var revPickOrderArray = ['stallions','hooters','rallycaps','bashers','mashers'];


    var draft = Draft.findOne({year:2013},function(err,doc){
        if (err){
            logger.error('error getting draft: ' + err.message);
            return res.send(400);
        }
        logger.info('we have a draft: ' + JSON.stringify(doc));


        var draftList = [];

        for (var i = 0;i < totalRounds;i++){
            // add a draft pick to the draft.pick collection

            for (var j = 0;j < 5;j++){
                if (bEvenRound){
                    currentRoster = revPickOrderArray[j];
                }
                else{
                    currentRoster = pickOrderArray[j];
                }

                var dpObj = {
                    pickNumber: currentPickNumber,
                    round: currentRound,
                    roster: currentRoster
                }
                draftList.push(dpObj);
                // var dbInstance = new DraftPick(dpObj);
                doc.picks.push(new DraftPick(dpObj));

                currentPickNumber++;

            }
            currentRound++;
            if (bEvenRound){
                bEvenRound = false;
            }
            else{
                bEvenRound = true;
            }
        }

//        doc.save(function(err){
//
//            if (err){
//                logger.error('save draft with picks error: ' + JSON.stringify(err));
//                return res.send(400,'save draft with picks error: ' + JSON.stringify(err));
//            }
//            res.send(200,'SUCCESS!!!');
//        });
    });




//        roundPickCount++;
//
//        if (roundPickCount > 5){
//            roundPickCount = 1;
//
//
//        }


    //}
//logger.info(JSON.stringify(draftList));
//    draft.save(function(err) {
//        if (err){
//            logger.error('error creating draft: ' + err.message);
//            return res.send(400,err.message);
//        }
//        return res.send(200);
//    });
};

exports.updateDraftPick = function(req,res){
    var draftPickId = req.param('draftPickId',null);
    logger.info('draftPickId: ' + draftPickId);
    var draftPickNumber = req.param('draftPickNumber',null);
    logger.info('draftPickNumber: ' + draftPickNumber);
    var draftPickRound = req.param('draftPickRound',null);
    logger.info('draftPickRound: ' + draftPickRound);
    var draftPickRoster = req.param('draftPickRoster',null);
    logger.info('draftPickRoster: ' + draftPickRoster);
    var draftPickPlayerName = req.param('draftPickPlayerName',null);
    logger.info('draftPickPlayerName: ' + draftPickPlayerName);
    var draftPickPos = req.param('draftPickPos',null);
    logger.info('draftPickPos: ' + draftPickPos);
    var draftPickTeam = req.param('draftPickTeam',null);
    logger.info('draftPickTeam: ' + draftPickTeam);
    var draftPickTime = req.param('draftPickTime',null);
    logger.info('draftPickTime: ' + draftPickTime);

    var updateDraftPickModel = new DraftPick({
        pickNumber: draftPickNumber,
        round: draftPickRound,
        roster: draftPickRoster,
        name : draftPickPlayerName,
        pos : draftPickPos,
        team: draftPickTeam,
        pickTime: draftPickTime,
        pickTimeStamp: Date.now()
    });

    Draft.update({'draftpick._id': draftPickId},{$set:{ 'players.$' : updateDraftPickModel }},function(err){
        if(err){
            logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
            return res.send(400,err.message);
        }
        var retObj = {};
        retObj.draftPickId = draftPickId;
        retObj.updateDraftPickModel = updateDraftPickModel;

        return res.send(200,retObj);
    });

};
exports.getDraftModel = function(req,res){
    logger.info('GET Draft Model ');

    // check if roster exists
    Draft.find({year:2013},function(err,doc){
        if (err){
            logger.error('error looking up draft: ' + err.message);
            return res.send(500,'error looking up draft: ' + err.message);
        }
        if(!doc){
            logger.warn('expecting draft doc but none returned ');
            return res.send(200,'expecting draft doc but none returned ');

        }
        logger.info('draft doc: ' + JSON.stringify(doc));
        return res.send(doc);
    });

};