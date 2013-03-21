/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 9:35 PM
 *
 */
define(['sf1','jquery','backbone','underscore','marionette','text!/modules/roster/roster-template.html'],
    function(sf1,$,Backbone,_,Marionette,template){
    var anchorSelector = '#TemplateContainer';
    var baseMarkup;

    // namespace for var reference in template
    _.templateSettings.variable = 'S';



    /*
     * Player Model / Collection
     *
     * */
    var PlayerModel = Backbone.Model.extend({});
    var PlayerCollection = Backbone.Collection.extend({
        model: PlayerModel
    });
    /*
     *
     * Marionette Views
     *
     * */
    var PlayerView = Backbone.Marionette.ItemView.extend({
        template: '#PlayerTemplate',
        tagName: 'li'
    });

    /*
     * RosterView
     *
     * */
    var RosterView = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'player-list'

    });









    function init(rosterName){


        sf1.log('Roster module init ');

        // attach the module template markup to the DOM
        baseMarkup = $(template);
        $(anchorSelector).html(baseMarkup);

        sf1.log('roster module init - rosterId: ' + rosterName);




        if (rosterName){

            sf1.io.ajax({
                type:'GET',
                url:'/roster/' + rosterName,
                success:function(response){
                    sf1.log('get roster success: ' + JSON.stringify(response));
                    var playerCollection =  new PlayerCollection(response.players);
                    renderRoster(response[0].players);
                },
                error:function(response){
                    sf1.log('error getting roster: ' + JSON.stringify(response));
                }
            });
           // new PlayerCollection(response.players)


            // fire ajax query to get roster
            // call render roster with collection
        }



    }
    var renderRoster = function(roster){
        if (roster){
            var rosterShell = $('#RosterTemplate').html();
            $('.main-content-wrapper').html(rosterShell);

            var rosterView = new RosterView({
                itemView: PlayerView,
                collection: new PlayerCollection(roster)
            });
            var output = rosterView.render().$el;
            $('.roster-container .navbar-inner').html(output);

            //$('.nav-main-list').i18n();

            //sf1.EventBus.trigger('ia.mainNavRenderComplete');
        }
    }
    return {
        init:function(rosterId){
            return init(rosterId);
        }
    };
});
