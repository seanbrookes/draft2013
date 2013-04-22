/**
 * Draft 2013
 *
 * User: sean
 * Date: 15/04/13
 * Time: 11:18 PM
 *
 */
define(['sf1','modules/pos/pos.models','modules/pos/pos.views','text!modules/pos/pos.template.html'],
    function(sf1, Model, View, template){


        _.templateSettings.variable = 'S';



        //var sf1 = App.sf1;
        var anchorSelector = '#TemplateContainer';

        // attach the module template markup to the DOM
        var baseMarkup = $(template);
        $(anchorSelector).append(baseMarkup);
        function sortTotal(a,b) {

            if (a.total > b.total){
                return -1;
            }
            if (a.total < b.total){
                return 1;
            }
            return 0;
        }
        var init = function(pos){

            var playerArray = [];

            if (pos){
                // single pos
                var rankInt = 1;
                for (var i = 0;i < sf1.app.rosters.length;i++){
                    var curRoster = sf1.app.rosters[i];
                    for (var j = 0;j < curRoster.players.length;j++){
                        var curPlayer = curRoster.players[j];
                        if (curPlayer.pos.toLowerCase() === pos.toLowerCase()){
                            curPlayer.roster = curRoster.slug;
                            playerArray.push(curPlayer);
                            rankInt++;
                        }
                    }
                }
                playerArray.sort(sortTotal);
                for (var j = 0;j < playerArray.length;j++){
                    playerArray[j].rank = j + 1;
                }
                // loop through the rosters
                // filter out the list of the position
                // build array
                // sort total
                // render the total


                var mainView;
                var posTotalCollection = new Model.TotalCollection(playerArray);

                if (pos.toLowerCase() === 'sp'){
                    mainView = new View.StarterView({
                        collection: posTotalCollection
                    });

                }
                else if (pos.toLowerCase() === 'rp'){
                    mainView = new View.CloserView({
                        collection: posTotalCollection
                    });

                }
                else{
                    mainView = new View.BatterView({
                        model:new Model.PosRankModel({pos:pos}),
                        collection: posTotalCollection
                    });
                }

                // layout.render();
                SF1.mainContentRegion.show(mainView);



            }
            else{
                // all positions
            }
        };

        return {
            init:init
        }

    }
);