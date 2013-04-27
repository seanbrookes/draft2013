/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 */
// Router
define(['sf1','backbone','router'],
    function(sf1,Backbone,router){

        var routerConfig = {
            index: function () {
                sf1.log('index');
                sf1.EventBus.trigger('ia.mainNavEvent', [
                    {route: 'index'}
                ]);
                sf1.EventBus.trigger('ia.loadRegionContentRequest',{
                    region:'mainContentRegion',
                    module:'score',
                    view:'SummaryView'
                });

            },
            history: function () {
                sf1.log('history');
                sf1.EventBus.trigger('ia.mainNavEvent', [
                    {route: 'history'}
                ]);
                sf1.EventBus.trigger('ia.loadRegionContentRequest',{
                    region:'mainContentRegion',
                    module:'history',
                    view:'ChartView'
                });

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
                require(['/modules/pagereader/pagereader-module'], function (module) {
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
                sf1.EventBus.trigger('ia.loadRegionContentRequest',{
                    region:'mainContentRegion',
                    module:'roster',
                    view:'RosterView',
                    data:rosterId
                });
            },
            position: function (posName) {
                sf1.log('pos route');
                sf1.EventBus.trigger('ia.mainNavEvent', [
                    {route: posName.toLowerCase() }
                ]);
//            $('.main-content-wrapper').empty();
//            require(['pos'], function (module) {
//                module.init(posName);
//            });
                sf1.EventBus.trigger('ia.loadRegionContentRequest',{
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
                require(['/modules/admin/admin-module'], function (module) {
                    module.init();
                });
            }
        };
        /*
         *
         * Initialize the AppRouter
         *
         * */
        var AppRouter = Backbone.Marionette.AppRouter.extend({
            appRoutes: {
                "": "index",
                "home": "index",
                "draft": "draft",
                "draft/:userid": "draft",
                "history": "history",
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
            controller: routerConfig

        });
        return {
            getRouterConfig:function(){
                return routerConfig;
            },
            AppRouter:AppRouter
        };
    }
);





