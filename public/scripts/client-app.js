/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 */
// Client App
define(['jquery', 'sf1', 'backbone'],function($, sf1, Backbone){
    var AppRouter;
    AppRouter = Backbone.Router.extend({

        routes: {
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
            "roster/:name": "roster"
        },

        index: function () {
            sf1.log('index');
            sf1.EventBus.trigger('ia.mainNavEvent', [
                {route: 'index'}
            ]);
            require(['score', 'draft', 'chat'], function (score, draft) {
                $('.main-content-wrapper').empty();
               // chatMod.init();
                //score.init();
                draft.init();
                //draftMod.init();

            });
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
            $('.main-content-wrapper').empty();
            require(['roster', 'chat'], function (module, chatMod) {
                module.init(rosterId);
               // chatMod.init();
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


    });
    return {
        AppRouter:AppRouter,
        sf1:sf1
    };
});





