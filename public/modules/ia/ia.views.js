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
            tagName: 'li',
            className: 'secondary-nav-item',
            onRender: function(model){
                $(this.el).attr('data-route', model.model.attributes.name.toLowerCase());

            }
        });
        var RosterNavItemView = Backbone.Marionette.ItemView.extend({
            template: '#RosterNavItemTemplate',
            tagName: 'tr',
            className: 'secondary-nav-item',
            onRender: function(model){
                var rosterName = model.model.attributes.slug;
                $(this.el).attr('data-route',rosterName);
            }
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
        var RosterNavView = Backbone.Marionette.CompositeView.extend({
            itemView: RosterNavItemView,
            itemViewContainer: 'tbody',
            className: 'nav-roster-list secondary-nav',
            template:'#RosterNavigation'
        });
        /*
         * PosNavView
         *
         * */
        var PosNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-pos-list  secondary-nav'

        });

        return{
            NavItemView:NavItemView,
            MainNavView:MainNavView,
            GlobalNavView:GlobalNavView,
            RosterNavView:RosterNavView,
            RosterNavItemView:RosterNavItemView,
            PosNavView:PosNavView
        };


    }
);