/**
 * Draft 2013
 *
 * User: sean
 * Date: 15/04/13
 * Time: 11:18 PM
 *
 */

define(['marionette','sf1'],
    function(Marionette,sf1){

        /*
         *
         * main score total layout view
         *
         * */
        var PosListLayout = Backbone.Marionette.Layout.extend({
            template: "#ScoreModuleDefaultTemplate",

            regions: {
                titleRegion: "#TitalContainer",
                listRegion: "#ListContainer"
            }
        });
        /*
         * define pos views
         *
         * */

        var BatterItemView = Backbone.Marionette.ItemView.extend({
            template: '#BatterTemplate',
            tagName: 'tr',
            onRender:function(){
//                if (this.model.attributes.counting){
//                    this.$el.addClass('counting');
//                }
                //sf1.log('ON RENDER' + this.model);
            }

        });
        var StarterItemView = Backbone.Marionette.ItemView.extend({
            template: '#StarterTemplate',
            tagName: 'tr',
            onRender:function(){
//                if (this.model.attributes.counting){
//                    this.$el.addClass('counting');
//                }
                //sf1.log('ON RENDER' + this.model);
            }

        });
        var CloserItemView = Backbone.Marionette.ItemView.extend({
            template: '#CloserTemplate',
            tagName: 'tr',
            onRender:function(){
//                if (this.model.attributes.counting){
//                    this.$el.addClass('counting');
//                }
                //sf1.log('ON RENDER' + this.model);
            }

        });

        /*
         * BatterView
         *
         * */
        var BatterView = Backbone.Marionette.CompositeView.extend({
            template: '#BatterViewTemplate',
            itemView: BatterItemView,
            itemViewContainer: 'tbody',
            className: 'batter-list'
//            onAfterItemAdded: function(item){
//                // add class
//                var dStatus = item.model.attributes.draftStatus;
//                var dPos = item.model.attributes.pos;
//                $(item.el).addClass('player-' + dStatus);
//                $(item.el).addClass('pos-' + dPos);
//            }
        });
        /*
         * StarterView
         *
         * */
        var StarterView = Backbone.Marionette.CompositeView.extend({
            template: '#StarterViewTemplate',
            className: 'starter-list',
            itemViewContainer: 'tbody',
            itemView: StarterItemView
//            onAfterItemAdded: function(item){
//                // add class
//                var dStatus = item.model.attributes.draftStatus;
//                var dPos = item.model.attributes.pos;
//                $(item.el).addClass('player-' + dStatus);
//                $(item.el).addClass('pos-' + dPos);
//            }
        });
        /*
         * CloserView
         *
         * */
        var CloserView = Backbone.Marionette.CompositeView.extend({
            template: '#CloserViewTemplate',
            className: 'closter-list',
            itemViewContainer: 'tbody',
            itemView: CloserItemView
//            onAfterItemAdded: function(item){
//                // add class
//                var dStatus = item.model.attributes.draftStatus;
//                var dPos = item.model.attributes.pos;
//                $(item.el).addClass('player-' + dStatus);
//                $(item.el).addClass('pos-' + dPos);
//            }
        });



        return {
            BatterItemView:BatterItemView,
            StarterItemView:StarterItemView,
            CloserItemView:CloserItemView,
            BatterView:BatterView,
            StarterView:StarterView,
            CloserView:CloserView
        };



    }
);