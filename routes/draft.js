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
var ChatMessage = require('../models/chatmessage-model');
var Roster = require('../models/roster-model');
var Player = require('../models/player-model');

var winston = require('winston');
var url = require('url');
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
exports.postPickToRoster = function(req,res){
    var draftPickId = req.param('draftPickId',null);
    //logger.info('draftPickId: ' + draftPickId);
    var draftPickRoster = req.param('rosterSlug',null);
    logger.info('postPickToRoster: ' + draftPickId + ':' + draftPickRoster);




    // find the pick in the draft list
    Draft.findOne({'year':2013},function(err,doc){
        if (err){
           logger.error(err);
           return res.send(500,err);
        }
        logger.info('| found target draft picks :' + doc.picks);
        var draftPicks = doc.picks;
        var targetPick;
        for (var i = 0;i < draftPicks.length;i++){
            var pick = draftPicks[i];
            logger.info('|  looping through draft picks ');
            if (pick._id == draftPickId){
                logger.info('|  identified draft pick');
                targetPick = pick;
                break;
            }
        }
        if (targetPick){
            var targetRosterPlayerObj = {};
            targetRosterPlayerObj.name = targetPick.name;
            targetRosterPlayerObj.pos = targetPick.pos;
            targetRosterPlayerObj.team = targetPick.team;
            targetRosterPlayerObj.draftStatus = 'protected';
            targetRosterPlayerObj.playerStatus = 'regular';
            targetRosterPlayerObj.posType = 'A';

            Roster.findOne({'slug':draftPickRoster},function(err,doc){
                if(err){
                   logger.error(err);
                   return res.send(500);
                }
                logger.info('|  found target roster');
                var playersArray = doc.players;
                var newPlayer = new Player(targetRosterPlayerObj);
                playersArray.push(newPlayer);
                doc.save(function(err){
                    logger.info('|  Save target roster');
                    if(err){
                        logger.error(err);
                        return res.send(500,err);
                    }

                    res.send(200,doc);
                });

            });

        }
    });
    // get the relvant properties
    // create new player model
    // get roster
    // add new player
    // save roster


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
        //logger.info('we have a draft: ' + JSON.stringify(doc));


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
exports.updateDraftPickRoster = function(req, res){
    var draftPickId = req.param('draftPickId',null);
    //logger.info('draftPickId: ' + draftPickId);
    var draftPickRoster = req.param('propertyVal',null);
    //logger.info('draftPickRoster: ' + draftPickRoster);
    if (draftPickRoster && draftPickId){

       // var queryObj = {'draftpicks._id': draftPickId};
      //  logger.info('query: ' + JSON.stringify(queryObj));

        Draft.update({'year':2013,'picks._id': draftPickId},{$set:{ 'picks.$.roster' : draftPickRoster }},function(err){
            if(err){
                logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
                return res.send(400,err.message);
            }
            var retObj = {};
            retObj.draftPickId = draftPickId;
            retObj.draftPickRoster = draftPickRoster;

            return res.send(200,retObj);
        });
    }
    else{
        logger.error('updateDraftPickRoster no roster supplied!!');
        return res.send(400,'updateDraftPickRoster no roster supplied!!')
    }
};
exports.updateDraftPickName = function(req, res){
    var draftPickId = req.param('draftPickId',null);
   // logger.info('draftPickId: ' + draftPickId);

    var draftPickPlayerName = req.param('propertyVal',null);
  //  logger.info('draftPickPlayerName: ' + draftPickPlayerName);
    if (draftPickPlayerName && draftPickId){


        Draft.find({'year':2013},function(err,doc){
            if(err){
                logger.error(err);
                return res.send(500,err);
            }
            //var docItem = doc[0];
            for (var i = 0;i < doc[0].picks.length;i++){
                var pick = doc[0].picks[i];
                if (pick._id == draftPickId){
                    pick.name = draftPickPlayerName;
                    doc[0].save(function(err){
                        if(err){
                            logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
                            return res.send(400,err.message);
                        }
                        var retObj = {};
                        retObj.draftPickId = draftPickId;
                        retObj.draftPickName = draftPickPlayerName;


                        return res.send(200,retObj);
                    });
                    break;
                }
            }
        });



















//        Draft.update({'year':2013, 'draftpick._id': draftPickId},{$set:{ 'picks.$.name' : draftPickPlayerName }},function(err){
//            if(err){
//                logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
//                return res.send(400,err.message);
//            }
//            var retObj = {};
//            retObj.draftPickId = draftPickId;
//            retObj.draftPickPlayerName = draftPickPlayerName;
//
//
//            return res.send(200,retObj);
//        });
    }
    else{
        logger.error('updateDraftPickName no name supplied!!');
        return res.send(400,'updateDraftPickName no name supplied!!')
    }

};
exports.updateDraftPickPos = function(req, res){
    var draftPickId = req.param('draftPickId',null);
 //   logger.info('draftPickId: ' + draftPickId);

    var draftPickPos = req.param('propertyVal',null);
    logger.info('draftPickPos: ' + draftPickPos);
    if (draftPickPos && draftPickId){

        Draft.find({'year':2013},function(err,doc){
           if(err){
               logger.error(err);
               return res.send(500,err);
           }
           //var docItem = doc[0];
           for (var i = 0;i < doc[0].picks.length;i++){
               var pick = doc[0].picks[i];
               if (pick._id == draftPickId){
                   pick.pos = draftPickPos;
                   doc[0].save(function(err){
                       if(err){
                           logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
                           return res.send(400,err.message);
                       }
                       var retObj = {};
                       retObj.draftPickId = draftPickId;
                       retObj.draftPickPos = draftPickPos;


                       return res.send(200,retObj);
                   });
                   break;
               }
           }
        });


    }
    else{
        logger.error('updateDraftPickPos no pos supplied!!');
        return res.send(400,'updateDraftPickPos no pos supplied!!')

    }

};
exports.updateDraftPickTeam = function(req, res){
    var draftPickId = req.param('draftPickId',null);
 //   logger.info('draftPickId: ' + draftPickId);

    var draftPickTeam = req.param('propertyVal',null);
    logger.info('draftPickTeam: ' + draftPickTeam);
    if (draftPickTeam && draftPickId){


        Draft.find({'year':2013},function(err,doc){
            if(err){
                logger.error(err);
                return res.send(500,err);
            }
            //var docItem = doc[0];
            for (var i = 0;i < doc[0].picks.length;i++){
                var pick = doc[0].picks[i];
                if (pick._id == draftPickId){
                    pick.team = draftPickTeam;
                    doc[0].save(function(err){
                        if(err){
                            logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
                            return res.send(400,err.message);
                        }
                        var retObj = {};
                        retObj.draftPickId = draftPickId;
                        retObj.draftPickTeam = draftPickTeam;


                        return res.send(200,retObj);
                    });
                    break;
                }
            }
        });


























        Draft.update({'year':2013, 'draftpick._id': draftPickId},{$set:{ 'picks.$.team' : draftPickTeam }},function(err){
            if(err){
                logger.error('error update draft pick: ' + draftPickId + ' : ' + err.message);
                return res.send(400,err.message);
            }
            var retObj = {};
            retObj.draftPickId = draftPickId;
            retObj.draftPickTeam = draftPickTeam;


            return res.send(200,retObj);
        });
    }
    else{
        logger.error('updateDraftPickTeam no team supplied!!');
        return res.send(400,'updateDraftPickTeam no team supplied!!')

    }


};
exports.updateDraftPick = function(req,res){
    var draftPickId = req.param('draftPickId',null);
  //  logger.info('draftPickId: ' + draftPickId);
    var draftPickNumber = req.param('draftPickNumber',null);
  //  logger.info('draftPickNumber: ' + draftPickNumber);
    var draftPickRound = req.param('draftPickRound',null);
//    logger.info('draftPickRound: ' + draftPickRound);
    var draftPickRoster = req.param('draftPickRoster',null);
 //   logger.info('draftPickRoster: ' + draftPickRoster);
    var draftPickPlayerName = req.param('draftPickPlayerName',null);
//    logger.info('draftPickPlayerName: ' + draftPickPlayerName);
    var draftPickPos = req.param('draftPickPos',null);
//    logger.info('draftPickPos: ' + draftPickPos);
    var draftPickTeam = req.param('draftPickTeam',null);
//    logger.info('draftPickTeam: ' + draftPickTeam);
    var draftPickTime = req.param('draftPickTime',null);
   // logger.info('draftPickTime: ' + draftPickTime);

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

    Draft.update({'year':2013, 'draftpick._id': draftPickId},{$set:{ 'draftpicks.$' : updateDraftPickModel }},function(err){
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
  //  logger.info('GET Draft Model ');

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
       // logger.info('draft doc: ' + JSON.stringify(doc));
        return res.send(doc);
    });

};
