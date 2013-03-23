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
    var rosterSlug;

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
        tagName: 'tr'
    });

    /*
     * RosterView
     *
     * */
    var RosterView = Backbone.Marionette.CollectionView.extend({
        tagName: 'table',
        className: 'player-list'

    });









    function init(rosterName){

        rosterSlug = rosterName;
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
                    //var playerCollection =  new PlayerCollection(response.players);
                    if (response[0]){
                        renderRoster(response[0].name,response[0].players);
                    }
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
    var toggleEditOn = function(id,val){
        var selectElement = $('#StatusSelectTemplate').html();

        $('a[data-id="' + id + '"]').hide();
        //$(selectElement).data('id',id);
        $('td[data-id="' + id + '"]').html(selectElement);

        var selectInstance = $('td[data-id="' + id + '"]').find('.status-select');
        selectInstance.attr('data-id',id);
        selectInstance.focus();
        selectInstance.val(val);

        $('td[data-id="' + id + '"]').find('.status-select').on('change',function(event){
            val = event.target.value;
           // sf1.log('CHECKED!!!: ' + val);
            var statusValue = val;
            // save value to the db

            var postObj = {};
            postObj.playerId = id;
            postObj.draftStatus = statusValue;
            postObj.rosterSlug = rosterSlug;

            sf1.io.ajax({
                type:'PUT',
                url:'/statusupdate',
                contentType: "application/json",
                data:JSON.stringify(postObj),
                success:function(response){
                    toggleEditOff(response.playerId,response.draftStatus);
                },
                error:function(response){
                    sf1.log(JSON.stringify(response));
                }
            });
        });

        $('td[data-id="' + id + '"]').find('.status-select').on('blur',function(event){
            val = event.target.value;
           // sf1.log('CHECKED!!!: ' + val);
            var statusValue = val;
            // save value to the db

            var postObj = {};
            postObj.playerId = id;
            postObj.draftStatus = statusValue;
            postObj.rosterSlug = rosterSlug;

            sf1.io.ajax({
                type:'PUT',
                url:'/statusupdate',
                contentType: "application/json",
                data:JSON.stringify(postObj),
                success:function(response){
                    toggleEditOff(response.playerId,response.draftStatus);
                },
                error:function(response){
                    sf1.log(JSON.stringify(response));
                }
            });
        });



    };
    var toggleEditOff = function(playerId,draftStatus){

       // sf1.log(JSON.stringify(response));

        // get value
        var draftStatus = draftStatus;
        var playerId = playerId;
        // get id
        // turn off the select
        selectElement = $('#StatusSelectTemplate').html();
        // turn on the link
        var linkString = '<a data-id="' + playerId + '">' + draftStatus + '</a>';

        $('td[data-id="' + playerId + '"]').html(linkString).click(function(event){
            toggleEditOn(playerId,draftStatus);
        });
//        $(linkString).on('click',function(event){
//
//        }).show();














//        var selectElement = $('#StatusSelectTemplate').html();
//
//        $('a[data-id="' + playerId + '"]').hide();
//        //$(selectElement).data('id',id);
//        $('td[data-id="' + playerId + '"]').html(selectElement);
//        $('td[data-id="' + playerId + '"]').find('.status-select').attr('data-id',playerId);
//
//        $('td[data-id="' + playerId + '"]').find('.status-select').on('change',function(event){
//            sf1.log('CHECKED!!!: ' + draftStatus);
//            var statusValue = draftStatus;
//            // save value to the db
//
//            var postObj = {};
//            postObj.playerId = playerId;
//            postObj.draftStatus = statusValue;
//            postObj.rosterSlug = rosterSlug;
//
//            sf1.io.ajax({
//                type:'PUT',
//                url:'/statusupdate',
//                contentType: "application/json",
//                data:JSON.stringify(postObj),
//                success:function(response){
//                    sf1.log(JSON.stringify(response));
//
//                    // get value
//                    var draftStatus = response.draftStatus;
//                    var playerId = response.playerId;
//                    // get id
//                    // turn off the select
//                    selectElement = $('#StatusSelectTemplate').html();
//                    // turn on the link
//                    var linkString = '<a data-id="' + playerId + '">' + draftStatus + '</a>';
//                    $('td[data-id="' + playerId + '"]').html(linkString);
//                    $(linkString).on('click',toggleEditOn);
//                },
//                error:function(response){
//                    sf1.log(JSON.stringify(response));
//                }
//            });
//        });
    };
    var renderRoster = function(name, roster){
        if (roster && name){
            var rosterShell = $('#RosterTemplate').html();
            $('.main-content-wrapper').html(rosterShell);

            var rosterView = new RosterView({
                itemView: PlayerView,
                collection: new PlayerCollection(roster)
            });
            var output = rosterView.render().$el;
            $('.roster-container .navbar-inner').html(output);
            $('.roster-title').text(name);
            $('.draft-status-cmd').click(function(event){
                event.preventDefault();
               // get
                var id = $(event.target).data('id');
                var val = event.target.value;
                toggleEditOn(id,val);

            });

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
