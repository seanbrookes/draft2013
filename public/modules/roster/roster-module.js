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
    var rosterName;
    var protectedCount;
    var bubbleCount;
    var droppedCount;
    var prospectCount;
    var playersModel;
    var currentAuthRoster;

    // namespace for var reference in template
    _.templateSettings.variable = 'S';
    var getCurrentAuthRoster = function(){
        if (sf1.hasStorage){
            return localStorage.getItem('currentAuthRoster');
        }
        else{
            return null;
        }
    };


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

        if (sf1.hasStorage){
            var testUserObj = getCurrentAuthRoster();
            if (testUserObj){
                currentAuthRoster = testUserObj;
                sf1.log('CURRENT AUTH ROSTER: ' + currentAuthRoster);
            }
            else{
                sf1.log('No auth ROSTER ');
            }
        }

        rosterSlug = rosterName;
        sf1.log('Roster module init ');

        // attach the module template markup to the DOM
        baseMarkup = $(template);
        $(anchorSelector).html(baseMarkup);

        sf1.log('roster module init - rosterId: ' + rosterName);




        if (rosterName){
            synchPlayerModel();
           // new PlayerCollection(response.players)


            // fire ajax query to get roster
            // call render roster with collection
        }



    }
    sf1.EventBus.bind('roster.playerModelUpdateRequest',function(){
        // update
        synchPlayerModel();
    });
    sf1.EventBus.bind('roster.playerModelUpdate',function(){
        // update
        renderRoster();
        updateRosterDraftStatusModel();
    });
    var synchPlayerModel = function(callback){
        sf1.io.ajax({
            type:'GET',
            url:'/roster/' + rosterSlug,
            success:function(response){
                sf1.log('get roster success: ' + JSON.stringify(response));
                //var playerCollection =  new PlayerCollection(response.players);
                if (response[0]){

                    playersModel = response[0].players;
                    //rosterSlug = rosterName;
                    rosterName = response[0].name;

                    sf1.EventBus.trigger('roster.playerModelUpdate');


                }
            },
            error:function(response){
                sf1.log('error getting roster: ' + JSON.stringify(response));
            }
        });
    };
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
    var updateRosterDraftStatusModel = function(){
        protectedCount = 0;
        bubbleCount = 0;
        droppedCount = 0;
        prospectCount = 0;
        // get model (roster object)
        // iterate and count up the totals
        //var playersCollectionModel = playersModel;
        for (var i = 0;i < playersModel.length;i++){
            var player = playersModel[i];
            if (player.draftStatus === 'protected'){
                protectedCount++;
            }
            if (player.draftStatus === 'bubble'){
                bubbleCount++;
            }
            if (player.draftStatus === 'dropped'){
                droppedCount++;
            }
            if (player.draftStatus === 'prospect'){
                prospectCount++;
            }
            var xyz = 'abc';
            //sf1.log('end of calculation');
        }
        // update dashboard

        var protectedGaugeDOMEl = $('.protected-item-display-guage-container .gauge-value');
        protectedGaugeDOMEl.text(protectedCount);

        if (protectedCount > 14){
            protectedGaugeDOMEl.addClass('instrument-over-threshold');
            protectedGaugeDOMEl.removeClass('instrument-within-threshold');

        }
        else{
            protectedGaugeDOMEl.removeClass('instrument-over-threshold');
            protectedGaugeDOMEl.addClass('instrument-within-threshold');

        }
        $('.bubble-item-display-guage-container .gauge-value').text(bubbleCount);
        $('.dropped-item-display-guage-container .gauge-value').text(droppedCount);

        // Protected gauge render
        var prospectGaugeDOMEl = $('.prospect-item-display-guage-container .gauge-value');
        prospectGaugeDOMEl.text(prospectCount);
        if (prospectCount > 1){
            prospectGaugeDOMEl.addClass('instrument-over-threshold');
            prospectGaugeDOMEl.removeClass('instrument-within-threshold');

        }
        else{
            prospectGaugeDOMEl.removeClass('instrument-over-threshold');
            prospectGaugeDOMEl.addClass('instrument-within-threshold');

        }

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

        sf1.EventBus.trigger('roster.draftStateUpdateComplete');
        sf1.EventBus.trigger('roster.playerModelUpdateRequest');
        //updateRosterDraftStatusModel();
        // recalculate the totals





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
    var renderRoster = function(){
//        var roster = rosterslug;
//        var name;
        if (rosterSlug){
            var rosterShell = $('#RosterTemplate').html();
            $('.main-content-wrapper').html(rosterShell);
            // convert raw model to BB collection
            var playersCollection = new PlayerCollection(playersModel);
            var rosterView = new RosterView({
                itemView: PlayerView,
                collection: playersCollection
            });
            var output = rosterView.render().$el;
            $('.roster-container .navbar-inner').html(output);
            $('.roster-title').text(rosterName);
            $('.draft-status-cmd').click(function(event){
                event.preventDefault();
               // get
                var id = $(event.target).data('id');
                var val = event.target.value;
                toggleEditOn(id,val);

            });

            sf1.EventBus.trigger('roster.renderRosterComplete');
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
