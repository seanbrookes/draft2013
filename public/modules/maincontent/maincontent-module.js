/**
 * Draft 2013
 *
 * User: sean
 * Date: 24/03/13
 * Time: 11:15 PM
 *
 */
define(
    ['client','ia', 'text!/modules/maincontent/maincontent-template.html'],
    function(App, IA, markup) {
        var sf1 = App.sf1;
        sf1.log('MainContent module loaded ');

        var anchorSelector = '#TemplateContainer';

        var baseMarkup = $(markup);
        $(anchorSelector).append(baseMarkup);
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        var init = function(){

            var moduleMarkup = $('#MainContentDefaultTemplate').html();

            $('.viewport').append(moduleMarkup);

            IA.initMainNav();

            sf1.EventBus.trigger('maincontent.initComplete');
        };
        return{
            init:function(){
                return init();
            }
        };
    }
);