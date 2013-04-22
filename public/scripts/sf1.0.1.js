/**
 * kickoff the app
 *
 * define SF as Social Framework namespace
 *
 * export log and EventBus as global objects
 *
 *
 */
define(
    ['jquery', 'cookie'],
    function($){
        var sf1 = {};

        // usage: POF.log('inside coolFunc',this,arguments);
        // inspired by: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
        sf1.log =  function(){
            sf1.log.history = sf1.log.history || [];   // store logs to an array for reference
            sf1.log.history.push(arguments);
            if(window.console){
                console.log( Array.prototype.slice.call(arguments) );
            }
        };
        sf1.io = Object.create({});
        sf1.io.ajax = function(ioObj){
            if (ioObj){
                // check if there is an ajax request type and other properties
                // make sure the required parameters (url and type are there )
                $.ajax(ioObj);
                sf1.log('in sfo.io.ajax');
                sf1.log(ioObj);


            }
        };


        var defaultLocale = 'en';
        sf1.getUserLocale = function(){
            var returnVal;
            if ($.cookie('userLocale')){
                returnVal = $.cookie('userLocale');// get cookie value
            }
            else{
                returnVal = defaultLocale;
            }
            return returnVal;
        };
        // declare a name-spaced event bus
        sf1.EventBus = $(Object.create({}));
        sf1.hasStorage = (function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch(e) {
                return false;
            }
        }());
        sf1.translate = function(obj){
            sf1.log('translate this string key: ' + JSON.stringify(obj) + '  with this locale value: ' + sf1.getUserLocale());
            return obj.key;
        };
        sf1.isUserAuth = function(){
            if ($.cookie('isAuthenticated')){
                var isAuthVal = $.cookie('isAuthenticated');
                if (isAuthVal === 'true'){
                    return true;
                }
                return false;
            }
            else{
                return false;
            }
        };
        sf1.totalSort = function(a,b){
            if (a.total > b.total){
                return -1;
            }
            if (a.total < b.total){
                return 1;
            }
            return 0;
        };

        return sf1;

    }
);