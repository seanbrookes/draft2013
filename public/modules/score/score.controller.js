/**
 * Draft 2013
 *
 * User: sean
 * Date: 13/04/13
 * Time: 10:57 PM
 *
 */
define(['sf1','modules/score/score.models','modules/score/score.views','roster','text!modules/score/score.template.html'],
    function(sf1,Models, Views, Roster, template){
        var anchorSelector = '#TemplateContainer';
        _.templateSettings.variable = 'S';
        baseMarkup = $(template);
        // attach the module template markup to the DOM
        $(anchorSelector).append(baseMarkup);

        var init = function(){
            sf1.log('Score module init ');

            var scoreMainView = $('#ScoreModuleDefaultTemplate').html();
            $('.main-content-wrapper').html(scoreMainView);

            var bashers = Roster.getTotals('bashers');


            // get roster scores

            // render them in relevant views
            // show rosters as links to roster pages
            // show list of positions as links to position ranking

        };

        return{
            init:init
        };
    }
);