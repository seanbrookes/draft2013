/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:57 PM
 *
 */
var Player = require('../models/player-model');
var Roster = require('../models/roster-model');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'user.log' })
    ]
});
exports.updateDraftStatus = function(req,res){
  var playerId = req.param('playerId',null);
    //logger.info('playerId: ' + playerId);
    var draftStatus = req.param('draftStatus',null);
   // logger.info('draftStatus: ' + draftStatus);
    var rosterSlug = req.param('rosterSlug',null);
   // logger.info('rosterSlug: ' + rosterSlug);

    Roster.update({slug:rosterSlug, 'players._id': playerId},{$set:{ 'players.$.draftStatus' : draftStatus }},function(err){
        if(err){
            logger.error('error update player status: ' + err.message);
            return res.send(400,err.message);
        }
        retObj = {};
        retObj.playerId = playerId;
        retObj.draftStatus = draftStatus;

        return res.send(200,retObj);
    });

    //db.students.update( { _id: 1, grades: 80 }, { $set: { "grades.$" : 82 } } )

  //logger.info('REQ PARAMS: ' + JSON.stringify(req.params));
  //res.send(400);
};
exports.updatePlayerRoster = function(req,res){
    var playerId = req.param('playerId',null);
    //logger.info('playerId: ' + playerId);
    var newRoster = req.param('newRoster',null);
    // logger.info('draftStatus: ' + draftStatus);
    var rosterSlug = req.param('rosterSlug',null);
    // logger.info('rosterSlug: ' + rosterSlug);

   // logger.info('playerid: ' + playerId + '   oldRoster: ' + rosterSlug + '  newRoster: ' + newRoster);

    Roster.find({'slug':rosterSlug},function(err,doc){
        if(err){
            return res.send(500);
        }
        if(!doc){
            return res.send(400,'no doc');
        }
       // logger.info('roster: ' + doc);

        //var pDoc = JSON.parse(doc);
        var filteredPlayer;

        //logger.info('players: ' + doc[0].players);
        var x = doc[0].players;

       // logger.info('x as players array length: ' + x.length);
       // doc = JSON.parse(doc);
        //var tRoster = JSON.parse(doc);
        //logger.info('players: ' + doc);

        for (var i = 0;i < x.length;i++){
//logger.info('in check loop: ' + x[i].name);

            if (x[i]._id == playerId) {

                filteredPlayer = x[i];

               // logger.info('Player to be moved: ' + x[i]);

                break;
            }

        }
        if (filteredPlayer){

         //   Roster.

            Roster.update({slug:rosterSlug},{$pull : {'players' : {'_id': filteredPlayer._id }}},function(err){
                if(err){
                    return res.send(500);
                }
                logger.info('remove [' + filteredPlayer.name + '] from ' + rosterSlug);
                Roster.find({slug:newRoster},function(err,doc){
                    if(err){
                        logger.error('Falied to add player to new roster: ' + err.message);
                        return res.send(500,'Falied to add player to new roster: ' + err.message);
                    }
                    // add filterplayer to doc[0].players
                   // logger.info('ADD PLAYER [' + filteredPlayer.name + '] TO: ' + newRoster);
                    doc[0].players.push(new Player(filteredPlayer));
                  //  logger.info('PLAYER OBJ - ' + filteredPlayer);
                    doc[0].save(function(err){
                        if (err){
                            logger.error('error saving new player on roster: ' + err);
                            return res.send(500,'error saving new player on roster: ' + err.message);
                        }
                      //  logger.info('IT WORKED');
                        return res.send(200,doc);
                    });
                });
            });

           // logger.info('found the player: ' + filteredPlayer);
            // add this player to the target roster

            // remove player from this roster

            //return res.send(filteredPlayer);
        }
        else{
            logger.warn('no filtered player');
            return res.send(400,'NO FILTERED PLAYER');

        }

    });




    // add player to new roster
    // remove player from old roster


//    Roster.update({slug:rosterSlug, 'players._id': playerId},{$set:{ 'players.$.draftStatus' : draftStatus }},function(err){
//        if(err){
//            logger.error('error update player status: ' + err.message);
//            return res.send(400,err.message);
//        }
//        retObj = {};
//        retObj.playerId = playerId;
//        retObj.draftStatus = draftStatus;
//
//        return res.send(200,retObj);
//    });

    //db.students.update( { _id: 1, grades: 80 }, { $set: { "grades.$" : 82 } } )

    //logger.info('REQ PARAMS: ' + JSON.stringify(req.params));
    //res.send(400);
};
function compare(a,b) {

    if (a.pos < b.pos){
        return -1;
    }
    if (a.pos > b.pos){
        return 1;
    }
    return 0;
}


exports.getRoster = function(req,res){
    var rosterSlug = req.params.name;
    if (rosterSlug){
       // logger.info('GET ROSTER: ' + rosterSlug);

        // check if roster exists
        Roster.find({slug:rosterSlug}).sort({'player.pos':1}).execFind(function(err,doc){
            if (err){
                logger.error('error looking up roster: ' + err.message);
                return res.send(500,'error looking up roster: ' + err.message);
            }
            if(!doc){
                logger.warn('expecting roster doc but none returned ');
                return res.send(200,'expecting roster doc but none returned ');

            }
            doc[0].players.sort(compare);
            //logger.info('roster doc: ' + JSON.stringify(doc));
            return res.send(doc);
        });


    }
    else{
        logger.warn('no roster name supplied');
        res.send(400,'no roster name supplied');
    }
};