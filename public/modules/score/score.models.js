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


        return {
            TotalCollection:TotalCollection
        }
    }
);