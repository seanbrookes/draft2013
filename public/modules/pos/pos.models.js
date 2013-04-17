/**
 * Draft 2013
 *
 * User: sean
 * Date: 15/04/13
 * Time: 11:18 PM
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

        var PosRankModel = Backbone.Model.extend({});

        return {
            TotalCollection:TotalCollection,
            PosRankModel:PosRankModel
        };
    }
);