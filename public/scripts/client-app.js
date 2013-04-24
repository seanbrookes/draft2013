/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 */
// Client App
define(['jquery', 'sf1', 'marionette', 'ia', 'pageheader'],
    function($, sf1, Marionette, IA, PageHeader){
    sf1.app = new Backbone.Marionette.Application();

    var routerController = {
        index: function () {
            sf1.log('index');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'index'}
            ]);
            sf1.EventBus.trigger('ia.loadRegion',{
               region:'mainContentRegion',
                module:'score',
                view:'SummaryView'
            });
//            require(['score'], function (score) {
//
//                // chatMod.init();
//                sf1.score.init();
//                //draft.init();
//                //draftMod.init();
//
//            });
            //indexModule.init();
        },
        signup: function () {
            sf1.log('signup route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'signup'}
            ]);

            require(['security'], function (module) {
                module.initSignup();
            });

        },
        page: function (rosterName) {
            sf1.log('page route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'page'}
            ]);
            require(['../modules/pagereader/pagereader-module'], function (module) {
                //module.init(rosterName);
            });

        },
        chat: function (rosterName) {
            sf1.log('chat route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'chat'}
            ]);
            require(['chat'], function (module) {
                module.init();
            });

        },
        roster: function (rosterId) {
            sf1.log('roster route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: rosterId}
            ]);
            //$('.main-content-wrapper').empty();
//            require(['roster', 'chat'], function (module, chatMod) {
//                module.init(rosterId);
//                // chatMod.init();
//            });
            sf1.EventBus.trigger('ia.loadRegion',{
                region:'mainContentRegion',
                module:'roster',
                view:'RosterView',
                data:rosterId
            });
        },
        position: function (posName) {
            sf1.log('pos route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: posName}
            ]);
//            $('.main-content-wrapper').empty();
//            require(['pos'], function (module) {
//                module.init(posName);
//            });
            sf1.EventBus.trigger('ia.loadRegion',{
                region:'mainContentRegion',
                module:'pos',
                view:'init',
                data:posName
            });
        },
        draft: function (userId) {
            sf1.log('draft route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'draft'}
            ]);
            require(['draft', 'chat'], function (draftMod, chatMod) {
                $('.main-content-wrapper').empty();
                draftMod.init(userId);
                // chatMod.init();

            });
        },
        login: function () {
            sf1.log('login route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'login'}
            ]);

            require(['security'], function (module) {
                module.initLogin();
            });
//
//            securityModule.initLogin();

        },
        adminstats: function () {
            sf1.log('adminstats route');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'adminstats'}
            ]);

            require(['stats'], function (module) {
                module.init();
            });
//
//            securityModule.initLogin();

        },
        admin: function () {
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
            sf1.EventBus.trigger('ia.mainNavEvent', {route: 'admin'});
            require(['../modules/admin/admin-module'], function (module) {
                module.init();
            });
        }
    };
    //var mainContentRegion;

    sf1.EventBus.bind('main.appInitialized',function(){


        //var router = new AppRouter();
        var BaseLayout = Backbone.Marionette.Layout.extend({
            template: "#BaseLayoutTemplateContainer",

            regions: {
                mainContentRegion: '#MainContent',
                pageHeaderRegion:'#PageHeader',
                pageFooterRegion:'#PageFooter',
                mainNavRegion:'#MainNavigation',
                sideBar:'#SideBar'
            }
        });
//        mainContentRegion = Backbone.Marionette.Region({
//            el:'#MainContent'
//        });


        sf1.app.addRegions({
            mainContentRegion: '#MainContent',
            pageHeaderRegion:'#PageHeader',
            pageFooterRegion:'#PageFooter',
            mainNavRegion:'#MainNavigation',
            sideBar:'#SideBar'

        });
        //sf1.app.render();
        //sf1.app.vent.on("routing:started", function() {
            //Backbone.history.start();
        //});

//        sf1.app.addInitializer(function(){
//            sf1.router = new AppRouter();
//        });

        //sf1.app.addInitializer(function(){
            sf1.router = new AppRouter();
       // });
        sf1.app.on("initialize:after", function(){
            if (Backbone.history){
                Backbone.history.start();
            }
        });
        sf1.app.start();


        PageHeader.init();
//        MainContent.init();



        sf1.EventBus.trigger('ia.renderRosterNavRequest');
        sf1.EventBus.trigger('ia.renderPosNavRequest');
        sf1.EventBus.trigger('pageheader.renderLastUpdateValRequest');


    });

    var AppRouter = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            "": "index",
            "home": "index",
            "draft": "draft",
            "draft/:userid": "draft",
            "login": "login",
            "signup": "signup",
            "chat": "chat",
            "adminstats": "adminstats",
            "admin": "admin",
            "page/:name": "page",
            "roster/:name": "roster",
            "pos/": "position",
            "pos/:name": "position"
        },
        controller: routerController

    });

    /*
    *
    * App Event Listners
    *
    *
    *
    *
    * */
    sf1.EventBus.bind('ia.loadRegion',function(event,obj){
        var region = obj.region; //'sf1.app.mainContentRegion',
        var module = obj.module; // :'score',
        var view = obj.view; // 'SummaryView'
        var data = obj.data;

        require([module],function(mod){

            var currentView = mod[view](data);
//            var currentViewMarkup = currentView;
//            $("#MainContent").html('<p>test</p>');
            //$("#MainContent").html(currentView.el);
//            sf1.app.mainContentRegion.show(currentView);

           // mod.init();
            //sf1.app.mainContentRegion.show(mod.SummaryView());
//            sf1.app[region].show(mod[view]);
            sf1.log('LOAD REGION');
        });

    });
    return {
        sf1:sf1
    };
});





