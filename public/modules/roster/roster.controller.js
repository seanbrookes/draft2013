/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 9:35 PM
 *
 */
define(['sf1','modules/roster/roster.models','modules/roster/roster.views','text!/modules/roster/roster.template.html'],
    function(sf1,Model,View,template){
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
    var battersSubTotal = 0;
    var startersSubTotal = 0;
    var closersSubTotal = 0;

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


    function init(rosterName){
        battersSubTotal = 0;
        startersSubTotal = 0;
        closersSubTotal = 0;

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
        $(anchorSelector).append(baseMarkup);

        sf1.log('roster module init - rosterId: ' + rosterName);


        if (rosterName){
            /*
             *
             *
             * Synch Player Model
             *
             *
             * */

            Model.synchPlayerModel(rosterSlug);
           // new PlayerCollection(response.players)


            // fire ajax query to get roster
            // call render roster with collection
        }


    }
    var setRoster = function(slug){
      rosterSlug = slug;
    };
    sf1.EventBus.bind('roster.updateRosterPlayerPos', function(data, event){
        var postObj = {};
        postObj.playerId = $(event.target).data('id');;
        postObj.propertyVal = $(event.target).val();;
        postObj.rosterSlug = rosterSlug;

        var endPoint = '/rosterpos';

        sf1.io.ajax({
            type:'PUT',
            url:endPoint,
            contentType: "application/json",
            data:JSON.stringify(postObj),
            success:function(response){
                //toggleEditOff(response.playerId,response.rosterPos);


                // get 'read' version  of the template i.e. the button
                // get the parent element
                // overwrite the contents of the parent element with read template
                // init listeners
                _.templateSettings.variable = 'S';
                var type = 'pos';
                // set the current value
                var currentVal = response.rosterPos;
                var playerId = response.playerId;
                var currentEditElement = $('#RosterPickPosSelect');
                var parentEl = $(currentEditElement).parent();
                var editModel = {};
                editModel.id = playerId;
                editModel.roster = rosterSlug;
                editModel.val = currentVal;

                //var editControl;
                var cmdTemplate = $('#RosterPosEditTriggerControlTemplate').html();
                parentEl.html(_.template(cmdTemplate,editModel));

                var btnControl = $("button[data-id='" + playerId + "'][data-type='pos']");
                //editControl.val(currentVal).focus();
                btnControl.click(function(event){
                    // if (currentVal !== $(event.target).val()){
                    sf1.EventBus.trigger('roster.editPlayerPosRequest', event);
                    // }
                });


            },
            error:function(response){
                sf1.log(JSON.stringify(response));
            }
        });
    });
    sf1.EventBus.bind('roster.editPlayerPosRequest',function(data, event){

        // get current value
        // get markup for edit control
        // replace existing control
        // set the value of the control
        // initialize event listeners
        _.templateSettings.variable = 'S';
        var type = $(event.target).data('type');
        // set the current value
        var currentVal = $(event.target).data('val');
        var playerId = $(event.target).data('id');
        var parentEl = $(event.target).parent();
        var editModel = {};
        editModel.id = playerId;
        editModel.roster = rosterSlug;
        editModel.val = currentVal;
        var editControl;
        editControl = $('#RosterEditPosControlTemplate').html();
        parentEl.html(_.template(editControl,editModel));
        editControl = $("select[data-id='" + playerId + "'][data-type='pos']");
        editControl.val(currentVal).focus();
        editControl.on('blur',function(event){
            // if (currentVal !== $(event.target).val()){
            sf1.EventBus.trigger('roster.updateRosterPlayerPos', event);
            // }
        });
        editControl.on('change',function(event){
            //  if (currentVal !== $(event.target).val()){
            sf1.EventBus.trigger('roster.updateRosterPlayerPos', event);
            //  }
        });

    });
    sf1.EventBus.bind('roster.playerModelUpdateRequest',function(){
        // update
        synchPlayerModel();
    });
    sf1.EventBus.bind('roster.playerModelUpdateSuccess',function(event, data){
        // update
        playersModel = data;
        renderRoster(playersModel);
        updateRosterDraftStatusModel();
    });


    /*
    *
    * Render Roster
    *
    * */
    var renderRoster = function(playersModel){
//        var roster = rosterslug;
//        var name;
        if (rosterSlug){
            //var rosterShell = $('#RosterTemplate').html();
            //$('.main-content-wrapper').append(rosterShell);
            // convert raw model to BB collection
//            var playersCollection = new PlayerCollection(playersModel);
//            var rosterView = new RosterView({
//                itemView: PlayerView,
//                collection: playersCollection
//            });
//            var output = rosterView.render().$el;

            if(Model.getRoster(rosterSlug)){
                var rosterObj = Model.getRoster(rosterSlug);




                var battersCollection = new Model.PlayerCollection(rosterObj.battersArray);
                var batterView = new View.BatterView({
                    collection: battersCollection
                });
                var batterOutput = batterView.render().$el;

                var startersCollection = new Model.PlayerCollection(rosterObj.startersArray);
                var starterView = new View.StarterView({
                    collection: startersCollection
                });
                var starterOutput = starterView.render().$el;
                var closersCollection = new Model.PlayerCollection(rosterObj.closersArray);
                var closerView = new View.CloserView({
                    collection: closersCollection
                });
                var closerOutput = closerView.render().$el;

                var headerOutput = '<h1 class="roster-title">' + rosterSlug + '</h1>';
                headerOutput += '<ul class="roster-scores-list">';

                headerOutput += '<li>';
                headerOutput += '<label class="roster-score-summary-label">batters: </label>' + rosterObj.batterTotal;
                headerOutput += '</li>';

                headerOutput += '<li>';
                headerOutput += '<label class="roster-score-summary-label">starters:: </label>' + rosterObj.starterTotal;
                headerOutput += '</li>';

                headerOutput += '<li>';
                headerOutput += '<label class="roster-score-summary-label">closers:: </label>' + rosterObj.closerTotal;
                headerOutput += '</li>';

                var rosterTotal = parseFloat(rosterObj.batterTotal + rosterObj.starterTotal + rosterObj.closerTotal).toFixed(2);

                headerOutput += '<li>';
                headerOutput += '<label class="roster-score-summary-label">total:: </label>' + rosterTotal;
                headerOutput += '</li>';

                headerOutput += '</ul>';


                $('.main-content-wrapper').html(headerOutput);
                $('.main-content-wrapper').append(batterOutput);
                $('.main-content-wrapper').append(starterOutput);
                $('.main-content-wrapper').append(closerOutput);

                $('.batter-total').text(rosterObj.batterTotal);
                $('.starter-total').text(rosterObj.starterTotal);
                $('.closer-total').text(rosterObj.closerTotal);
                $('.roster-total').text(rosterTotal);



                $('.roster-title').text(rosterName);

                $('.btn-cmd-editpos').click(function(event){
                    sf1.EventBus.trigger('roster.editPlayerPosRequest',event);
                });

                $('.draft-status-cmd').click(function(event){
                    event.preventDefault();
                    // get
                    var id = $(event.target).data('id');
                    var val = $(event.target).text();
                    toggleEditOn(id,val);

                });
                $('.draft-roster-cmd').click(function(event){
                    event.preventDefault();
                    // get
                    var id = $(event.target).data('id');
                    //  var val = $(event.target).text();
                    var val = rosterSlug;
                    toggleRosterEditOn(id,val);

                });
                $('.delete-roster-player').click(function(event){
                    event.preventDefault();
                    // confirm delete
                    var answer = confirm("Confirm Delete?");
                    if (answer){
                        // ajax
                        sf1.io.ajax({
                            type:'POST',
                            url:'/deleterosterplayer',
                            data:{slug:rosterSlug,playerId:$(event.target).data('id')},
                            success:function(response){
                                sf1.log('player deleted ' + response);
                                document.location.reload();
                            },
                            error:function(response){
                                sf1.log('error deleting player: ' + response);
                            }

                        })
                    }
                    // ajax delete pass id

                });
                sf1.EventBus.trigger('roster.renderRosterComplete');
                //$('.nav-main-list').i18n();

                sf1.log('| BATTER TOTAL: ' + rosterObj.batterTotal);
                sf1.log('| STARTER TOTAL: ' + rosterObj.starterTotal);
                sf1.log('| CLOSER TOTAL: ' + rosterObj.closerTotal);
                //sf1.EventBus.trigger('ia.mainNavRenderComplete');
            }

        }
    }


    /*
    *
    * Update Roster Draft Status Model
    *
    *
    * */
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










    /*
    *
    * edit controls
    *
    *
    * */
    var toggleEditOn = function(id,val){
        var selectElement = $('#StatusSelectTemplate').html();

        $('a[data-id="' + id + '"][data-type="draftstatus"]').hide();
        //$(selectElement).data('id',id);
        $('td[data-id="' + id + '"][data-type="draftstatus"]').html(selectElement);

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
    var toggleRosterEditOn = function(id,val){
        var selectElement = $('#RosterSelectTemplate').html();
        // var originalRoster = val;

        $('a[data-id="' + id + '"][data-type="playername"]').hide();
        //$(selectElement).data('id',id);
        $('td[data-id="' + id + '"][data-type="playername"]').html(selectElement);

        var selectInstance = $('td[data-id="' + id + '"]').find('.roster-select');
        selectInstance.attr('data-id',id);
        selectInstance.focus();
        selectInstance.val(val);

        $('td[data-id="' + id + '"]').find('.roster-select').on('change',function(event){
            val = event.target.value;
            // sf1.log('CHECKED!!!: ' + val);
            var rosterValue = val;
            // save value to the db

            var postObj = {};
            postObj.playerId = id;
            postObj.newRoster = rosterValue;
            postObj.rosterSlug = rosterSlug;

            sf1.io.ajax({
                type:'PUT',
                url:'/playerrosterupdate',
                contentType: "application/json",
                data:JSON.stringify(postObj),
                success:function(response){
                    sf1.log('Roster update ok, reload page');
                    init(rosterSlug);
                    //toggleEditOff(response.playerId,response.draftStatus);
                },
                error:function(response){
                    sf1.log(JSON.stringify(response));
                }
            });
        });

        $('td[data-id="' + id + '"]').find('.roster-select').on('blur',function(event){
            val = event.target.value;
            // sf1.log('CHECKED!!!: ' + val);
            var rosterValue = val;
            // save value to the db

            var postObj = {};
            postObj.playerId = id;
            postObj.newRoster = rosterValue;
            postObj.rosterSlug = rosterSlug;

            sf1.io.ajax({
                type:'PUT',
                url:'/playerrosterupdate',
                contentType: "application/json",
                data:JSON.stringify(postObj),
                success:function(response){
                    sf1.log('Roster update ok, reload page');
                    init(rosterSlug);
                    //toggleEditOff(response.playerId,response.draftStatus);
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
        $('td[data-id="' + playerId + '"]').parent().addClass(draftStatus);

        sf1.EventBus.trigger('roster.draftStateUpdateComplete');
        sf1.EventBus.trigger('roster.playerModelUpdateRequest');

    };



    return {
        init:function(rosterId){
            return init(rosterId);
        },
        setRoster:setRoster,
        getRoster:function(roster){
            Model.getRoster(roster);
        },
        getTotals:function(roster){
            setRoster(roster);
            synchPlayerModel();
            sf1.EventBus.bind('roster.playerModelUpdateSuccess',function(data){
               return {total:675,pitchers:334};
            });

        }
    };
});
