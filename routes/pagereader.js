/**
 * Draft 2013
 *
 * User: sean
 * Date: 19/03/13
 * Time: 11:11 PM
 *
 */
var Player = require('../models/player-model');
var Roster = require('../models/roster-model');
winston = require('winston');

var jsdom = require('jsdom')
    , request = require('request')
    , url = require('url');
var events = require('events');
var EE = require('events').EventEmitter;
var EventBus = new EE();

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'pagereader.log' })
    ]
});
var getTranslatedName = function(slug){

    switch(slug){
        case 'mashers':
            return 'Mashers';
        case 'rallycaps':
            return 'Rally%20Caps';
        case 'bashers':
            return 'Bashers';
        case 'hooters':
            return 'Hooters';
        case 'stallions':
            return 'Stallions';
        default:
            return false;
    }
}
var getRosterTotal = function(slug){

    switch(slug){
        case 'mashers':
            return 3644.5;
        case 'rallycaps':
            return 4196;
        case 'bashers':
            return 4096.5;
        case 'hooters':
            return 4322;
        case 'stallions':
            return 4792;
        default:
            return false;
    }
}
var getRosterEmail = function(slug){

    switch(slug){
        case 'mashers':
            return 'jcmaeland@bigpond.com';
        case 'rallycaps':
            return 'russellm@clearwaternow.ca';
        case 'bashers':
            return 'seanbrookes@shaw.ca';
        case 'hooters':
            return 'kevin.pedersen@alumni.uvic.ca';
        case 'stallions':
            return 'brentfromvan@hotmail.com';
        default:
            return false;
    }
}
exports.getPage = function(req, res){
    var urlObj = {};
    if (req.params.name){
        logger.info('process roster: ' + req.params.name);
        var slug = req.params.name;
        var queryName = getTranslatedName(slug);
        var rosterTotal = getRosterTotal(slug);
        var rosterEmail = getRosterEmail(slug);

        if (queryName){

            urlObj.url = 'http://dewman.homeserver.com:8080/baseball/team.php?team=' + queryName;

            request({uri: urlObj.url}, function(err, response, body){
                if(err){
                    logger.error('get page error: ' + err.message);
                    res.send(400,'get page error: ' + err.message);
                }
                else{
                    var urlObj2 = urlObj;
                    var self = this;

                    //Just a basic error check
                    if(err && response.statusCode !== 200){
                        console.log('Request error.');
                    }
                    //Send the body param as the HTML code we will parse in jsdom
                    //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
                    jsdom.env({
                        html: body,
                        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                    }, function(err, window){

                        //Use jQuery just as in a regular HTML page
                        var $ = window.jQuery;
                        var title = $('title').text();
                        var bodyScrapedText = $('#pagebody').html();
                        var statsTableArray = $('#pagebody .team_stats');
                        var responseHtml = $(statsTableArray[1]).html();

                        var newRoster = new Roster({
                            name: title,
                            slug: slug,
                            email: rosterEmail,
                            total: rosterTotal

                        });
                        var pos;
                        var name;
                        var team;
                        var runs;
                        var hits;
                        var hr;
                        var rbi;
                        var sb;
                        var wins;
                        var losses;
                        var k;
                        var ip;
                        var saves;
                        var total;

                        var tableArray = $(statsTableArray);
                        for (var i = 0;i < tableArray.length;i++){
                            var currTable = tableArray[i];
                            $(currTable).find('tr').map(function() {

                                // $(this) is used more than once; cache it for performance.
                                var $row = $(this);

                                // For each row that's "mapped", return an object that
                                //  describes the first and second <td> in the row.

                                //logger.info('RECORD TYPE: ' + $row.attr('class'));
                                var recordType = $row.attr('class');

                                if (recordType){
                                    // batters
                                    if (i === 0){


                                        pos = $row.find(':nth-child(1)').text();
                                        name = $row.find(':nth-child(2)').text();
                                        team = $row.find(':nth-child(3)').text();
                                        runs = $row.find(':nth-child(4)').text();
                                        hits = $row.find(':nth-child(5)').text();
                                        hr = $row.find(':nth-child(6)').text();
                                        rbi = $row.find(':nth-child(7)').text();
                                        sb = $row.find(':nth-child(8)').text();
                                        total = $row.find(':nth-child(9)').text();
                                        var batterObj = {
                                            pos:pos,
                                            team:team,
                                            name:name,
                                            runs:runs,
                                            hits:hits,
                                            hr:hr,
                                            rbi:rbi,
                                            sb:sb,
                                            total:total,
                                            posType:'batter',
                                            playerStatus:recordType,
                                            draftStatus:'protected'
                                        };
                                        var newBatter = new Player(batterObj);
                                        newRoster.players.push(newBatter);
                                        logger.info('BATTER: ' + recordType + ':' + pos + ':' + name + ':' + team + ':' + runs + ':' + hits + ':' + hr + ':' + rbi + ':' + sb + ':' + total);
                                    }
                                    // starters
                                    if (i === 1){
                                        pos = $row.find(':nth-child(1)').text();
                                        name = $row.find(':nth-child(2)').text();
                                        team = $row.find(':nth-child(3)').text();
                                        wins = $row.find(':nth-child(5)').text();
                                        losses = $row.find(':nth-child(6)').text();
                                        k = $row.find(':nth-child(7)').text();
                                        total = $row.find(':nth-child(9)').text();
                                        var starterObj = {
                                            pos:pos,
                                            team:team,
                                            name:name,
                                            wins:wins,
                                            losses:losses,
                                            k:k,
                                            total:total,
                                            posType:'starter',
                                            playerStatus:recordType,
                                            draftStatus:'protected'
                                        };
                                        var newStarter = new Player(starterObj);
                                        newRoster.players.push(newStarter);
                                        logger.info('STARTER: ' + recordType + ':' + pos + ':' + name + ':' + team + ':' + wins + ':' + losses + ':' + k + ':' +total);
                                    }
                                    // closers
                                    if (i === 2){
                                        pos = $row.find(':nth-child(1)').text();
                                        name = $row.find(':nth-child(2)').text();
                                        team = $row.find(':nth-child(3)').text();
                                        wins = $row.find(':nth-child(4)').text();
                                        losses = $row.find(':nth-child(5)').text();
                                        saves = $row.find(':nth-child(6)').text();
                                        ip = $row.find(':nth-child(7)').text();
                                        k = $row.find(':nth-child(8)').text();
                                        total = $row.find(':nth-child(9)').text();
                                        var closerObj = {
                                            pos:pos,
                                            team:team,
                                            name:name,
                                            wins:wins,
                                            losses:losses,
                                            saves:saves,
                                            ip:ip,
                                            k:k,
                                            total:total,
                                            posType:'closer',
                                            playerStatus:recordType,
                                            draftStatus:'protected'
                                        };
                                        var newCloser = new Player(closerObj);
                                        newRoster.players.push(newCloser);
                                        logger.info('CLOSER: ' + recordType + ':' + pos + ':' + name + ':' + team + ':' + wins + ':' + losses + ':' + saves + ':' + ip + ':' + k + ':' +total);

                                    }
                                }


                            }).get();

                            //	var urlQueryObj = {      url: reqURL             };
                        }



                        newRoster.save(function(err){

                            if (err){
                                logger.error('save new roster error: ' + JSON.stringify(err));
                                return res.send(400,'save new roster error: ' + JSON.stringify(err));
                            }
                            res.send('SUCCESS!!!');
                        });
                        //res.send('SUCCESS!!!');


                    });
                }

            });
        }
        else{
            logger.warn('invalid roster slug');
            return res.send(400);
        }
    }
    else{
        logger.warn('no roster name supplied');
        return res.send(400);
    }

};
//exports.processURLs = function(req, res){
//
//    var urlProcessCount = 0;
//    EventBus.on('content.processedURL',function(){
//        //logger.info('add page title to response stack: ' + data + '  title count: ' + titleArray.length);
//        //titleArray.push(data);
//        if (titleArray.length === urlProcessCount){
//
//            EventBus.emit('content.processedAllURLs');
//        }
//    });
//
//    EventBus.on('content.processedAllURLs',function(data){
//        logger.info('POST RESPONSE');
//        res.send({status:'success',response:data});
//    });
//    URL.find(function(err,dox){
//        if (!err){
//            logger.info('returning list of urls');
//            logger.info('number of urls to procss: ' + dox.length);
//
//            if (dox){
//
//                if (dox.length){
//
//                    var urlCount = dox.length;
//                    urlProcessCount = urlCount;
//                    var j = 0;
//                    var titleArray = [];
//                    for (j = 0;j < dox.length;j++){
//                        var urlObj = dox[j];
//                        //var tuduURL = dox[j].url;
//                        //var createdDate = dox[j].
//                        var innerIndex = j;
//                        //logger.info('processing: ' + tuduURL);
//
//                        var reqUrl = urlObj.url;
//                        request({uri: urlObj.url}, function(err, response, body){
//                            var urlObj2 = urlObj;
//                            var self = this;
//                            var innerIndex2 = innerIndex;
//                            self.items = new Array();//I feel like I want to save my results in an array
//                            //Just a basic error check
//                            if(err && response.statusCode !== 200){console.log('Request error.');}
//                            //Send the body param as the HTML code we will parse in jsdom
//                            //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
//                            jsdom.env({
//                                html: body,
//                                scripts: ['http://code.jquery.com/jquery-1.6.min.js']
//                            }, function(err, window){
//                                //Use jQuery just as in a regular HTML page
//                                var $ = window.jQuery;
//                                var title = $('title').text();
//                                var bodyScrapedText = $('body:not(:has(script))').html();
//                                //logger.info('scraped text: ' + bodyScrapedText);
//                                //	logger.info('html: ' + bodyElements);
//                                var bodyText = $(bodyScrapedText).text();
//
//                                //console.log('Page Title: ' + pageTitle);
//
//                                //logger.info('Page Text: ' + bodyText);
//                                //res.end($('title').text());
//                                // trigger event
////								logger.info('|');
////								logger.info('| EMIT title');
////								logger.info('|');
//                                //var responseObj = {};
//                                //responseObj.url = urlObj.url;
//                                urlObj2.title = title;
//                                logger.info('Page Title: ' + urlObj2.title);
//                                var xyz = Object.create(urlObj2);
//                                var abc = new UrlResponseObj();
//                                abc.title = urlObj2.title;
//                                abc.url = reqUrl;
//                                abc.created = urlObj2.created;
//                                titleArray.push(abc);
//                                if (titleArray.length === urlProcessCount){
//                                    logger.info('posting title array: ' + JSON.stringify(titleArray));
//                                    EventBus.emit('content.processedAllURLs', titleArray);
//
//                                }
//
//                                //	EventBus.emit('content.processedURL');
//
//
////								if (innerIndex2 === (urlCount - 1)){
////									//res.send({status:'success',response:data});
////									logger.info('EMIT content.processedAllURLs');
////									EventBus.emit('content.processedAllURLs');
////								}
//                                //res.send({status:'success',response:'?'});
//                            });
//                        });
//                    }
//
//
//
//                }
//            }
//            else{
//                logger.warn('no documents returned finding urls');
//                res.send(200);
//            }
//        }
//        else{
//            logger.error('error getting list of urls: ' + err.message);
//            res.send(400);
//        }
//    });
//
//
//};
