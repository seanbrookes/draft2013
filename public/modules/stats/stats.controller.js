/**
 * Draft 2013
 *
 * User: sean
 * Date: 01/04/13
 * Time: 9:15 AM
 *
 */
define(['sf1','jquery','backbone','underscore','marionette','text!/modules/stats/stats.template.html'],
    function(sf1,$,Backbone,_,Marionette,template){



        $('#TemplateContainer').html(template);
        _.templateSettings.variable = 'P';


        var init = function(){

            var statsModuleContainer = $('#StatsModuleDefaultTemplate').html();
            var template = _.template(statsModuleContainer);

            var templateData = {};

            var templateMarkup = template( templateData );
            $('.main-content-wrapper').html(templateMarkup);

            initEventListeners();
            sf1.EventBus.bind('stats.initStatsEventListenersComplete',function(data){
               sf1.EventBus.trigger('stats.initStatsModuleComplete');
            });
        };

        var initEventListeners = function(){
            $('#BtnUpdateRosters').click(function(event){
               $('.control-feedback').html('<p>BtnUpdateRosters clicked</p>');
            });
            $('#BtnInitRosterScoresLink').click(function(event){
                $('.control-feedback').html('<p>BtnInitRosterScoresLink clicked</p>');
            });
            $('#BtnUpdateSingleRoster').click(function(event){
                $('.control-feedback').html('<p>BtnUpdateSingleRoster clicked</p>');
            });
            $('#BtnGetRosterPlayers').click(function(event){
                $('.control-feedback').html('<p>BtnGetRosterPlayers clicked</p>');
            });
            $('#BtnPullBatterStats').click(function(event){
                $('.control-feedback').html('<p>BtnPullBatterStats clicked</p>');
            });
            $('#BtnPullPitcherStats').click(function(event){
                $('.control-feedback').html('<p>Pull Pitcher Stats Request</p>');
                sf1.io.ajax({
                    type:'GET',
                    url:'/pullstats/pitchers',
                    success:function(response){
                        sf1.log('success pull stats');
                        //sf1.EventBus.trigger('admin.playerDataLoadComplete',[response]);
                        $('.control-feedback').append('<p>Pitcher Stats Recieved</p>');
                        $('.control-feedback').append('<p>pitchers :: total records: ' + response.metadata.totalRecords + '</p>');
                    },
                    error:function(response){
                        sf1.log('error pull stats: ' + response);
                    }
                })
            });
            $('#ProcessCurrentBatterStats').click(function(event){
                $('.control-feedback').html('<p>ProcessCurrentBatterStats clicked</p>');
                sf1.io.ajax({
                    type:'GET',
                    url:'/dobatters',
                    success:function(response){
                        sf1.log('success dobatters: ' + response);
                    },
                    error:function(response){
                        sf1.log('error dobatters: ' + response);
                    }

                });
            });
            $('#ProcessCurrentPitcherStats').click(function(event){
                $('.control-feedback').html('<p>Process Current Pitcher Stats Request</p>');

                sf1.io.ajax({
                    type:'GET',
                    url:'/dopitchers',
                    success:function(response){
                        sf1.log('success dopitchers: ' + response);
                    },
                    error:function(response){
                        sf1.log('error dopitchers: ' + response);
                    }

                });


            });

            sf1.EventBus.trigger('stats.initStatsEventListenersComplete');
        };

        return{
            init:init
        };


    }
);