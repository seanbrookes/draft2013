/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:57 PM
 *
 */
var Player = require('../models/player-model');
var Totals = require('../models/totals-model');
var Roster = require('../models/roster-model');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'user.log' })
    ]
});
var compare = function(a,b) {
    if (a.pos < b.pos){
        return -1;
    }
    if (a.pos > b.pos){
        return 1;
    }
    return 0;
}

exports.associateMLBId = function(req, res){
  var playerId = req.param('playerId',null);
  var roster = req.param('roster',null);
  var mlbid = req.param('mlbid',null);
    logger.info('update player:' + playerId + '  roseter: '+ roster + '  mlbid: ' + mlbid);
  if (mlbid && roster && playerId){
      Roster.find({'slug':roster},function(err,doc){
          if(err){
              logger.error(err);
              return res.send(500,err);
          }
        logger.info('found roster');
          logger.info('start loop: ' + doc[0].players.length);
          for (var i = 0;i < doc[0].players.length;i++){
              var player = doc[0].players[i];
              logger.info('player: ' + player.name + '[' + player._id + '][' + playerId + ']');
              if (player._id == playerId){
                  player.mlbid = mlbid;
                  logger.info('found roster player');
                  doc[0].save(function(err){
                      if(err){
                          logger.error('error update roster mlbid: ' + playerId + ' : ' + err.message);
                          return res.send(400,err.message);
                      }
                      logger.info('saved the doc!!!!!');
                      var retObj = {};
                      retObj.playerId = playerId;
                      retObj.roster = roster;
                      retObj.mlbid = mlbid;

                      return res.send(200,retObj);

                  });
                  break;
              }

          }

      });
  }
  else{
      return res.send(400,'not enough parameters');
  }
};
exports.getAllPlayers = function(req, res){

    Roster.find(function(err,dox){
       if(err){
           logger.error(err);
           return res.send(500,err);
       }
        return res.send(dox);
    });
};
exports.updateRosterPos = function(req, res){
    var playerId = req.param('playerId',null);
    var rosterSlug = req.param('rosterSlug',null);
    //   logger.info('draftPickId: ' + draftPickId);

    var rosterPos = req.param('propertyVal',null);
    logger.info('rosterPos: ' + rosterPos);
    if (rosterPos && playerId){

        Roster.find({'slug':rosterSlug},function(err,doc){
            if(err){
                logger.error(err);
                return res.send(500,err);
            }

            for (var i = 0;i < doc[0].players.length;i++){
                var player = doc[0].players[i];
                if (player._id == playerId){
                    player.pos = rosterPos;
                    doc[0].save(function(err){
                        if(err){
                            logger.error('error update roster item: ' + playerId + ' : ' + err.message);
                            return res.send(400,err.message);
                        }
                        var retObj = {};
                        retObj.playerId = playerId;
                        retObj.rosterPos = rosterPos;


                        return res.send(200,retObj);
                    });
                    break;
                }
            }
        });


    }
    else{
        logger.error('updateRosterPos no pos supplied!!');
        return res.send(400,'updateRosterPos no pos supplied!!')

    }

};
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
exports.addRosterPlayer = function(req,res){
    // roster
    var roster = req.param('roster',null);
    // player name
    var name = req.param('name',null);
    // player team
    var team = req.param('team',null);
    // player pos
    var pos = req.param('pos',null);
    // player pos
    var draftStatus = req.param('draftStatus',null);
    // player pos
    var playerStatus = req.param('playerStatus',null);
    // player pos
    var posType = req.param('posType',null);

    var newPlayerObj = {};
    newPlayerObj.name = name;
    newPlayerObj.team = team;
    newPlayerObj.pos = pos;
    newPlayerObj.draftStatus = draftStatus;
    newPlayerObj.playerStatus = playerStatus;
    newPlayerObj.posType = posType;

    var newPlayer = new Player(newPlayerObj);

    Roster.find({'slug':roster},function(err,doc){
        if (err){
            logger.error(err);
            return res.send(500,err);
        }
        doc[0].players.push(newPlayer);
        doc[0].save(function(err){
            if (err){
                logger.error(500,err);
                return res.send(500,err);
            }
            return res.send(200,newPlayer);
        });
    });

};
exports.deletePlayer = function(req,res){
    var playerId = req.param('playerId',null);
    var roster = req.param('slug',null);
    logger.info('roster:  ' + roster);
    if (playerId && roster){
        Roster.find({'slug':roster},function(err, doc){
            if(err){
                logger.error(err);
                return res.send(500,err);
            }
            logger.info('doc: ' + doc[0]);
            var collection = doc[0].players;
            logger.info('collection: ' + collection);
            for (var i = 0;i < collection.length;i++){
                if (collection[i]._id == playerId){
                    collection.splice(i, 1);
                    break;
                }
            }
            doc[0].players = collection;
            doc[0].save(function(err){
                if(err){
                    logger.error(err);
                    return res.send(500,err);
                }
                return res.send(200,'deleted');

            });
            return res.send(200,'deleted');
        });
    }
    else{
        return res.send(400,'no player id');
    }
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
exports.initRosterTotals = function(req, res){
    // pull all the roster entries
    var roster = req.param('roster',null);
    // merge the arrays
    Roster.find({'slug':roster},function(err, doc){
        if(err){
            logger.error(err);
            return res.send(500,err);
        }
        //logger.info('doc: ' + doc[0]);
        var collection = doc[0].players;
        //logger.info('collection: ' + collection);
        for (var i = 0;i < collection.length;i++){

            collection[i].runs = 0;
            collection[i].hits = 0;
            collection[i].hr = 0;
            collection[i].rbi = 0;
            collection[i].sb = 0;
            collection[i].wins = 0;
            collection[i].losses = 0;
            collection[i].k = 0;
            collection[i].ip = 0;
            collection[i].saves = 0;
            collection[i].total = 0;
            collection[i].lastUpdate = Date.now();
        }
        //doc[0].players = collection;
        doc[0].save(function(err){
            if(err){
                logger.error(err);
                return res.send(500,err);
            }
            return res.send(200,'initialized');

        });
        //return res.send(200,'deleted');
    });
    // update them all to 0

};
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
exports.addRosterTotals = function(req,res){
  // takes an array of total objects to add to totals collection
    var roster = req.body.roster;
    var total = req.param('total',null);
    var battersTotal = req.param('battersTotal',null);
    var startersTotal = req.param('startersTotal',null);
    var closersTotal = req.param('closersTotal',null);
    if (total === 'NaN'){
        total = 0;
    }
    if (battersTotal === 'NaN'){
        battersTotal = 0;
    }
    if (startersTotal === 'NaN'){
        startersTotal = 0;
    }
    if (closersTotal === 'NaN'){
        closersTotal = 0;
    }


    var totalsObj = new Totals({
        roster:roster,
        total:total,
        battersTotal:battersTotal,
        startersTotal:startersTotal,
        closersTotal:closersTotal
    });

    Totals.findOne({roster:roster}).sort({date:-1}).execFind(function(err, totals){

        if (err){
            logger.error('exception looking up latest totals: ' + err);
            return res.send(500,'exception looking up latest totals: ' + err);
        }
        var sourceDoc = totals[0];
        if(!sourceDoc){
            totalsObj.save(function(err){
                if (err){
                    logger.error('exception saving roster totals: ' + err);
                    return res.send(500,'exception saving roster totals: ' + err);
                }
                return res.send({lastUpdate:sourceDoc.date,message:'totals are updated'});

            });
        }
        // compare totals to make sure an update is warranted

        if ((totalsObj.battersTotal == sourceDoc.battersTotal) && (totalsObj.startersTotal == sourceDoc.startersTotal) && (totalsObj.closersTotal == sourceDoc.closersTotal)){
            logger.info('totals do not need updating');
            return res.send({lastUpdate:sourceDoc.date,message:'no update necessary - totals are current'});


        }
        else{
            totalsObj.save(function(err){
                if (err){
                    logger.error('exception saving roster totals: ' + err);
                    return res.send(500,'exception saving roster totals: ' + err);
                }

                return res.send({lastUpdate:sourceDoc.date,message:'totals are updated'});
            });
        }
    });

};