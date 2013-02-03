    /**
     * added another test comment
     */

	/**
	 * kickoff the app
	 *
	 * define SF as Social Framework namespace
	 *
	 * export log and EventBus as global objects
	 *
	 *
	 */

(function(exports,$){
	var sf1 = {};

	sf1.io = Object.create({});
	sf1.io.ajax = function(ioObj){
		if (ioObj){
			// check if there is an ajax request type and other properties
			// make sure the required parameters (url and type are there )
			$.ajax(ioObj);
			log('in sfo.io.ajax');
			log(ioObj);


		}
	};

	// usage: POF.log('inside coolFunc',this,arguments);
	// inspired by: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	sf1.log =  function(){
		log.history = log.history || [];   // store logs to an array for reference
		log.history.push(arguments);
		if(exports.console){
			console.log( Array.prototype.slice.call(arguments) );
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
	sf1.translate = function(){
		log('translate this string key: ' + JSON.stringify(arguments) + '  with this locale value: ' + getUserLocale());
		return arguments[0];
	};

	exports.sf1 = sf1;

}(window,jQuery));

