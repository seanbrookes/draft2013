/**
 * Draft 2013
 *
 * User: sean
 * Date: 13/04/13
 * Time: 10:58 PM
 *
 */
define(['backbone','sf1'],
    function(Backbone, sf1){

        /*
        *
        * define score models
        *
        * */
        var TotalItemModel = Backbone.Model.extend({});
        var TotalCollection = Backbone.Collection.extend({
            model: TotalItemModel
        });

        var initTotalsModel = function(){
            var batterTotals = [];
            var starterTotals = [];
            var closerTotals = [];
            var rosterTotals = [];

            for (var i = 0;i < sf1.app.rosters.length;i++){
                var cRoster = sf1.app.rosters[i];
                batterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.batterTotal});
                starterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.starterTotal});
                closerTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.closerTotal});
                rosterTotals.push({name:cRoster.name,slug:cRoster.slug,total:cRoster.total});
            }

            batterTotals.sort(sortTotal);
            starterTotals.sort(sortTotal);
            closerTotals.sort(sortTotal);
            rosterTotals.sort(sortTotal);

            return {
                overall:rosterTotals,
                batter:batterTotals,
                starter:starterTotals,
                closer:closerTotals
            };
        };


        var sortTotal = function (a,b) {

            if (a.total > b.total){
                return -1;
            }
            if (a.total < b.total){
                return 1;
            }
            return 0;
        };
        return {
            TotalCollection:TotalCollection,
            getTotals:initTotalsModel
        };
    }
);