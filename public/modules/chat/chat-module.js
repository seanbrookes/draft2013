/**
 * Draft 2013
 *
 * User: sean
 * Date: 25/03/13
 * Time: 8:23 AM
 *
 */
define(
    ['client','chatlib','text!/modules/chat/chat-template.html'],
    function(App, ChatLib, markup) {

        var sf1 = App.sf1;
        var currentAuthRoster;



        var getCurrentAuthRoster = function(){
            if (sf1.hasStorage){
                return localStorage.getItem('currentAuthRoster');
            }
            else{
                return null;
            }
        };

        sf1.log('Chat module loaded ');

        var anchorSelector = '#TemplateContainer';
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        function init(){

            sf1.log('Chat module init');
            var baseMarkup = $(markup);
            $(anchorSelector).html(baseMarkup);

            var chatModuleContainer = $('script#ChatModuleDefaultTemplate').html();

            var template = _.template(chatModuleContainer);

            var templateData = {};

            var templateMarkup = template( templateData );
            $('.main-content-wrapper').append(templateMarkup);


            if (sf1.hasStorage){
                currentAuthRoster = getCurrentAuthRoster();
               // sf1.log('CURRENT AUTH ROSTER: ' + currentAuthRoster);
            }

            ChatLib.init();

        }

        return {
            init:function(){
                return init();
            }
        };
    }
);