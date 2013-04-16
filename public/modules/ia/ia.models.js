/**
 * Draft 2013
 *
 * User: sean
 * Date: 15/04/13
 * Time: 9:30 PM
 *
 */
define(['sf1','backbone'],

    function(sf1,Backbone){

        /*
         * Nav Item Model / Collection
         *
         * */
        var NavItemModel = Backbone.Model.extend({});
        var NavItemCollection = Backbone.Collection.extend({
            model: NavItemModel
        });

        return{
            NavItemCollection:NavItemCollection
        };

    }
);