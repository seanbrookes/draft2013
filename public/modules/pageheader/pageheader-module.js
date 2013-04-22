/**
 * Draft 2013
 *
 * User: sean
 * Date: 24/03/13
 * Time: 10:49 PM
 *
 */
define(
    ['jquery', 'client','ia', 'countdown', 'text!/modules/pageheader/pageheader-template.html', 'stats', 'prettydate'],
    function($, App, IA, countdown, markup) {
        var sf1 = App.sf1;
        //sf1.log('PageHeader module loaded ');
        var currentAuthRoster;

        var anchorSelector = '#TemplateContainer';
        var baseMarkup = $(markup);
        $(anchorSelector).append(baseMarkup);
        // namespace for var reference in template
        _.templateSettings.variable = 'S';

        var init = function(){

            var pageHeaderMarkup = $('#PageHeaderDefaultTemplate').html();
            $('.viewport').append(pageHeaderMarkup);

//            $('.countdown-timer').kkcountdown({
//                dayText : 'day ',
//                daysText : 'days ',
//                hoursText : 'h ',
//                minutesText : 'm ',
//                secondsText : 's',
//                displayZeroDays : false,
//                oneDayClass : 'one-day'
//            });
//            IA.initGlobalNav();

            setGreeting();

            sf1.EventBus.bind('pageheader.renderLastUpdateValRequest');


            sf1.EventBus.trigger('pageheader.initComplete');
        };
        sf1.EventBus.bind('pageheader.renderLastUpdateValRequest',function(){
            $('.stats-update-date').text(sf1.lastUpdate);
            $('.stats-update-date').attr('title',sf1.lastUpdate);
            sf1.EventBus.trigger('pageheader.lastUpdateUpdate');
        });
        var setGreeting = function(){
            if (sf1.hasStorage){
                if (localStorage.getItem('currentAuthRoster')){
                    currentAuthRoster = JSON.parse(localStorage.getItem('currentAuthRoster'));
                    $('.page-header-greeting').text('Hi ' + currentAuthRoster.owner);
                }
            }
        };
        sf1.EventBus.bind('pageheader.lastUpdateUpdate',function(){
            $('.stats-update-date').prettyDate();
        });
        sf1.EventBus.bind('user.setNewAuthUser',function(event){
            setGreeting();
        });

        sf1.EventBus.bind('pageheader.initComplete',function(){
            $('.btn-update-stats').click(function(){
                sf1.EventBus.trigger('stats.updateStatsRequest');

                $('.btn-update-stats').hide();
                $('.stats-update-comp').append('<img src="./images/chasingspheres.gif">');
                // set button to 'activity state active' i.e. swap an image for the button
                // set event listener for stats complete
                sf1.EventBus.bind('stats.updateStatsRequestComplete',function(){
                    // tick over 5 seconds to simulate stat fetch time
                    // then reload the page
                    // reset the button and/or
                    setTimeout(resetAfterStatUpdate, 6500);
                });
            });
        });

        var resetAfterStatUpdate = function(){
          sf1.log('RELOAD PAGE');
            document.location.reload();
        };
        return{
            init:function(){
                return init();
            }
        };
    }
);