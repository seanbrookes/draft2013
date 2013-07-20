/**
 * Draft 2013
 *
 * User: sean
 * Date: 01/04/13
 * Time: 9:16 AM
 *
 *
 * http://content.usatoday.com/sportsdata/baseball/mlb/statistics
 */
var BatterStat = require('../models/batterstats-model');
var PitcherStat = require('../models/pitcherstats-model');
var Roster = require('../models/roster-model');
var winston = require('winston');
var Totals = require('../models/totals-model');

var jsdom = require('jsdom')
    , request = require('request')
    , url = require('url');
var events = require('events');
var EE = require('events').EventEmitter;
var EventBus = new EE();
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
       // new (winston.transports.File)({ filename: './logs/stats.log' })
    ]
});
var rosterArray = ['hooters','stallions','bashers','rallycaps','mashers'];
var batters = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=900";
var pitchers = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='asc'&sort_column='era'&stat_type=pitching&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&position='1'&recSP=1&recPP=900";

var currentRawPitcherStats = [];
var currentRawBatterStats = [];
var currentRosterModel;
var fetchStatsAgentActive = false;
var fetchStatsTimer;



exports.getLatestStats = function(req, res){
    PitcherStat.find({},function(err,dox){
       if(err){
           return res.send(500,'error getting latest stats: ' + err.message);
       }
        return res.send(dox);
    });
};
function processBatterStats(roster, statData){
    var stats = statData;
    var slug = roster;

    BatterStat.find({player_id:stats.mlbid},function(err,dox){
        if(err){
            logger.error('error looking up latest pitcher stats: ' + err);
        }

//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('| found BatterStat with mlbid: ' + stats.mlbid + ':' + stats.name);
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('|  this means we found the matching mlbid record in the stats collection for player: ' + stats.name);
//        logger.info('|-------------------------------------------');
//        logger.info('|  length of current stat records: ' + dox.length);
//        logger.info('|-------------------------------------------');
//        logger.info('|');
//        logger.info('|');
//        //logger.info('|' + dox[0]);
//        logger.info('|');
//        logger.info('|');
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('- end found BatterStat with mlbid');
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
        // assume the first document is the latest
        // - this is important so pay attention to the sort
        if (dox[0]){
            var latestStatRecord = dox[0];
            stats.runs = latestStatRecord.r;
            stats.hits = latestStatRecord.h;
            stats.hr = latestStatRecord.hr;
            stats.rbi = latestStatRecord.rbi;
            stats.sb = latestStatRecord.sb;
            stats.lastUpdate = Date.now();

//            logger.info('|------------------------');
//            logger.info('- set player stats: ' + stats.name);
//            logger.info('|currentPlayer.hits: ' + stats.hits);
//            logger.info('|currentPlayer.hr: ' + stats.hr);
//            logger.info('|currentPlayer.rbi: ' + stats.rbi);
//            logger.info('|currentPlayer.sb: ' + stats.sb);
//            logger.info('|currentPlayer.saves: ' + stats.saves);
//            logger.info('|------------------------');

            Roster.update(
                {slug:slug,'players.mlbid':stats.mlbid},
                {$set:{'players.$.hits':stats.hits,
                    'players.$.hr':stats.hr,
                    'players.$.k':stats.k,
                    'players.$.rbi':stats.rbi,
                    'players.$.sb':stats.sb,
                    'players.$.lastUpdate':Date.now()
                }
                },
                function(err){
                    if(err){
                        logger.error('error updating roster: ' + err);
                        return res.send(500,'error updating stats: ' + err);
                    }
//                    logger.info('|  --------------------------------------------');
//                    logger.info('|  -');
//                    logger.info('|  ');
//                    logger.info('|  ');
//                    logger.info('|  processBatterStats success: ' + stats.name);
//                    logger.info('|  ');
//                    logger.info('|  ');
//                    logger.info('|  -');
//                    logger.info('|  --------------------------------------------');
                }
            );
            // logger.info('|-cur length : ' + currRosterPlayersLength);


        }



    });
}
function processPitcherStats(roster, statData){
    var stats = statData;
    var slug = roster;

    PitcherStat.find({player_id:stats.mlbid},function(err,dox){

        if(err){
            logger.error('error looking up latest pitcher stats: ' + err);
            return res.send(500,err);
        }
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('| found PitcherStat with mlbid: ' + stats.mlbid + ':' + stats.name);
//        logger.info('|-------------------------------------------');
//        logger.info('|-------------------------------------------');
//        logger.info('|  this means we found the matching mlbid record in the stats collection for player: ' + stats.name);
//        logger.info('|-------------------------------------------');
//        logger.info('|  length of current stat records: ' + dox.length);
//        logger.info('|-------------------------------------------');

        // assume the first document is the latest
        // - this is important so pay attention to the sort
        if (dox[0]){
            var latestStatRecord = dox[0];
            stats.wins = latestStatRecord.w;
            stats.losses = latestStatRecord.l;
            stats.k = latestStatRecord.so;
            stats.ip = latestStatRecord.w;
            stats.saves = latestStatRecord.sv;
            stats.lastUpdate = Date.now();
//            logger.info('|------------------------');
//            logger.info('- set player stats: ' + stats.name);
//            logger.info('|currentPlayer.wins: ' + stats.wins);
//            logger.info('|currentPlayer.losses: ' + stats.losses);
//            logger.info('|currentPlayer.k: ' + stats.k);
//            logger.info('|currentPlayer.ip: ' + stats.ip);
//            logger.info('|currentPlayer.saves: ' + stats.saves);
//            logger.info('|------------------------');

            Roster.update(
                {slug:slug,'players.mlbid':stats.mlbid},
                {$set:{'players.$.wins':stats.wins,
                        'players.$.losses':stats.losses,
                        'players.$.k':stats.k,
                        'players.$.ip':stats.ip,
                        'players.$.saves':stats.saves,
                        'players.$.lastUpdate':Date.now()
                        }
                },
                function(err){
                    if(err){
                        logger.error('error updating stats: ' + err);
                        return res.send(500,'error updating stats: ' + err);
                    }
//                    logger.info('|  --------------------------------------------');
//                    logger.info('|  -');
//                    logger.info('|  ');
//                    logger.info('|  ');
//                    logger.info('|  processPitcherStats success: ' + stats.name);
//                    logger.info('|  ');
//                    logger.info('|  ');
//                    logger.info('|  -');
//                    logger.info('|  --------------------------------------------');
                }
            );
           // logger.info('|-cur length : ' + currRosterPlayersLength);


        }

    });
}
exports.processSingleRosterStats = function(req, res){
    var roster = req.param('roster',null);
    Roster.find({slug:roster},function(err, doc){
        if (err){
            logger.error('error finding roster: ' + err);
            return res.send(500,err);
        }
//         logger.info('process roster: ' + roster );

        var currRoster = doc[0];
        var currRosterPlayers = currRoster.players;
        var currRosterPlayersLength = currRosterPlayers.length;
       // logger.info('roster players count: ' + currRosterPlayersLength);
        for (var j = 0;j < currRosterPlayersLength;j++){
            var currentPlayer = currRosterPlayers[j];
           // logger.info('inside roster players loop: ' + currentPlayer.name);
            if ((currentPlayer.pos === 'SP') || (currentPlayer.pos === 'RP')){
                // pitcher roster player
                if (currentPlayer.mlbid && (currentPlayer.mlbid != 'undefined')){
//                    logger.info('- I am a picher: ' + currentPlayer.name);
//                    logger.info('- I have a mlbid: ' + currentPlayer.mlbid);
                    // make sure the player has been mapped to a mlbid
                    // look up the player in the latest stat entry
                    var stats = currentPlayer;
                    processPitcherStats(roster,stats);

                }
            }
            else{
                // batter roster player
                // pitcher roster player
                if (currentPlayer.mlbid && (currentPlayer.mlbid != 'undefined')){
                    // make sure the player has been mapped to a mlbid
                    // look up the player in the latest stat entry
//                    logger.info('- I am a batter: ' + currentPlayer.name);
//                    logger.info('- I have a mlbid: ' + currentPlayer.mlbid);
                    var stats = currentPlayer;
                    processBatterStats(roster,stats);
                    

                }
            }
//            if (j === currRosterPlayersLength){
//                logger.info('|------------------------');
//                logger.info('|Save this Roster Player set: ' + currRoster.slug);
//                logger.info('|------------------------');
//                // last player in the roster
//                currRoster.save(function(err){
//                    if(err){
//                        logger.error('error saving roster players after round of stat update: ' + err);
//                        return res.send(500,'error saving roster players after stats update: ' + err);
//                    }
//                    logger.info('|------------------------');
//                    logger.info('|========================');
//                    logger.info('|========================');
//                    logger.info('|========================');
//                    logger.info('|========================');
//                    logger.info('|========================');
//                    logger.info('|========================');
//                    logger.info('|  Save the Roster success');
//                    logger.info('|------------------------');
//                    logger.info('save roster: ' + j);
//                    return res.send(200,'stats update complete');
//                });
//            }
        }
        return res.send(200,'process request sent');




    });



}
exports.processLatestStats = function(req, res){


    logger.info('entry processLatestStats ');

    for (var i = 0;i  < rosterArray.length;i++){
        Roster.find({slug:rosterArray[i]},function(err, doc){
           if (err){
               logger.error('error finding roster: ' + err);
               return res.send(500,err);
           }
           // logger.info('inside roster loop: ' + rosterArray[i] + ' : '  + doc );

            var currRoster = doc[0];
            var currRosterPlayers = currRoster.players;
            var currRosterPlayersLength = currRosterPlayers.length;
            logger.info('roster players count: ' + currRosterPlayersLength);
            for (var j = 0;j < currRosterPlayersLength;j++){
                var currentPlayer = currRosterPlayers[j];
                logger.info('inside roster players loop: ' + currentPlayer.name);
                if ((currentPlayer.pos === 'SP') || (currentPlayer.pos === 'RP')){
                    // pitcher roster player
                    logger.info('- I am a picher: ' + currentPlayer.pos);
                    if (currentPlayer.mlbid){
                        logger.info('- I have a mlbid: ' + currentPlayer.mlbid);
                        // make sure the player has been mapped to a mlbid
                        // look up the player in the latest stat entry
                        PitcherStat.find({player_id:currentPlayer.mlbid},function(err,dox){
                            if(err){
                                logger.error('error looking up latest pitcher stats: ' + err);
                                return res.send(500,err)
                            }
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            logger.info('| found PitcherStat with mlbid');
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            logger.info('|  this means we found the matching mlbid record in the stats collection for player: ' + currentPlayer.name);
                            logger.info('|-------------------------------------------');
                            logger.info('|  length of current stat records: ' + dox.length);
                            logger.info('|-------------------------------------------');
                            logger.info('|');
                            logger.info('|');
                            logger.info('|' + dox[0]);
                            logger.info('|');
                            logger.info('|');
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            logger.info('- end found PitcherStat with mlbid');
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            logger.info('|-------------------------------------------');
                            // assume the first document is the latest
                            // - this is important so pay attention to the sort
                            if (dox[0]){
                                var latestStatRecord = dox[0];
                                currentPlayer.wins = latestStatRecord.w;
                                currentPlayer.losses = latestStatRecord.l;
                                currentPlayer.k = latestStatRecord.so;
                                currentPlayer.ip = latestStatRecord.w;
                                currentPlayer.saves = latestStatRecord.sv;
                                currentPlayer.lastUpdate = Date.now();
                                logger.info('|------------------------');
                                logger.info('- set player stats: ' + currentPlayer.name);
                                logger.info('|currentPlayer.wins: ' + currentPlayer.wins);
                                logger.info('|currentPlayer.losses: ' + currentPlayer.losses);
                                logger.info('|currentPlayer.k: ' + currentPlayer.k);
                                logger.info('|currentPlayer.ip: ' + currentPlayer.ip);
                                logger.info('|currentPlayer.saves: ' + currentPlayer.saves);
                                logger.info('|------------------------');

                                logger.info('|- j ' + j + '  cur length : ' + currRosterPlayersLength);
                                if (j === currRosterPlayersLength){
                                    logger.info('|------------------------');
                                    logger.info('|Save this Roster Player set: ' + currRoster.slug);
                                    logger.info('|------------------------');
                                    // last player in the roster
                                    currRoster.save(function(err){
                                        if(err){
                                            logger.error('error saving roster players after round of stat update: ' + err);
                                            return res.send(500,'error saving roster players after stats update: ' + err);
                                        }
                                        logger.info('|------------------------');
                                        logger.info('|========================');
                                        logger.info('|========================');
                                        logger.info('|========================');
                                        logger.info('|========================');
                                        logger.info('|========================');
                                        logger.info('|========================');
                                        logger.info('|  Save the Roster success');
                                        logger.info('|------------------------');
                                        logger.info('save roster: ' + j);
                                    });
                                    if (i === 4){
                                        return res.send(200,'stats update complete');
                                    }
                                }

                            }

                        });
                    }
                }
                else{
                    // batter roster player
                    // pitcher roster player
                    if (currentPlayer.mlbid){
                        // make sure the player has been mapped to a mlbid
                        // look up the player in the latest stat entry
                        BatterStat.find({player_id:currentPlayer.mlbid},function(err,dox){
                            if(err){
                                logger.error('error looking up latest pitcher stats: ' + err);
                                return res.send(500,err)
                            }
                            // assume the first document is the latest
                            // - this is important so pay attention to the sort
                            if (dox[0]){
                                var latestStatRecord = dox[0];
                                currentPlayer.runs = latestStatRecord.r;
                                currentPlayer.hits = latestStatRecord.h;
                                currentPlayer.hr = latestStatRecord.hr;
                                currentPlayer.rbi = latestStatRecord.rbi;
                                currentPlayer.sb = latestStatRecord.sv;
                                currentPlayer.lastUpdate = Date.now();

                                if (j === (currRosterPlayersLength - 1)){
                                    // last player in the roster
                                    currRoster.save(function(err){
                                        if(err){
                                            logger.error('error saving roster players after round of stat update: ' + err);
                                            return res.send(500,'error saving roster players after stats update: ' + err);
                                        }
                                        logger.info('save roster: ' + j);
                                    });
                                    if (i === 4){
                                        return res.send(200,'stats update complete');
                                    }
                                }

                            }

                        });
                    }
                }
            }























        });

    }

    // iterate over each roster
    // get the players list
    // for each player
    // determine pitcher or batter
    // get latest stats for player
    //PitcherStat.find({player_id:mlbid})
    // assign relevant data points -including date
    // save player
};
var updateBatters = function(){

    // get the URL
    // pull the stats block
    // pull the pitchers from each of the rosters
    // iterate over the roster players
    // grab the mlbid
    // find the relevant entry in the stats from mlb
    // parse out the relevant fields
    // get the date
    // update the players stats with a date stamp


};
EventBus.on('stats.rosterPitchersArrayLoaded',function(data){
    var rosterSlug = data.slug;
    var rosterPitchers = data.pitchersArray;
    //logger.info('stats.rosterPitchersArrayLoaded ' + data);
    for (var i = 0;i < rosterPitchers.length;i++){
        var rosterPitcher = rosterPitchers[i];
        for (var x = 0;x < currentRawPitcherStats.length;x++){
            var statPitcher = currentRawPitcherStats[x];
            //logger.info('stats.rosterPitchersArrayLoaded B');
            if (statPitcher.player_id === rosterPitcher.mlbid){
                rosterPitcher.wins = statPitcher.w;
                rosterPitcher.losses = statPitcher.l;
                rosterPitcher.saves = statPitcher.sv;
                rosterPitcher.ip = statPitcher.ip;
                rosterPitcher.k = statPitcher.so;
                rosterPitcher.lastUpdate = Date.now();
                //logger.info('stats.rosterPitchersArrayLoaded C');
                Roster.update(
                    {slug:rosterSlug,'players.mlbid':rosterPitcher.mlbid},
                    {$set:{'players.$.wins':rosterPitcher.wins,
                            'players.$.losses':rosterPitcher.losses,
                            'players.$.saves':rosterPitcher.saves,
                            'players.$.ip':rosterPitcher.ip,
                            'players.$.k':rosterPitcher.k,
                            'players.$.lastUpdate':Date.now()
                          }
                    },
                    function(err){
                        if (err){
                            logger.error('error updating roster pitcher stat' + err);
                        }
                        EventBus.emit('stats.pitcherProcessedSuccess', + rosterPitcher.name);
                        //logger.info('stats.rosterPitchersArrayLoaded D');
                        //logger.info('update roster pitcher stats: ' + rosterPitcher.name);
                    }
                );
            }
        }
    }
});
EventBus.on('stats.pitcherProcessedSuccess', function(data){
    logger.info('stats.pitcherProcessedSuccess: ' + data);
});
EventBus.on('stats.rosterBatterLoadSuccess',function(roster){
    var currRoster = roster;
    logger.info('stats.rosterLoadSuccess ' + currRoster.slug);

    if (currentRawBatterStats){
        // start with the outer loop of all pitchers from the raw list
        for (var i = 0;i < currentRawBatterStats.length;i++){
            var tPlayer = currentRawBatterStats[i];
            // for each of the raw pitchers - see if there is a match on this roster
            // inner loop on the roster players
            for (var j = 0;j < currRoster.players.length;j++){
                var cPlayer = currRoster.players[j];
                if (cPlayer.mlbid === tPlayer.player_id){
                    // set the stats
                    cPlayer.runs = tPlayer.r;
                    cPlayer.hits = tPlayer.h;
                    cPlayer.hr = tPlayer.hr;
                    cPlayer.rbi = tPlayer.rbi;
                    cPlayer.sb = tPlayer.sb;
                    cPlayer.lastUpdate = Date.now();
                }
            }

        }
        try{
            // when the loop is complete, save the roster
            logger.info('saving roster: ' + currRoster.slug);
            currRoster.save(function(err){
                if (err){
                    EventBus.emit('stats.errorEvent',err);
                    //logger.error('stats.errorEvent: ' + err);
                }
                EventBus.emit('stats.rosterBatterSavedSuccess',currRoster.slug);
                if (currRoster.slug == 'mashers'){
                    EventBus.emit('stats.batterStatsRosterLoopComplete');
                }
            });
        }
        catch(err){
            EventBus.emit('stats.errorEvent',err);
        }
    }
});
EventBus.on('stats.rosterPitcherLoadSuccess',function(roster){
   var currRoster = roster;
    logger.info('stats.rosterLoadSuccess ' + currRoster.slug);
    var pitchersArray = [];
    if (currentRawPitcherStats){
        // start with the outer loop of all pitchers from the raw list
        for (var i = 0;i < currentRawPitcherStats.length;i++){
            var tPlayer = currentRawPitcherStats[i];
            // for each of the raw pitchers - see if there is a match on this roster
            // inner loop on the roster players
            for (var j = 0;j < currRoster.players.length;j++){
                var cPlayer = currRoster.players[j];
                if (cPlayer.mlbid === tPlayer.player_id){
                    // set the stats
                    cPlayer.wins = tPlayer.w;
                    cPlayer.losses = tPlayer.l;
                    cPlayer.saves = tPlayer.sv;
                    cPlayer.ip = tPlayer.ip;
                    cPlayer.k = tPlayer.so;
                    cPlayer.lastUpdate = Date.now();
                }
            }

        }
        try{
            // when the loop is complete, save the roster
            logger.info('saving roster: ' + currRoster.slug);
            currRoster.save(function(err){
                if (err){
                    EventBus.emit('stats.errorEvent',err);
                    //logger.error('stats.errorEvent: ' + err);
                }
                EventBus.emit('stats.rosterPitcherSavedSuccess',currRoster.slug);
                if (currRoster.slug == 'mashers'){
                    EventBus.emit('stats.pitcherStatsRosterLoopComplete');
                }
            });
        }
        catch(err){
            EventBus.emit('stats.errorEvent',err);
        }
    }
});
EventBus.on('stats.rosterBatterSavedSuccess',function(roster){
    logger.info(roster + ' - saved batters');
});
EventBus.on('stats.rosterPitcherSavedSuccess',function(roster){
    logger.info(roster + ' - saved pitchers');
});
EventBus.on('stats.errorEvent',function(err){
    logger.error(err + ' - save roster pitchers error');
});
EventBus.on('stats.batterStatsPullSuccess',function(data){
    // loop over the rosters
    logger.info('stats.batterStatsPullSuccess B');

    for (var i = 0;i < rosterArray.length;i++){
        var tRosterSlug = rosterArray[i];
        Roster.find({slug:tRosterSlug},function(err,dox){
            //var thisSlug = tRosterSlug;
            if (err){
                logger.error('error finding roster for pitcher stat update: ' + err);
            }
            var tRoster = dox[0];

            EventBus.emit('stats.rosterBatterLoadSuccess',tRoster);

        });


    }

    // for each roster
    // get the player list
    // loop over the pitchers
    // update properties
    // when each roster players loop is done
    // save the roster
});
EventBus.on('stats.pitcherStatsPullSuccess',function(data){
    // loop over the rosters
    logger.info('stats.pitcherStatsPullSuccess B');

    for (var i = 0;i < rosterArray.length;i++){
        var tRosterSlug = rosterArray[i];
        Roster.find({slug:tRosterSlug},function(err,dox){
            //var thisSlug = tRosterSlug;
            if (err){
                logger.error('error finding roster for pitcher stat update: ' + err);
            }
            var tRoster = dox[0];

            EventBus.emit('stats.rosterPitcherLoadSuccess',tRoster);

        });


    }

    // for each roster
    // get the player list
    // loop over the pitchers
    // update properties
    // when each roster players loop is done
    // save the roster
});
var updatePitchers = function(){

};
exports.getFetchStatsStatus = function(req,res){
  return res.send(200,fetchStatsAgentActive + '');
};
EventBus.on('stats.turnOnFetchStatsRequest',function(){
    fetchStatsAgentActive = true;
    fetchStatsTimer = setInterval(function(){
        //if (fetchStatsAgentActive){
        EventBus.emit('stats.getLatestPitcherStatsRequest');
        EventBus.emit('stats.getLatestBatterStatsRequest');
        statsFetchMessage = '| FETCH STATS ON';
        logger.info('| FETCH STATS ON');
        //}
        // else{
        //      logger.info('| FETCH STATS OFF');
        //  }

    },43200000);
    EventBus.emit('stats.fetchStatsTurnedOn');

});
EventBus.on('stats.turnOffFetchStatsRequest',function(){
    fetchStatsAgentActive = false;
//    logger.info('| FETCH STATS OFF');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|  CLEAR TIMEOUT ');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
    clearInterval(fetchStatsTimer);
    EventBus.emit('stats.fetchStatsTurnedOff');

});
exports.toggleFetchStats = function(req, res){
    var bValue = req.param('value',null);
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|  bVAlue: ' + bValue);
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
//    logger.info('|');
    var statsFetchMessage;
    if (bValue === 'true'){
        EventBus.emit('stats.turnOnFetchStatsRequest');

    }
    else{
        EventBus.emit('stats.turnOffFetchStatsRequest');

    }
    EventBus.on('stats.fetchStatsTurnedOff',function(){
        return res.send(200,'stats fetching turned off');
    });
    EventBus.on('stats.fetchStatsTurnedOfn',function(){
        return res.send(200,'stats fetching turned on');
    });
};
EventBus.on('stats.getLatestPitcherStatsRequest',function(event){

    request({uri: pitchers}, function(err, response, body){
        // var urlObj2 = urlObj;
        var self = this;
        // var innerIndex2 = innerIndex;
        self.items = new Array();//I feel like I want to save my results in an array
        //Just a basic error check
        if(err && response.statusCode !== 200){
            console.log('Request error: ' + JSON.stringify(err));
            return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }
        var payload = {};
        payload.data = body;
        payload.metadata = {};

        var statObj = JSON.parse(payload.data);

        currentRawPitcherStats = statObj.stats_sortable_player.queryResults.row;
        logger.info('stats.pitcherStatsPullSuccess - count: ' + currentRawPitcherStats.length);

        EventBus.emit('stats.pitcherStatsPullSuccess');

//        EventBus.on('stats.pitcherStatsRosterLoopComplete',function(data){
//            return res.send(200,'pitcher loop complete');
//        });


    });
});
EventBus.on('stats.getLatestBatterStatsRequest',function(event){

    request({uri: batters}, function(err, response, body){
        // var urlObj2 = urlObj;
        var self = this;
        // var innerIndex2 = innerIndex;
        self.items = new Array();//I feel like I want to save my results in an array
        //Just a basic error check
        if(err && response.statusCode !== 200){
            console.log('Request error: ' + JSON.stringify(err));
            return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }
        var payload = {};
        payload.data = body;
        payload.metadata = {};

        var statObj = JSON.parse(payload.data);

        currentRawBatterStats = statObj.stats_sortable_player.queryResults.row;
        logger.info('stats.batterStatsPullSuccess - count: ' + currentRawBatterStats.length);

        EventBus.emit('stats.batterStatsPullSuccess');

//        EventBus.on('stats.batterStatsRosterLoopComplete',function(data){
//            return res.send(200,'batter loop complete');
//        });


    });
});
exports.triggerBatterStats = function(req,res){
    EventBus.emit('stats.getLatestBatterStatsRequest');
    return res.send(200,'batter processing request is processing');
};
exports.triggerPitcherStats = function(req,res){
    EventBus.emit('stats.getLatestPitcherStatsRequest');
    return res.send(200,'pitcher processing request is processing');
};
// post player stats
exports.postPlayerStats = function(req,res){
    // is it a pitcher or batter
    var playerType = req.param('posType',null);
    var stats;
    try{
        stats = req.param('stats',null);
    }
    catch(e){
        stats = null;
        return res.send(500, 'error parsing stats: ' + e.message);
    }
    logger.info('postPlayerStats: ' + playerType);

    if (playerType && stats){




        var dbStatObj;
        if (playerType === 'batter'){
            dbStatObj = new BatterStat(stats);
            dbStatObj.lastUpdate = Date.now();
            dbStatObj.save(function(err){
               if (err){
                   logger.error('error saving batter stat: ' + e.message);
                   return res.send(500,'error saving batter stat: ' + e.message);
               }
               return res.send(200,'stats inserted successfully');
            });
        }
        else if(playerType === 'pitcher'){
            dbStatObj = new PitcherStat(stats);
            dbStatObj.lastUpdate = Date.now();
            dbStatObj.save(function(err){
                if (err){
                    logger.error('error saving pitcher stat: ' + e.message);
                    return res.send(500,'error saving pitcher stat: ' + e.message);
                }
                return res.send(200,'stats inserted successfully');
            });
        }
        else{
            return res.send(400, 'bad posType: ' + playerType);
        }
    }
    else{
        logger.warn('postPlayerStats problem: no player type and-or stats');
        return res.send(400);
    }
    // set the date
    // save document

};
/*
*
* Get Totals History
*
* */
exports.getTotalsHistory = function(req, res){
    var start = new Date();
//    var end =  new Date(2013, 3, 1);
//    end.setDate(start.getDate()-7);

    var end = new Date();
    end.setDate(start.getDate()-7);
    logger.info('date start: ' + start);
    logger.info('date.end: ' + end);
    Totals.find({date: {$gte: end, $lt: start}},function(err,dox){
       if(err){
           return res.send(500, err);
       }
        //logger.info('totals this is it Sean: ' + dox);
       return res.send(dox);

    });
};

