/**
 * Simple Framework One

 * User: sean
 * Date: 05/01/13
 * Time: 9:31 AM
 *
 */
/**
 *
 * Baseline - make sure object is supported
 *
 *
 */

require.config({
    enforceDefine: true,
    paths: {
        'jquery'        : 'scripts/lib/jquery-1.8.2.min',
        'cookie'        : 'scripts/lib/plugins/jquery.cookie',
        'prettydate'    : 'scripts/lib/plugins/jquery.prettydate.js',
        'underscore'    : 'scripts/lib/underscore',
        //'text'          : 'scripts/lib/text',
        'json2'         : 'scripts/lib/json2',
        'i18n'          : 'scripts/lib/i18next.amd-1.6.0',
        'backbone'      : 'scripts/lib/backbone',
        'marionette'    : 'scripts/lib/backbone.marionette',
        'bootstrap'     : 'bootstrap/js/bootstrap',
        'client'        : 'scripts/client-app',
        'sf1'           : 'scripts/sf1.0.1',
        'draft'         : 'modules/draft/draft-module',
        'security'      : 'modules/security/security-module',
        'admin'         : 'modules/admin/admin-module',
        'index'         : 'modules/index/index-module',
        'countdown'     : 'scripts/lib/plugins/kkcountdown',
        'socket.io'     : '/socket.io/socket.io',
        'chat'          : 'modules/chat/chat-module',
        'chatlib'       : 'scripts/lib/plugins/chat.io',
        'pageheader'    : 'modules/pageheader/pageheader-module',
        'maincontent'   : 'modules/maincontent/maincontent-module',
        'io'            : 'modules/io/io-module',
        'ui'            : 'modules/ui/ui-module',
        'ia'            : 'modules/ia/ia-module'
    },
    shim: {

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        marionette : {
            deps : ['backbone','underscore','jquery'],
            exports : 'Marionette'
        },
        underscore: {
            exports: '_'
        },
        i18n: {
            deps: ['jquery'],
            exports: 'i18n'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        sf1: {
            deps: ['jquery'],
            exports: 'sf1'
        },
        prettydate: {
            deps: ['jquery']
        },
        countdown: {
            deps: ['jquery']
        },
//        ia: {
//            deps: ['pageheader']
//        },
        cookie: {
            deps: ['jquery']
        }
    }
});
define(
    ['jquery', 'i18n', 'client', 'security', 'ia', 'pageheader', 'maincontent', 'socket.io'],
    function($, i18n, App, Security, IA, PageHeader, MainContent) {

        App.sf1.log('typeof $: ' + typeof $);
        App.sf1.log('typeof _: ' + typeof _);
        App.sf1.log('typeof backbone: ' + typeof Backbone);

        $(document).ready(function(){
            i18n.init({
                lng: 'en'
            }, function(t) {
                var router = new App.AppRouter(t);
                Backbone.history.start();


                SF1 = new Backbone.Marionette.Application();
                SF1.addRegions({
                    mainContentRegion: '.main-content-wrapper',
                    pageHeaderRegion:'.page-header',
                    pageFooterRegion:'.page-footer',
                    mainNavRegion:'#MainNavigation',
                    globalNavRegion:'#GlbalNavigation'

                });
                PageHeader.init();
                MainContent.init();
                //IA.init();




            });
        });


    }
);