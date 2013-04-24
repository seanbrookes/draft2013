/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:10 PM
 *
 */
define(['sf1','backbone'],function(sf1,Backbone){
    var baseMarkup;
    var rosterSlug;
    var rosterName;
    var protectedCount;
    var bubbleCount;
    var droppedCount;
    var prospectCount;
    var playersModel;
    var currentAuthRoster;
    var battersSubTotal = 0;
    var startersSubTotal = 0;
    var closersSubTotal = 0;
    var allRosterArray = [];

    /*
     * Player Model / Collection
     *
     * */
    var PlayerModel = Backbone.Model.extend({});
    var PlayerCollection = Backbone.Collection.extend({
        model: PlayerModel
    });

    var RosterHeadModel = Backbone.Model.extend({});



    function compareTotals(a,b) {

        if (a.total > b.total){
            return -1;
        }
        if (a.total < b.total){
            return 1;
        }
        return 0;
    }
    var setRosterTotals = function(roster){
        var rosterTotals = {};


        var battersSubTotal = 0;
        var startersSubTotal = 0;
        var closersSubTotal = 0;
//        rosterTotals.batterTotal = 0;
//        rosterTotals.starterTotal = 0;
//        rosterTotals.closerTotal = 0;

        var battersArray = [];
        var startersArray = [];
        var closersArray = [];

        if (roster.players){

            for (var i = 0;i < roster.players.length;i++){
                if (roster.players[i].pos === 'SP'){
                    startersArray.push(roster.players[i]);
                }
                else if (roster.players[i].pos === 'RP'){
                    closersArray.push(roster.players[i]);
                }
                else{
                    battersArray.push(roster.players[i]);

                }
            }


            roster.battersArray = totalAndSortBatters(battersArray).batters;
            roster.startersArray = totalAndSortStarters(startersArray).starters;
            roster.closersArray = totalAndSortClosers(closersArray).closers;
            roster.batterTotal = totalAndSortBatters(battersArray).subTotal;
            roster.starterTotal = totalAndSortStarters(startersArray).subTotal;
            roster.closerTotal = totalAndSortClosers(closersArray).subTotal;
            roster.total = (roster.batterTotal + roster.starterTotal + roster.closerTotal);



        }
        return roster;
    };



    /*
    *
    * Get a Roster From Server
    *
    * */
    var getRoster = function(slug){
        if (slug){
            // look up the slug in the global array first

            for (var i = 0;i < sf1.app.rosters.length;i++){
                if (sf1.app.rosters[i].slug === slug){
                    //sf1.EventBus.trigger('roster.getRosterSuccess', [sf1.app.rosters[i]]);
                    return sf1.app.rosters[i];
                    break;
                }
            }

            sf1.io.ajax({
                type:'GET',
                url:'/roster/' + slug,
                success:function(response){
                    sf1.log('get roster success: ' + JSON.stringify(response));
                    //var playerCollection =  new PlayerCollection(response.players);
                    if (response[0]){

                        var rosterModel= Object.create(response[0]);
                        rosterModel = setRosterTotals(rosterModel);

                        sf1.EventBus.trigger('roster.getRosterSuccess', [rosterModel]);

                    }
                },
                error:function(response){
                    sf1.log('error getting roster: ' + JSON.stringify(response));
                }
            });
            return false;

        }

    };




    /*
    *
    *
    * Synch Player Model
    *
    *
    *
    * */
    var synchPlayerModel = function(rosterSlug){
        sf1.io.ajax({
            type:'GET',
            url:'/roster/' + rosterSlug,
            success:function(response){
                sf1.log('get roster success: ' + JSON.stringify(response));
                //var playerCollection =  new PlayerCollection(response.players);
                if (response[0]){

                    var processedModel = [];
                    for (var i = 0;i < response[0].players.length;i++){
                        var tItemModel = response[0].players[i];
                        if (!tItemModel.draftStatus){
                            tItemModel.draftStatus = 'bubble';
                        }
                        processedModel.push(tItemModel);
                    }
                    playersModel = processedModel;
                    //rosterSlug = rosterName;
                    rosterName = response[0].name;

                    sf1.EventBus.trigger('roster.playerModelUpdateSuccess', [playersModel]);



                }
            },
            error:function(response){
                sf1.log('error getting roster: ' + JSON.stringify(response));
            }
        });
    };

//    var getRoster = function(rosterSlug){
//        sf1.io.ajax({
//            type:'GET',
//            url:'/roster/' + rosterSlug,
//            success:function(response){
//                sf1.log('get roster success: ' + JSON.stringify(response));
//                //var playerCollection =  new PlayerCollection(response.players);
//                if (response[0]){
//
//                    var processedModel = [];
//                    for (var i = 0;i < response[0].players.length;i++){
//                        var tItemModel = response[0].players[i];
//                        if (!tItemModel.draftStatus){
//                            tItemModel.draftStatus = 'bubble';
//                        }
//                        processedModel.push(tItemModel);
//                    }
//                    playersModel = processedModel;
//                    //rosterSlug = rosterName;
//                    rosterName = response[0].name;
//
//                    sf1.EventBus.trigger('roster.getRosterSuccess', [playersModel]);
//
//
//
//                }
//            },
//            error:function(response){
//                sf1.log('error getting roster: ' + JSON.stringify(response));
//            }
//        });
//    };
    /*
     *
     * Batters Total
     *
     * */
    var totalBatterScore = function(player){

        player.total = ((parseInt(player.runs)) + (parseInt(player.hits) / 2) + (parseInt(player.rbi)) + (parseInt(player.hr) * 2) + (parseInt(player.sb) / 2));

        return player;

    };
    /*
     *
     * Batters Total/Sort
     *
     * */
    var totalAndSortBatters = function(originalArray){
        var battersSubTotal = 0;
        var catchersArray = [];
        var firstBArray = [];
        var twoBArray = [];
        var threeBArray = [];
        var ssArray = [];
        var lfArray = [];
        var cfArray = [];
        var rfArray = [];
        var dhArray = [];

        var returnArray = [];

        for (var i = 0;i < originalArray.length;i++){
            var player = originalArray[i];

            // add total property
            player = totalBatterScore(player);
            switch(player.pos){

                case 'C':
                    catchersArray.push(player);
                    break;
                case '1B':
                    firstBArray.push(player);

                    break;

                case '2B':
                    twoBArray.push(player);

                    break;
                case '3B':
                    threeBArray.push(player);

                    break;
                case 'SS':
                    ssArray.push(player);

                    break;
                case 'LF':
                    lfArray.push(player);

                    break;
                case 'CF':
                    cfArray.push(player);

                    break;
                case 'RF':
                    rfArray.push(player);

                    break;

                case 'DH':
                    dhArray.push(player);

                    break;
                default:

            }

        }

        // set augmented properties
        // total
        // sort
        // establish counting property
        if (catchersArray.length > 0){
            catchersArray.sort(compareTotals);
            catchersArray[0].counting = true;
            battersSubTotal += catchersArray[0].total;
        }
        if (firstBArray.length > 0){
            firstBArray.sort(compareTotals);
            firstBArray[0].counting = true;
            battersSubTotal += firstBArray[0].total;
        }
        if (twoBArray.length > 0){
            twoBArray.sort(compareTotals);
            twoBArray[0].counting = true;
            battersSubTotal += twoBArray[0].total;
        }
        if (threeBArray.length > 0){
            threeBArray.sort(compareTotals);
            threeBArray[0].counting = true;
            battersSubTotal += threeBArray[0].total;
        }
        if (ssArray.length > 0){
            ssArray.sort(compareTotals);
            ssArray[0].counting = true;
            battersSubTotal += ssArray[0].total;
        }
        if (lfArray.length > 0){
            lfArray.sort(compareTotals);
            lfArray[0].counting = true;
            battersSubTotal += lfArray[0].total;
        }
        if (cfArray.length > 0){
            cfArray.sort(compareTotals);
            cfArray[0].counting = true;
            battersSubTotal += cfArray[0].total;
        }
        if (rfArray.length > 0){
            rfArray.sort(compareTotals);
            rfArray[0].counting = true;
            battersSubTotal += rfArray[0].total;
        }
        if (dhArray.length > 0){
            dhArray.sort(compareTotals);
            dhArray[0].counting = true;
            battersSubTotal += dhArray[0].total;
        }
        /*
         *
         * Merge all the arrays
         *
         * */
        returnArray = $.merge(returnArray,catchersArray);
        returnArray = $.merge(returnArray,firstBArray);
        returnArray = $.merge(returnArray,twoBArray);
        returnArray = $.merge(returnArray,threeBArray);
        returnArray = $.merge(returnArray,ssArray);
        returnArray = $.merge(returnArray,lfArray);
        returnArray = $.merge(returnArray,cfArray);
        returnArray = $.merge(returnArray,rfArray);
        returnArray = $.merge(returnArray,dhArray);

        return ({batters:returnArray,subTotal:battersSubTotal});

    };

    /*
     *
     * Starters Total
     *
     * */
    var totalAndSortStarters = function(originalArray){
        var startersSubTotal = 0;
        for (var i = 0;i < originalArray.length;i++){
            originalArray[i].total = ((originalArray[i].wins * 15) - (originalArray[i].losses * 4) + (originalArray[i].k / 2))
        }
        originalArray.sort(compareTotals);
        if (originalArray[0]){
            originalArray[0].counting = true;
            startersSubTotal += originalArray[0].total;
        }
        if (originalArray[1]){
            originalArray[1].counting = true;
            startersSubTotal += originalArray[1].total;
        }
        if (originalArray[2]){
            originalArray[2].counting = true;
            startersSubTotal += originalArray[2].total;
        }
        if (originalArray[3]){
            originalArray[3].counting = true;
            startersSubTotal += originalArray[3].total;
        }

        return ({starters:originalArray,subTotal:startersSubTotal});
    };
    /*
     *
     * Closers Total
     *
     * */

    var totalAndSortClosers = function(originalArray){
        var closersSubTotal = 0;
        for (var i = 0;i < originalArray.length;i++){
            originalArray[i].total = ((originalArray[i].saves * 7)  + (originalArray[i].wins * 6) + (originalArray[i].k / 2) + (originalArray[i].ip / 2))
        }
        originalArray.sort(compareTotals);
        if (originalArray[0]){
            originalArray[0].counting = true;
            closersSubTotal += originalArray[0].total;
        }
        if (originalArray[1]){
            originalArray[1].counting = true;
            closersSubTotal += originalArray[0].total;
        }

        return ({closers:originalArray,subTotal:closersSubTotal});
    };
















    var rosterModel = function(){

        return{
            getRosterNav:function(){
                return [
                    {
                        url:'#/roster/hooters',
                        label:'Hooters'
                    },
                    {
                        url:'#/roster/stallions',
                        label:'Stallions'
                    },
                    {
                        url:'#/roster/bashers',
                        label:'Bashers'
                    },
                    {
                        url:'#/roster/rallycaps',
                        label:'Rally Caps'
                    },
                    {
                        url:'#/roster/mashers',
                        label:'Mashers'
                    }
                ];

            }
        };
    };

    return{
        PlayerCollection:PlayerCollection,
        getRoster:getRoster,
        synchPlayerModel:synchPlayerModel,
        RosterHeadModel:RosterHeadModel
    };
});
