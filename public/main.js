/**
 * Simple Framework One

 * User: sean
 * Date: 05/01/13
 * Time: 9:31 AM
 *
 *
 * Main
 *
 */
require.config({
    enforceDefine: true,
    paths: {
        'jquery'        : 'scripts/lib/jquery-1.8.2.min',
        'cookie'        : 'scripts/lib/plugins/jquery.cookie',
        'prettydate'    : 'scripts/lib/plugins/jquery.prettydate',
        'underscore'    : 'scripts/lib/underscore-min',
        //'text'          : 'scripts/lib/text',
        'json2'         : 'scripts/lib/json2',
        'i18n'          : 'scripts/lib/i18next.amd-1.6.0',
        'backbone'      : 'scripts/lib/backbone',
        'marionette'    : 'scripts/lib/backbone.marionette',
        'raphael'       : 'scripts/lib/raphael-min',
        'd3'            : 'scripts/lib/d3.v3.min',
        'morris'        : 'scripts/lib/morris.min',
        'router'        : 'router',
        'client'        : 'client-app',
        'sf1'           : 'scripts/sf1.0.1',
        'draft'         : 'modules/draft/draft-module',
        'security'      : 'modules/security/security-module',
        'stats'         : 'modules/stats/stats.controller',
        'admin'         : 'modules/admin/admin-module',
        'index'         : 'modules/index/index-module',
        'countdown'     : 'scripts/lib/plugins/kkcountdown',
        //'socket.io'     : '/socket.io/socket.io',
        'history'       : 'modules/history/history.controller',
        'chat'          : 'modules/chat/chat-module',
        'chatlib'       : 'scripts/lib/plugins/chat.io',
        'pageheader'    : 'modules/pageheader/pageheader-module',
        'maincontent'   : 'modules/maincontent/maincontent-module',
        'score'         : 'modules/score/score.controller',
        'pos'           : 'modules/pos/pos.controller',
        'roster'        : 'modules/roster/roster.controller',
       // 'io'            : 'modules/io/io-module',
        'ui'            : 'modules/ui/ui-module',
        'ia'            : 'modules/ia/ia.controller'
    },
    shim: {

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        marionette : {
            deps : ['backbone','underscore','jquery'],
            exports : 'Marionette'
        },
        underscore: {
            exports: '_'
        },
        i18n: {
            deps: ['jquery'],
            exports: 'i18n'
        },
        raphael:{
            deps: ['jquery'],
            exports: 'Raphael'
        },
        morris: {
            deps: ['jquery','raphael'],
            exports: 'Morris'
        },
        d3: {
            exports: 'd3'
        },
        sf1: {
            deps: ['jquery'],
            exports: 'sf1'
        },
        prettydate: {
            deps: ['jquery'],
            exports: 'jQuery.fn.prettyDate'
        },
        countdown: {
            deps: ['jquery']
        },
//        ia: {
//            deps: ['pageheader']
//        },
        cookie: {
            deps: ['jquery']
        }
    }
});
define(['jquery', 'sf1', 'i18n', 'client', 'security', 'roster'],
    function($, sf1, i18n, App, Security, Roster) {

        // jQuery init complete
        $(document).ready(function(){

            // init locale
            i18n.init({
                    lng: 'en'
                },
                function() {  // init rosters (app context models)

                    // load the rosters
                    // fire the event: app.rostersInitialized
                    if (!sf1.app.rosters){
                        sf1.app.rosters = [];
                        Roster.getRoster('bashers');
                        Roster.getRoster('hooters');
                        Roster.getRoster('mashers');
                        Roster.getRoster('stallions');
                        Roster.getRoster('rallycaps');




                    }
                    // rosters have been initialized
                    else{
                        sf1.EventBus.trigger('app.contextInitSuccess');
                    }

                    /*
                    *
                    * conceptually there should be a configuration to feed the initialization sequence
                    * to know when all of the initialization steps are complete
                    * that may be what the
                    *
                    *
                    * */





                }
            );
            // where should this live?
            sf1.EventBus.bind('roster.getRosterSuccess', function(event, roster){


                /*
                 *
                 *
                 * we got a roster back so add it to the app context array
                 * post the totals to the backend.
                 *
                 *
                 * */
                if(roster){
                    sf1.app.rosters.push(roster);
                    // post totals to server
                    var postObj = {};
                    postObj.roster = roster.slug;
                    postObj.battersTotal = roster.batterTotal;
                    postObj.startersTotal = roster.starterTotal;
                    postObj.closersTotal = roster.closerTotal;
                    postObj.total = roster.total;
                    // var postArray = [];
                    // postArray.push(postObj);




                    sf1.EventBus.trigger('stats.postRosterTotalsRequest', postObj);

                    // post totals to server
                    sf1.io.ajax({
                        type:'POST',
                        url:'/totals',
                        data:postObj,
                        success:function(response){
                            sf1.log('success posting roster total: ' + postObj.roster);
                            //                                    sf1.log(response);
                            //                                    sf1.lastUpdate = response.lastUpdate;
                            //
                        },
                        error:function(response){
                            sf1.log(response);
                        }
                    });
                }

                // rosters are ready
                if(sf1.app.rosters.length === 5){
                    // a condition has been met (all rosters have been loaded)
                    sf1.EventBus.trigger('app.contextInitSuccess');
                }
            });
        });



    }
);