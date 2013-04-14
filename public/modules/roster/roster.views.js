/**
 * Draft 2013
 *
 * User: sean
 * Date: 14/04/13
 * Time: 6:54 AM
 *
 */
define(['marionette'],function(Marionette){
    /*
     *
     * Marionette Views
     *
     * */
    var PlayerView = Backbone.Marionette.ItemView.extend({
        template: '#PlayerTemplate',
        tagName: 'tr'

    });
    var BatterItemView = Backbone.Marionette.ItemView.extend({
        template: '#BatterTemplate',
        tagName: 'tr',
        onRender:function(){
            if (this.model.attributes.counting){
                this.$el.addClass('counting');
            }
            //sf1.log('ON RENDER' + this.model);
        }

    });
    var StarterItemView = Backbone.Marionette.ItemView.extend({
        template: '#StarterTemplate',
        tagName: 'tr',
        onRender:function(){
            if (this.model.attributes.counting){
                this.$el.addClass('counting');
            }
            //sf1.log('ON RENDER' + this.model);
        }

    });
    var CloserItemView = Backbone.Marionette.ItemView.extend({
        template: '#CloserTemplate',
        tagName: 'tr',
        onRender:function(){
            if (this.model.attributes.counting){
                this.$el.addClass('counting');
            }
            //sf1.log('ON RENDER' + this.model);
        }

    });

    /*
     * RosterView
     *
     * */
    var RosterView = Backbone.Marionette.CollectionView.extend({
        tagName: 'table',
        className: 'player-list',
        onAfterItemAdded: function(item){
            // add class
            var dStatus = item.model.attributes.draftStatus;
            var dPos = item.model.attributes.pos;
            $(item.el).addClass('player-' + dStatus);
            $(item.el).addClass('pos-' + dPos);
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


    var RosterHeaderView = Backbone.Marionette.ItemView.extend({

    });

    return{
        BatterItemView:BatterItemView,
        StarterItemView:StarterItemView,
        CloserItemView:CloserItemView,
        RosterView:RosterView,
        BatterView:BatterView,
        StarterView:StarterView,
        CloserView:CloserView





    }
});