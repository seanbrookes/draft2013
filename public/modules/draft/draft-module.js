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

            var markupOutput = '<tr><th>round</th><th>pick</th><th>roster</th><th>player</th><th>pos</th><th>team</th></tr>';


            var testTemplate = $('#DraftPickTemplate').html();
            var xyz = testTemplate;


            // get the draft model
            sf1.io.ajax({
                type:'GET',
                url:'/draft',
                success:function(response){

                    var abc = testTemplate;
                    var ttt = abc;

                    var resObj = response;
                    var draftList = resObj[0].picks;
                    sf1.log('success: ' + JSON.stringify(response));

                    var draftTableView = new DraftTableView({
                        collection: new DraftPickCollection(draftList)
                    });
                    //draftTableView.render();
                    $('.draft-module-container').append(draftTableView.render().$el);





//                    var nameVal = '', posVal = '', teamVal = '';
//                    for (var i = 0;i < draftList.length;i++){
//                        var x = draftList[i];
//                        if (x.name){
//                            nameVal = x.name;
//                        }
//                        if (x.team){
//                            teamVal = x.team;
//                        }
//                        if (x.pos){
//                            posVal = x.pos;
//                        }
//                        /*
//                        *
//                        *
//                        * draft pick row
//                        *
//                        *
//                        *
//                        * */
//                        markupOutput += '<tr>';
//                        markupOutput += '<td>' + x.round + '</td>';
//                        markupOutput += '<td>' + x.pickNumber + '</td>';
//                        markupOutput += '<td>' + x.roster + '</td>';
//                        markupOutput += '<td>' + nameVal + '</td>';
//                        markupOutput += '<td>' + posVal + '</td>';
//                        markupOutput += '<td>' + teamVal + '</td>';
//                        markupOutput += '</tr>';
//                    }
//                    $('#DraftTable').html(markupOutput);
                },
                error:function(response){
                    sf1.log('error: ' + JSON.stringify(response));
                }



            });


//			var editor = ace.edit("editor");
//			editor.setTheme("ace/theme/monokai");
//			editor.getSession().setMode("ace/mode/javascript");
        }
        return {
            init:function(uuid){
                return init(uuid);
            }
        };
    }
);