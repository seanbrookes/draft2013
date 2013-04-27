/**
 * Simple Framework One

 * User: sean
 * Date: 25/12/12
 * Time: 11:18 PM
 *
 */
define(
	['sf1','marionette', 'roster', 'i18n', 'ia', 'modules/ia/ia.models', 'modules/ia/ia.views', 'text!/modules/ia/ia.template.html', 'text!/modules/ia/config.json'],
	function(sf1, Marionette, Roster, i18n, IA, Model, View, template, config) {


        var locTimestamp;

		_.templateSettings.variable = 'P';



        //var sf1 = App.sf1;
        var anchorSelector = '#TemplateContainer';

        var mainNavCollection = {};
        var globalNavCollection = {};


        var baseMarkup;
        // attach the module template markup to the DOM
        baseMarkup = $(template);
        $(anchorSelector).append(baseMarkup);

        // IA base model
        var navConfigObj = {};

        var currentNavRoute;





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
                sf1.EventBus.trigger('ia.renderRosterNavRequest');
                sf1.EventBus.trigger('ia.renderPosNavRequest');

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
                $('.page-header-banner').prepend(mainNavShell);

//                var mainNavView = new View.MainNavView({
//                    itemView: View.NavItemView,
//                    collection: new Model.NavItemCollection(navConfigObj.mainNav)
//                });
//                $('.main-nav-container .navbar-inner').html(mainNavView.render().$el);
//
//                $('.nav-main-list').i18n();

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


                var globalNavView = new View.GlobalNavView({
                    itemView: View.NavItemView,
                    collection: new Model.NavItemCollection(navConfigObj.globalNav)
                });
                $('.global-nav-container').html(globalNavView.render().$el);

                $('.nav-global-list').i18n();
                sf1.EventBus.trigger('ia.globalNavRenderComplete');

                //sf1.EventBus.trigger('checkauth-event');
            });
            /*
             *
             * render roster nav
             *
             * */
            sf1.EventBus.bind('ia.renderRosterNavRequest',function(event){
                _.templateSettings.variable = 'P';
                // set the initial main nav markup
//                var rosterNavShell = $('#RosterNavTemplate').html();
//                $('#SideBar').html(rosterNavShell);
                if (!$('#IAModule').html()){
                    baseMarkup = $(template);
                    $(anchorSelector).append(baseMarkup);
                }

var test = sf1.app.rosters;
                var rosterNavList = sf1.app.rosters.sort(sf1.totalSort);

                var rosterNavView = new View.RosterNavView({

                    collection: new Model.NavItemCollection(rosterNavList)
                });
                $('#SideBar').prepend(rosterNavView.render().$el);

                $('.nav-roster-list').i18n();
                setActiveNavItem();

            });
            /*
             *
             * render roster nav
             *
             * */
            sf1.EventBus.bind('ia.renderPosNavRequest',function(event){
                _.templateSettings.variable = 'P';
                // set the initial main nav markup
                if (!$('#IAModule').html()){
                    baseMarkup = $(template);
                    $(anchorSelector).append(baseMarkup);
                }
                var posNavShell = $('#PosNavTemplate').html();
                $('#SideBar').append(posNavShell);

                var posNavView = new View.PosNavView({
                    itemView: View.NavItemView,
                    collection: new Model.NavItemCollection(navConfigObj.posNav)
                });
                $('.pos-nav-container').html(posNavView.render().$el);

                $('.nav-pos-list').i18n();
                setActiveNavItem();

            });
            /*
             *
             * set active nav item
             *
             *
             * */
            sf1.EventBus.bind('ia.setActiveNavItem',function(event,obj){
                if (!obj){
                    return;
                }
                // get a handle on the navigation element
                // iterate over the children and set the active one
                var navList = $(obj.navEl);
                if (navList){
                    $(obj.navEl).removeClass('is-selected');
                    var itemSelector = obj.navEl + '[data-route=' + obj.navItem + ']';
                    $(itemSelector).addClass('is-selected');
                }
            });

            sf1.EventBus.bind('ia.mainNavEvent',function(event,param){
                if (param){
                    currentNavRoute = param.route;
                    setActiveNavItem();
                }

            });

		}
        var setActiveNavItem = function(){
            $('.secondary-nav li').removeClass('is-selected');
            $('.secondary-nav tr').removeClass('is-selected');
            $('.secondary-nav a').removeClass('is-selected');
            $('.page-header').removeClass('is-selected');
            var itemSelector = '[data-route=' + currentNavRoute + ']';
            $(itemSelector).addClass('is-selected');
            if (currentNavRoute === 'index'){
                sf1.log('current nav is index');
                $('.page-header').addClass('is-selected');
            }
        };



        var rosterModelsInit = function(){


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
            },
            initRosterNav:function(){
                sf1.EventBus.trigger('ia.renderRosterNavRequest');
            },
            initPosNav:function(){
                sf1.EventBus.trigger('ia.renderPosNavRequest');
            }
        };


	}


);





