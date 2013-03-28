/**
 * Draft 2013
 *
 * User: sean
 * Date: 24/03/13
 * Time: 7:34 PM
 *
 */
define(
    ['client','text!/modules/draft/draft-template.html'],
    function(App, markup) {
        var sf1 = App.sf1;
        //sf1.log('Draft module loaded ');
        Backbone.Marionette.TemplateCache.clear()
        var anchorSelector = '#TemplateContainer';
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        /*
        *
        *
        *
        *
        *
        *
        *
        *   AUTHENTICATION CODE
        *
        *
        *
        * */
        var currentAuthRoster;

        var userDictionary = [
            {
                roster:'stallions',
                uuid:'514bd7469388c80200000023',
                owner:'Brent',
                email:'brentfromvan@hotmail.com'
            },
            {
                roster:'mashers',
                uuid:'514bd75b9388c80200000084',
                owner:'Chris',
                email:'jcmaeland@bigpond.com'
            },
            {
                roster:'hooters',
                uuid:'514bd73c9388c80200000002',
                owner:'Kevin',
                email:'kevin.pedersen@alumni.uvic.ca'
            },
            {
                roster:'rallycaps',
                uuid:'514bd7579388c80200000063',
                owner:'Russ',
                email:'russellm@clearwaternow.ca'
            },
            {
                roster:'bashers',
                uuid:'514bd7499388c80200000042',
                owner:'Sean',
                email:'seanbrookes@shaw.ca'
            }
        ];
        var getUser = function(uuid){
            var retVal;
            for (var i = 0;i < userDictionary.length;i++){
                if (userDictionary[i].uuid === uuid){
                    retVal = userDictionary[i];
                    return retVal;
                }
            }
            return retVal;
        };
        var getCurrentAuthRoster = function(){
            if (sf1.hasStorage){
                return localStorage.getItem('currentAuthRoster');
            }
            else{
                return null;
            }
        };
        /*
        *
        *
        * END AUTH CODE
        *
        *
        *
        * */
        var baseMarkup = $(markup);
        $(anchorSelector).append(baseMarkup);
        /*
         * Draft Pick Item Model / Collection
         *
         * */
        var DraftPickModel = Backbone.Model.extend({});
        var DraftPickCollection = Backbone.Collection.extend({
            model: DraftPickModel
        });
        /*
         *
         * Marionette Views
         *
         * */
        var DraftPickView = Backbone.Marionette.ItemView.extend({
            template: '#DraftPickTemplate',
            tagName: 'tr'

        });

        /*
         * DraftTableView
         *
         * */
        var DraftTableView = Backbone.Marionette.CollectionView.extend({
            tagName: 'table',
            itemView: DraftPickView,
            className: 'draft-table ui-table'

        });



        function init(uuid){
            if (uuid){
                //sf1.log('checking user id: '  + uuid);
                // look up uuid in dictionary
                var currentUser = getUser(uuid);
                if (currentUser){
                    if (sf1.hasStorage){
                        //sf1.log('has local storage support - setting values: ' + JSON.stringify(currentUser));
                        // set storage variables
                        localStorage.setItem('currentAuthRoster', JSON.stringify(currentUser));
                        sf1.EventBus.trigger('user.setNewAuthUser');
                        document.location.href = '/';

                    }
                    else{
                        sf1.log('no localstorage support - send email to admin');
                        // send email indicating there is a problem with localstorage
                    }
                }
                // check if localstorage available
                // set the local storage value
            }
           // sf1.log('Draft module init');

            var draftModuleContainer = $('script#DraftModuleContainer').html();

            var template = _.template(draftModuleContainer);

            var templateData = {};

            var templateMarkup = template( templateData );
            $('.main-content-wrapper').append(templateMarkup);


            if (sf1.hasStorage){
                currentAuthRoster = getCurrentAuthRoster();
               // sf1.log('CURRENT AUTH ROSTER: ' + currentAuthRoster);
            }


            /*
            *
            * DRAFT BOARD
            *
            *
            * */
















            // initial draft board header row

           // var markupOutput = '<tr><th>round</th><th>pick</th><th>roster</th><th>player</th><th>pos</th><th>team</th></tr>';


            var testTemplate = $('#DraftPickTemplate').html();
            var xyz = testTemplate;

            sf1.EventBus.bind('roster.editPropertyComplete', function(data,event){
                var type = data.type;
                var tEvent = event;
                var editModel = {};
                editModel.id = $(event.target).data('id');
                editModel.val = $(event.target).val();
                editModel.type = type;
                // revert back to link
                editTemplate = $('#DraftPickEditTriggerControlTemplate').html();
                var parentEl = $(event.target).parent();
                parentEl.html(_.template(editTemplate,editModel));
                sf1.EventBus.trigger('roster.initEditToggleListeners');

            });

            sf1.EventBus.bind('roster.updatePlayerProperty',function(data,event){
                var route = '/pick' + data.type;
                var pickId = $(event.target).data('id');
                var propertyVal = $(event.target).val();
                var updateObj = {};
                updateObj.draftPickId = pickId;
                updateObj.propertyVal = propertyVal;
                sf1.io.ajax({
                    type:'PUT',
                    url:route,
                    data:updateObj,
                    success:function(response){
                        sf1.log('updated the property: ' + response);
                        sf1.EventBus.trigger('roster.editPropertyComplete',[event,updateObj]);
                    },
                    error:function(response){
                        sf1.log('ERRER: updating the property: ' + response);
                    }
                });
            });


            sf1.EventBus.bind('roster.editPlayerPropertyRequest',function(data,event){
                if ($(event.target).data('id')){
                    _.templateSettings.variable = 'S';
                    var abc = data;
                    var type = data.type;

                    //sf1.log('request to render an edit control');
                    // set the current value
                    var currentVal = $(event.target).data('val');
                    var pickId = $(event.target).data('id');
                    var parentEl = $(event.target).parent();
                    var editModel = {};
                    editModel.id = pickId;
                    editModel.val = currentVal;
                    var editTempalte = null;
                    // render the edit control for the property
                    switch(type){
                        case 'roster':
                            // render roster edit control
                            editTemplate = $('#DraftPickEditRosterControlTemplate').html();
                            parentEl.html(_.template(editTemplate,editModel));
                            var editControl = $("select[data-id='" + pickId + "']");
                            editControl.val(currentVal).focus();
                            editControl.on('blur',function(event){
                              // if (currentVal !== $(event.target).val()){
                                   sf1.EventBus.trigger('roster.updatePlayerProperty',[event,'roster' ]);
                              // }
                            });
                            editControl.on('change',function(event){
                              //  if (currentVal !== $(event.target).val()){
                                   sf1.EventBus.trigger('roster.updatePlayerProperty',[event,'roster']);
                             //  }
                            });

                            break;
                        case 'name':
                            // render name edit control
                            break;
                        case 'pos':
                            // render pos control
                            break;
                        case 'team':
                            // render team control



                            editTemplate = $('#DraftPickEditTeamControlTemplate').html();
                            parentEl.html(_.template(editTemplate,editModel));
                            var editControl = $("select[data-id='" + pickId + "']");
                            editControl.val(currentVal).focus();
                            editControl.on('blur',function(event){
                                // if (currentVal !== $(event.target).val()){
                                sf1.EventBus.trigger('roster.updatePlayerProperty',[event,type ]);
                                // }
                            });
                            editControl.on('change',function(event){
                                //  if (currentVal !== $(event.target).val()){
                                sf1.EventBus.trigger('roster.updatePlayerProperty',[event,type]);
                                //  }
                            });
                        default:
                    }
                    // set the current value of the control
                    // set the event listener
                    // trigger update event when ready


                }
                else{
                    sf1.log('request to edit player property with no reference id');
                }

                // get record id
                // hide button
                // show edit control
                // set value to current value
                // ensure the id is set
                // call update on the server - AJAX
                // - url to call
                // handle response
                // - error - reset back to value with log entry
                // - success - reset ui back to button with updated model/value
            });
            // get the draft model
            sf1.io.ajax({
                type:'GET',
                url:'/draft',
                success:function(response){

                    var abc = testTemplate;
                    var ttt = abc;

                    var resObj = response;
                    var draftList = resObj[0].picks;
                   // sf1.log('success: ' + JSON.stringify(response));

                    var draftTableView = new DraftTableView({
                        collection: new DraftPickCollection(draftList),
                        onItemAdded: function(itemView){
                            //sf1.log('ITEM ADDED');
                        }
                    });
                    //draftTableView.render();
                    $('.draft-module-container').append(draftTableView.render().$el);

                    $(".draft-table tr:nth-child(10n)").addClass("even-round")
                        .prev().addClass("even-round")
                        .prev().addClass("even-round")
                        .prev().addClass("even-round")
                        .prev().addClass("even-round");

                    sf1.EventBus.trigger('roster.initEditToggleListeners');


                },
                error:function(response){
                    //sf1.log('error: ' + JSON.stringify(response));
                }



            });


//			var editor = ace.edit("editor");
//			editor.setTheme("ace/theme/monokai");
//			editor.getSession().setMode("ace/mode/javascript");
        }
        sf1.EventBus.bind('roster.initEditToggleListeners',function(event){
            $('.btn-cmd-editroster').click(function(event){
                sf1.EventBus.trigger('roster.editPlayerPropertyRequest',[event,'roster']);
                sf1.log('edit roster: ' + $(event.target).data('id'));

            });
            $('.btn-cmd-editname').click(function(event){
                sf1.EventBus.trigger('roster.editPlayerPropertyRequest',[event,'name']);
                sf1.log('edit name: ' + $(event.target).data('id'));
            });
            $('.btn-cmd-editpos').click(function(event){
                sf1.EventBus.trigger('roster.editPlayerPropertyRequest',[event,'pos']);
                sf1.log('edit pos: ' + $(event.target).data('id'));
            });
            $('.btn-cmd-editteam').click(function(event){
               // sf1.EventBus.trigger('roster.editPlayerPropertyRequest',[event,'team']);
                sf1.log('edit team: ' + $(event.target).data('id'));
            });
        });
        return {
            init:function(uuid){
                return init(uuid);
            }
        };
    }
);