/**
 * Draft 2013
 *
 * User: sean
 * Date: 24/03/13
 * Time: 10:49 PM
 *
 */
define(
    ['jquery', 'client','ia', 'countdown', 'text!/modules/pageheader/pageheader-template.html'],
    function($, App, IA, countdown, markup) {
        var sf1 = App.sf1;
        sf1.log('PageHeader module loaded ');

        var anchorSelector = '#TemplateContainer';
        var baseMarkup = $(markup);
        $(anchorSelector).append(baseMarkup);
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        var init = function(){

            var pageHeaderMarkup = $('#PageHeaderDefaultTemplate').html();
            $('.viewport').append(pageHeaderMarkup);

            $('.countdown-timer').kkcountdown({
                dayText : 'day ',
                daysText : 'days ',
                hoursText : 'h ',
                minutesText : 'm ',
                secondsText : 's',
                displayZeroDays : false,
                oneDayClass : 'one-day'
            });
            IA.initGlobalNav();

            sf1.EventBus.trigger('pageheader.initComplete');
        };
        return{
            init:function(){
                return init();
            }
        };
    }
);