/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:10 PM
 *
 */
define(['sf1','backbone'],function(sf1,Backbone){


    /*
     * Player Model / Collection
     *
     * */
    var PlayerModel = Backbone.Model.extend({});
    var PlayerCollection = Backbone.Collection.extend({
        model: PlayerModel
    });

    var getRosterTotals = function(roster){

    };

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
        getRosterTotals:getRosterTotals,
        synchPlayerModel:synchPlayerModel
    };
});
