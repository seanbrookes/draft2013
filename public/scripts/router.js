/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 */
// Router
    /*
    *
    *
    *
    *
    *
    * // CURRENTLY USING CLIENT-APP FOR ROUTER CONFIG
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    * */
var AppRouter = Backbone.Router.extend({

	routes:{
		"":"index",
		"home":"index",
		"login":"login",
		"signup":"signup",
		"admin":"admin",
        "page":"page"
	},

	index:function () {
		sf1.log('index');
		sf1.EventBus.trigger('ia.mainNavEvent',{route:'index'});
		require(['../modules/index/index-module'],function(module){
			module.init();
		});
		//indexModule.init();
	},


    signup:function () {
        sf1.log('signup route');
        sf1.EventBus.trigger('ia.mainNavEvent',{route:'signup'});
        securityModule.initSignup();

    },
    page:function () {
        sf1.log('page route');
        sf1.EventBus.trigger('ia.mainNavEvent',{route:'page'});
        require(['../modules/pagereader/pagereader-module'],function(module){

            // turning this off for now as it was only really needed to import the rosters from Kevin's site
            //module.init();
        });

    },

	login:function () {
		sf1.log('login route');
		sf1.EventBus.trigger('ia.mainNavEvent',{route:'login'});
		securityModule.initLogin();

	},

	admin:function () {
		sf1.log('admin route');

		/*
		*
		* Test to see if the module should be loaded
		* - is the current user authenticated
		* - if they are do they have permission to load the admin module
		*
		* need a central property mapped to event listeners on login / logout
		*
		* could test the cookie
		*
		* need to determine is this a framework issue or an application/security issue
		*
		* also maps to IA and other areas of the application.
		*
		* */
		sf1.EventBus.trigger('ia.mainNavEvent',{route:'admin'});
 		require(['../modules/admin/admin-module'],function(module){
			module.init();
		});
	}


});

$.i18n.init({
    lng: "en"
}, function(t) {

    SF1 = new Backbone.Marionette.Application();
    SF1.addRegions({
            mainRegion: "main-content-wrapper"
    });

    var router = new AppRouter(t);
    Backbone.history.start();

});