/*
*
* Get Latest Update Timestamp
*
* */
exports.getLastUpdate = function(req,res){
  Totals.find({roster:'bashers'}).sort({date:-1}).execFind(function(err,doc){

      if (err){
          return res.send(500,err)
      }
      return res.send(doc[0].date);
  });
};
/*
*
*
* MLB Server Call
*
* */
exports.pullStats = function(req, res){

    // batting stats from mlb
    //var reqUrl = 'http://mlb.mlb.com/stats/sortable.jsp?c_id=tex#game_type=R&season=2013&league_code=AL&split=&playerType=ALL&sectionType=sp&statType=hitting&elem=%5Bobject+Object%5D&tab_level=child&click_text=Sortable+Player+hitting&season_type=ANY&page=1&ts=1364832580073&team_id=';
   // var reqUrl = 'http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order=desc&sort_column=avg&stat_type=hitting&page_type=SortablePlayer&game_type=R&player_pool=ALL&season_type=ANY&league_code=AL&sport_code=mlb&results=1000&recSP=1&recPP=50';

    var reqUrl = batters;
    var page1 = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=50";
    var page2 = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=2&recPP=50";
    var page3 = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=3&recPP=50";

    /*
    *
    * {
    * "recPP":"50",   // records per page
    * "created":"2013-04-02T02:52:09",
    * "recSP":"1",      // current page
    * "totalP":"3",     // total pages
    * "recs":"50",      // ?
    * "totalSize":"118",// total record count
    * "row":[]          // array of records in record set
    *
    *
    * */

    if (req.params.type){
        if (req.params.type === 'pitchers'){
            reqUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='asc'&sort_column='era'&stat_type=pitching&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&position='1'&recSP=1&recPP=1100";
        }
    }

    logger.info('reqUrl: ' + reqUrl);
    //var reqUrl = urlObj.url;
    request({uri: reqUrl}, function(err, response, body){
       // var urlObj2 = urlObj;
        var self = this;
       // var innerIndex2 = innerIndex;
        self.items = new Array();//I feel like I want to save my results in an array
        //Just a basic error check
        if(err && response.statusCode !== 200){
            console.log('Request error: ' + JSON.stringify(err));
            return res.send(500,'there was an error: ' +response.statusCode  + ' : ' + err);
        }
        var payload = {};
        payload.data = body;
        payload.metadata = {};

        var statObj = JSON.parse(payload.data);

        payload.metadata.totalRecords = statObj.stats_sortable_player.queryResults.totalSize;
        payload.metadata.recordsPerPage = statObj.stats_sortable_player.queryResults.recPP;
        payload.metadata.pageCount = statObj.stats_sortable_player.queryResults.totalP;
        payload.metadata.currentPage = statObj.stats_sortable_player.queryResults.recSP;


        logger.info('total: ' + payload.metadata.totalRecords);

        //logger.info(payload);

       // logger.info(response);
        return res.send(payload);
        //Send the body param as the HTML code we will parse in jsdom
        //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
//        jsdom.env({
//            html: body,
//            scripts: ['http://code.jquery.com/jquery-1.6.min.js']
//        }, function(err, window){
//            //Use jQuery just as in a regular HTML page
//            var $ = window.jQuery;
//            var title = $('title').text();
//            var statsTable = $('body#content#datagrid').html();
//
//            logger.info('Page Title: ' + title);
//
//            logger.info('DataGrid: ' + statsTable);
//            return res.send(statsTable);
//
//        });
    });
};
exports.processURLs = function(req, res){

    var urlProcessCount = 0;
    EventBus.on('content.processedURL',function(){
        //logger.info('add page title to response stack: ' + data + '  title count: ' + titleArray.length);
        //titleArray.push(data);
        if (titleArray.length === urlProcessCount){

            EventBus.emit('content.processedAllURLs');
        }
    });

    EventBus.on('content.processedAllURLs',function(data){
        logger.info('POST RESPONSE');
        res.send({status:'success',response:data});
    });
    URL.find(function(err,dox){
        if (!err){
            logger.info('returning list of urls');
            logger.info('number of urls to procss: ' + dox.length);

            if (dox){

                if (dox.length){

                    var urlCount = dox.length;
                    urlProcessCount = urlCount;
                    var j = 0;
                    var titleArray = [];
                    for (j = 0;j < dox.length;j++){
                        var urlObj = dox[j];
                        //var tuduURL = dox[j].url;
                        //var createdDate = dox[j].
                        var innerIndex = j;
                        //logger.info('processing: ' + tuduURL);

                        var reqUrl = urlObj.url;
                        request({uri: urlObj.url}, function(err, response, body){
                            var urlObj2 = urlObj;
                            var self = this;
                            var innerIndex2 = innerIndex;
                            self.items = new Array();//I feel like I want to save my results in an array
                            //Just a basic error check
                            if(err && response.statusCode !== 200){console.log('Request error.');}
                            //Send the body param as the HTML code we will parse in jsdom
                            //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
                            jsdom.env({
                                html: body,
                                scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                            }, function(err, window){
                                //Use jQuery just as in a regular HTML page
                                var $ = window.jQuery;
                                var title = $('title').text();
                                var bodyScrapedText = $('body:not(:has(script))').html();
                                //logger.info('scraped text: ' + bodyScrapedText);
                                //	logger.info('html: ' + bodyElements);
                                var bodyText = $(bodyScrapedText).text();

                                //console.log('Page Title: ' + pageTitle);

                                //logger.info('Page Text: ' + bodyText);
                                //res.end($('title').text());
                                // trigger event
//								logger.info('|');
//								logger.info('| EMIT title');
//								logger.info('|');
                                //var responseObj = {};
                                //responseObj.url = urlObj.url;
                                urlObj2.title = title;
                                logger.info('Page Title: ' + urlObj2.title);
                                var xyz = Object.create(urlObj2);
                                var abc = new UrlResponseObj();
                                abc.title = urlObj2.title;
                                abc.url = reqUrl;
                                abc.created = urlObj2.created;
                                titleArray.push(abc);
                                if (titleArray.length === urlProcessCount){
                                    logger.info('posting title array: ' + JSON.stringify(titleArray));
                                    EventBus.emit('content.processedAllURLs', titleArray);

                                }

                                //	EventBus.emit('content.processedURL');


//								if (innerIndex2 === (urlCount - 1)){
//									//res.send({status:'success',response:data});
//									logger.info('EMIT content.processedAllURLs');
//									EventBus.emit('content.processedAllURLs');
//								}
                                //res.send({status:'success',response:'?'});
                            });
                        });
                    }



                }
            }
            else{
                logger.warn('no documents returned finding urls');
                res.send(200);
            }
        }
        else{
            logger.error('error getting list of urls: ' + err.message);
            res.send(400);
        }
    });


};