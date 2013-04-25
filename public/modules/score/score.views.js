/**
 * Draft 2013
 *
 * User: sean
 * Date: 13/04/13
 * Time: 10:58 PM
 *
 */
define(['marionette','sf1'],
    function(Marionette,sf1){

        /*
        *
        * main score total layout view
        *
        * */
        var ScoreSummaryLayout = Backbone.Marionette.Layout.extend({
            template: "#ScoreModuleDefaultTemplate",

            regions: {
                overallRegion: "#OverallTotalsContainer",
                battersRegion: "#BatterTotalsContainer",
                startersRegion: "#StarterTotalsContainer",
                closersRegion: "#CloserTotalsContainer"
            }
        });
        /*
        * define score views
        *
        * */

        var TotalItemView = Backbone.Marionette.ItemView.extend({
            template: '#ScoreItemTemplate',
            tagName: 'tr',
            onRender: function(model, index){
                this.$el.addClass('rank-' + index);
            }

        });
        /*
         * RosterTotals
         *
         * */
        var RosterTotalView = Backbone.Marionette.CompositeView.extend({
            template: '#RosterTotalsViewTemplate',
            itemView: TotalItemView,
            itemViewContainer: 'tbody',
            itemViewOptions:function(model){
                cssClass: "rank-" + this.collection.indexOf(model)
            }
        });
        /*
         * BatterTotals
         *
         * */
        var BatterTotalView = Backbone.Marionette.CompositeView.extend({
            template: '#BatterTotalsViewTemplate',
            itemView: TotalItemView,
            itemViewContainer: 'tbody'
        });
        /*
         * StarterTotals
         *
         * */
        var StarterTotalView = Backbone.Marionette.CompositeView.extend({
            template: '#StarterTotalsViewTemplate',
            itemView: TotalItemView,
            itemViewContainer: 'tbody'
        });
        /*
         * CloserTotals
         *
         * */
        var CloserTotalView = Backbone.Marionette.CompositeView.extend({
            template: '#CloserTotalsViewTemplate',
            itemView: TotalItemView,
            itemViewContainer: 'tbody'
        });




        return {
            BatterTotalView:BatterTotalView,
            StarterTotalView:StarterTotalView,
            CloserTotalView:CloserTotalView,
            RosterTotalView:RosterTotalView,
            ScoreSummaryLayout:ScoreSummaryLayout
        };



    }
);