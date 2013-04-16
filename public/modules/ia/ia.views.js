/**
 * Draft 2013
 *
 * User: sean
 * Date: 15/04/13
 * Time: 9:30 PM
 *
 */
define(['sf1','marionette'],
    function(sf1, Marionette){

        /*
         *
         * Marionette Views
         *
         * */
        var NavItemView = Backbone.Marionette.ItemView.extend({
            template: '#NavItemTemplate',
            tagName: 'li'
        });

        /*
         * MainNavView
         *
         * */
        var MainNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-main-list nav'

        });

        /*
         * GlobalNavView
         *
         * */
        var GlobalNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-global-list nav nav-pills'

        });

        /*
         * RosterNavView
         *
         * */
        var RosterNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-roster-list'

        });
        /*
         * PosNavView
         *
         * */
        var PosNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-pos-list'

        });

        return{
            NavItemView:NavItemView,
            MainNavView:MainNavView,
            GlobalNavView:GlobalNavView,
            RosterNavView:RosterNavView,
            PosNavView:PosNavView
        };


    }
);