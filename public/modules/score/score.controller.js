/**
 * Draft 2013
 *
 * User: sean
 * Date: 13/04/13
 * Time: 10:57 PM
 *
 */
define(['sf1','modules/score/score.models','modules/score/score.views','roster','text!modules/score/score.template.html'],
    function(sf1, Model, View, Roster, template){
        var anchorSelector = '#TemplateContainer';

        _.templateSettings.variable = 'S';
        baseMarkup = $(template);
        // attach the module template markup to the DOM
        $(anchorSelector).append(baseMarkup);


        var initSideNav = function(){
//            if (sf1.app.rosters.length !== 5){
//                sf1.rosters = [];
//                Roster.getRoster('bashers');
//                Roster.getRoster('hooters');
//                Roster.getRoster('mashers');
//                Roster.getRoster('stallions');
//                Roster.getRoster('rallycaps');
//                sf1.EventBus.bind('roster.getRosterSuccess', function(event, roster){
//
//                    if(roster){
//                        sf1.rosters.push(roster);
//
//                    }
//                    if(sf1.rosters.length > 4){
//                        sf1.EventBus.trigger('score.rostersArrayLoaded');
//
//                    }
//                });
//            }

            if(sf1.app.rosters.length === 5){
                var batterTotals = [];
                var starterTotals = [];
                var closerTotals = [];
                var rosterTotals = [];

                for (var i = 0;i < sf1.rosters.length;i++){
                    var cRoster = sf1.rosters[i];
                    batterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.batterTotal});
                    starterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.starterTotal});
                    closerTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.closerTotal});
                    rosterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.total});
                }

                batterTotals.sort(sortTotal);
                starterTotals.sort(sortTotal);
                closerTotals.sort(sortTotal);
                rosterTotals.sort(sortTotal);


                var rosterTotalCollection = new Model.TotalCollection(rosterTotals);
                var rosterTotalView = new View.RosterTotalView({
                    collection: rosterTotalCollection
                });
                var batterTotalCollection = new Model.TotalCollection(batterTotals);
                var batterTotalView = new View.BatterTotalView({
                    collection: batterTotalCollection
                });
                var starterTotalCollection = new Model.TotalCollection(starterTotals);
                var starterTotalView = new View.StarterTotalView({
                    collection: starterTotalCollection
                });
                var closerTotalCollection = new Model.TotalCollection(closerTotals);
                var closerTotalView = new View.CloserTotalView({
                    collection: closerTotalCollection
                });
                //var totalOutput = rosterTotalView.render().$el;
                //var scoreMainView = $('#ScoreModuleDefaultTemplate').html();

                var layout = new View.ScoreSummaryLayout();
                // layout.render();
                SF1.mainContentRegion.show(layout);

                var outputMarkup = '';


                outputMarkup += rosterTotalView.render.$el;

//                layout.battersRegion.show(batterTotalView);
//                layout.startersRegion.show(starterTotalView);
//                layout.closersRegion.show(closerTotalView);
                $('#SideBar').append(outputMarkup);
            }
        };

        var init = function(){
            sf1.log('Score module init ');



//            if (sf1.rosters.length !== 5){
//                sf1.rosters = [];
//                Roster.getRoster('bashers');
//                Roster.getRoster('hooters');
//                Roster.getRoster('mashers');
//                Roster.getRoster('stallions');
//                Roster.getRoster('rallycaps');
//                sf1.EventBus.bind('roster.getRosterSuccess', function(event, roster){
//
//                    if(roster){
//                        sf1.rosters.push(roster);
//                    }
//                    if(sf1.rosters.length > 4){
//                        sf1.EventBus.trigger('score.rostersArrayLoaded');
//
//                    }
//                });
//            }

            if(sf1.app.rosters.length === 5){
                var batterTotals = [];
                var starterTotals = [];
                var closerTotals = [];
                var rosterTotals = [];

                for (var i = 0;i < sf1.rosters.length;i++){
                    var cRoster = sf1.rosters[i];
                    batterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.batterTotal});
                    starterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.starterTotal});
                    closerTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.closerTotal});
                    rosterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.total});
                }

                batterTotals.sort(sortTotal);
                starterTotals.sort(sortTotal);
                closerTotals.sort(sortTotal);
                rosterTotals.sort(sortTotal);


                var rosterTotalCollection = new Model.TotalCollection(rosterTotals);
                var rosterTotalView = new View.RosterTotalView({
                    collection: rosterTotalCollection
                });
                var batterTotalCollection = new Model.TotalCollection(batterTotals);
                var batterTotalView = new View.BatterTotalView({
                    collection: batterTotalCollection
                });
                var starterTotalCollection = new Model.TotalCollection(starterTotals);
                var starterTotalView = new View.StarterTotalView({
                    collection: starterTotalCollection
                });
                var closerTotalCollection = new Model.TotalCollection(closerTotals);
                var closerTotalView = new View.CloserTotalView({
                    collection: closerTotalCollection
                });
                //var totalOutput = rosterTotalView.render().$el;
                //var scoreMainView = $('#ScoreModuleDefaultTemplate').html();

                var layout = new View.ScoreSummaryLayout();
                // layout.render();
                SF1.mainContentRegion.show(layout);
                layout.overallRegion.show(rosterTotalView);
                layout.battersRegion.show(batterTotalView);
                layout.startersRegion.show(starterTotalView);
                layout.closersRegion.show(closerTotalView);
                //$('.main-content-wrapper').html(totalOutput);
            }
        };

        var summaryView = function(){

            var totals = Model.getTotals();
            var rosterTotalCollection = new Model.TotalCollection(totals.overall);
            var rosterTotalView = new View.RosterTotalView({
                collection: rosterTotalCollection
            });
            var batterTotalCollection = new Model.TotalCollection(totals.batter);
            var batterTotalView = new View.BatterTotalView({
                collection: batterTotalCollection
            });
            var starterTotalCollection = new Model.TotalCollection(totals.starter);
            var starterTotalView = new View.StarterTotalView({
                collection: starterTotalCollection
            });
            var closerTotalCollection = new Model.TotalCollection(totals.closer);
            var closerTotalView = new View.CloserTotalView({
                collection: closerTotalCollection
            });
            //var totalOutput = rosterTotalView.render().$el;
            //var scoreMainView = $('#ScoreModuleDefaultTemplate').html();

            var layout = new View.ScoreSummaryLayout();

            layout.overallRegion.show(rosterTotalView);
            layout.battersRegion.show(batterTotalView);
            layout.startersRegion.show(starterTotalView);
            layout.closersRegion.show(closerTotalView);

            return layout;

            // return marionette layout view - score summary
        };


        sf1.EventBus.bind('score.rostersArrayLoaded',function(){





        });

        function sortTotal(a,b) {

            if (a.total > b.total){
                return -1;
            }
            if (a.total < b.total){
                return 1;
            }
            return 0;
        }
        return{
            init:init,
            initSideNav:initSideNav,
            SummaryView:summaryView
        };
    }
);