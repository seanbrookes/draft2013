/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 *
 * client-app
 *
 *
 */
// Client App
define(['jquery', 'backbone', 'marionette', 'sf1', 'router', 'ia', 'pageheader'],
    function($, Backbone, Marionette, sf1, Router, IA, PageHeader){
        /*
        *
        * Initialize the app
        *
        * */
        sf1.app = new Backbone.Marionette.Application();


        //var mainContentRegion;
        sf1.router = new Router.AppRouter();

        sf1.EventBus.bind('app.contextInitSuccess',function(){


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

            //sf1.EventBus.trigger('pageheader.renderLastUpdateValRequest');


        });



        /*
        *
        * App Event Listners
        *
        *
        *   LOAD REGION
        *
        *   this doesn't seem to belong
        *
        * */
        sf1.EventBus.bind('ia.loadRegionContentRequest',function(event,obj){
            var region = obj.region; //'sf1.app.mainContentRegion',
            var module = obj.module; // :'score',
            var view = obj.view; // 'SummaryView'
            var data = obj.data;

            require([module],function(mod){

                mod[view](data);

            });

        });

        return {
            sf1:sf1
        };
    }
);





