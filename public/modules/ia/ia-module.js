/**
 * Simple Framework One

 * User: sean
 * Date: 25/12/12
 * Time: 11:18 PM
 *
 */
define(
	['marionette', 'i18n', 'sf1', 'client', 'text!/modules/ia/ia-template.html', 'text!/modules/ia/config.json'],
	function(Marionette, i18n, sf1, App, template, config) {

		_.templateSettings.variable = 'P';



        var sf1 = App.sf1;
        var anchorSelector = '#TemplateContainer';

        var mainNavCollection = {};
        var globalNavCollection = {};

        // attach the module template markup to the DOM
        baseMarkup = $(template);
        $(anchorSelector).append(baseMarkup);

        // IA base model
        var navConfigObj = {};

        var baseMarkup;

		/*
		 * Nav Item Model / Collection
		 *
		 * */
		var NavItemModel = Backbone.Model.extend({});
		var NavItemCollection = Backbone.Collection.extend({
			model: NavItemModel
		});
        /*
        * 
        * Marionette Views
        * 
        * */
        var NavItemView = Backbone.Marionette.ItemView.extend({
            template: '#NavItemTemplate',
            tagName: 'li'
        });

        /*
        * MainNavView
        *
        * */
        var MainNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-main-list nav'

        });

        /*
         * GlobalNavView
         *
         * */
        var GlobalNavView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav-global-list nav nav-pills'

        });

        /*
         * initialize data store mdel
         *
         * */
        navConfigObj = JSON.parse(config);
        bindEventListeners();



		function init(){

			sf1.log('IA module init ');






			sf1.EventBus.trigger('ia.initComplete');

		}


        /*
        *
         *   EVENT LISTENERS
         *
         *
        * */
		function bindEventListeners(){
			/*

			*   templates loaded
			* */
			sf1.EventBus.bind('ia.initComplete',function(event){

                sf1.EventBus.trigger('ia.renderMainNavRequest');
                //sf1.EventBus.trigger('ia.renderGlobalNavRequest');

			});

            /*
             *
             * render main nav
             *
             * */
            sf1.EventBus.bind('ia.renderMainNavRequest',function(event){
                _.templateSettings.variable = 'P';
                // set the initial main nav markup
                var mainNavShell = $('#MainNavTemplate').html();
                $('.page-header').after(mainNavShell);

                var mainNavView = new MainNavView({
                    itemView: NavItemView,
                    collection: new NavItemCollection(navConfigObj.mainNav)
                });
                $('.main-nav-container .navbar-inner').html(mainNavView.render().$el);

                $('.nav-main-list').i18n();

                sf1.EventBus.trigger('ia.mainNavRenderComplete');
                //sf1.EventBus.trigger('checkauth-event');
            });
            /*
             *
             * render global nav
             *
             * */
            sf1.EventBus.bind('ia.renderGlobalNavRequest',function(event){
                _.templateSettings.variable = 'P';
                // set the initial main nav markup
                var globalNavShell = $('#GlobalNavTemplate').html();
                $('.page-header').append(globalNavShell);


                var globalNavView = new GlobalNavView({
                    itemView: NavItemView,
                    collection: new NavItemCollection(navConfigObj.globalNav)
                });
                $('.global-nav-container').html(globalNavView.render().$el);

                $('.nav-global-list').i18n();
                sf1.EventBus.trigger('ia.globalNavRenderComplete');

                sf1.EventBus.trigger('checkauth-event');
            });
            sf1.EventBus.bind('ia.mainNavEvent',function(event,param){
                if (param){
                    setActiveNavItem(param.route);
                }

            });

		}
        var setActiveNavItem = function(route){
            $('.nav-main-list a').removeClass('is-selected');
            var itemSelector = '[data-route=' + route + ']';
            $(itemSelector).addClass('is-selected');
        };
        return {
            init:function(){
              return init();
            },
            initGlobalNav:function(){
                sf1.EventBus.trigger('ia.renderGlobalNavRequest');
            },
            initMainNav:function(){
                sf1.EventBus.trigger('ia.renderMainNavRequest');
            }
        };


	}


);





///*
// *
// *   main nav event
// *
// * */
//sf1.EventBus.bind('ia.mainNavEvent',function(event,obj){
//    if(!obj){
//        return;
//    }
//    if (obj.route){
//        sf1.EventBus.trigger('ia.setActiveNavItem',{
//            navEl:'.nav-main-list li a',
//            navItem:obj.route
//        });
//    }
//});
///*
// *
// * set active nav item
// *
// *
// * */
//sf1.EventBus.bind('ia.setActiveNavItem',function(event,obj){
//    if (!obj){
//        return;
//    }
//    // get a handle on the navigation element
//    // iterate over the children and set the active one
//    var navList = $(obj.navEl);
//    if (navList){
//        $(obj.navEl).removeClass('is-selected');
//        var itemSelector = obj.navEl + '[data-route=' + obj.navItem + ']';
//        $(itemSelector).addClass('is-selected');
//    }
//});



