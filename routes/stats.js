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
        new (winston.transports.File)({ filename: './logs/stats.log' })
    ]
});
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

    var reqUrl = "http://mlb.mlb.com/pubajax/wf/flow/stats.splayer?season=2013&sort_order='desc'&sort_column='avg'&stat_type=hitting&page_type=SortablePlayer&game_type='R'&player_pool=ALL&season_type=ANY&league_code='AL'&sport_code='mlb'&results=1000&recSP=1&recPP=300";
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

        var payload = body;
        var statObj = JSON.parse(payload);
        var totalRecords = statObj.stats_sortable_player.queryResults.totalSize;
        var recordsPerPage = statObj.stats_sortable_player.queryResults.recPP;
        var pageCount = statObj.stats_sortable_player.queryResults.totalP;
        var currentPage = statObj.stats_sortable_player.queryResults.recSP;


        logger.info('total: ' + totalRecords);

        //logger.info(payload);

       // logger.info(response);
        return res.send(200);
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