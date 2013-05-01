/**
 * Draft 2013
 *
 * User: sean
 * Date: 26/04/13
 * Time: 12:13 AM
 *
 */
define(['sf1','modules/history/history.models', 'modules/history/history.views', 'text!/modules/history/history.templates.html','raphael','d3','morris'],
    function(sf1,Model,View,template){
        var anchorSelector = '#TemplateContainer';

        _.templateSettings.variable = 'S';
        baseMarkup = $(template);
        // attach the module template markup to the DOM
        $(anchorSelector).append(baseMarkup);

        var init = function(){
            var tpl = $('#MainChartTemplate').html();
            $('#MainContent').html(tpl);
            sf1.log('history module init');
        };
        var ChartView = function(){
            var tpl = $('#MainChartTemplate').html();
            $('#MainContent').html(tpl);
            sf1.log('history module init');
            sf1.log('ChartView - in module controller');

            sf1.io.ajax({
                type:'GET',
                url:'/totalshistory',
                success:function(response){

                    var bashersSeries = [];
                    var hootersSeries = [];
                    var mashersSeries = [];
                    var stallionsSeries = [];
                    var rallycapsSeries = [];
                    var masterArray = [];

                    var dataSetLengthArray = [];

                    for (var i = 0;i < response.length;i++){
                        var responseItem = response[i];
                        switch(responseItem.roster){

                            case 'bashers':
                                bashersSeries.push(responseItem);
                                break;
                            case 'hooters':
                                hootersSeries.push(responseItem);
                                break;
                            case 'mashers':
                                mashersSeries.push(responseItem);
                                break;
                            case 'stallions':
                                stallionsSeries.push(responseItem);
                                break;
                            case 'rallycaps':
                                rallycapsSeries.push(responseItem);
                                break;
                            default:

                        }
                    };
                    // create an array so we can identify the longest array by sorting
                    dataSetLengthArray.push(
                        {
                            roster:bashersSeries,
                            length:bashersSeries.length
                        },
                        {
                            roster:hootersSeries,
                            length:hootersSeries.length
                        },
                        {
                            roster:mashersSeries,
                            length:mashersSeries.length
                        },
                        {
                            roster:stallionsSeries,
                            length:stallionsSeries.length
                        },
                        {
                            roster:rallycapsSeries,
                            length:rallycapsSeries.length
                        }
                    );
                    dataSetLengthArray.sort(compareLength);

                    // longest array will dicated the size of the data set for the chart
                    var longestArray = dataSetLengthArray[0];

                    // initialize starting totals
                    var bashersPostTotal = 400;
                    var mashersPostTotal = 400;
                    var hootersPostTotal = 400;
                    var stallionsPostTotal = 400;
                    var rallycapsPostTotal = 400;

                    for (var j = 0;j < longestArray.length;j++){

                        // only update the total if there is a valid value
                        // if not just use the existing one
                        if (bashersSeries[j].total){
                            bashersPostTotal = bashersSeries[j].total;
                        }
                        if (hootersSeries[j].total){
                            hootersPostTotal = hootersSeries[j].total;
                        }
                        if (mashersSeries[j].total){
                            mashersPostTotal = mashersSeries[j].total;
                        }
                        if (stallionsSeries[j].total){
                            stallionsPostTotal = stallionsSeries[j].total;
                        }
                        if (rallycapsSeries[j].total){
                            rallycapsPostTotal = rallycapsSeries[j].total;
                        }


                        var xyz = longestArray.roster[j];

                        masterArray.push({
                            date:xyz.date,
                            bashersTtl:bashersPostTotal,
                            hootersTtl:hootersPostTotal,
                            mashersTtl:mashersPostTotal,
                            stallionsTtl:stallionsPostTotal,
                            rallycapsTtl:rallycapsPostTotal

                        });

                        var ttt = 'abc';
                    }

                    var arrayMetaData = [{
                         roster:'bashers',
                         totalsArrayName:'bashersTtl',
                         label:'Bashers'
                        },
                        {
                            roster:'hooters',
                            totalsArrayName:'hootersTtl',
                            label:'Hooters'
                        },
                        {
                            roster:'mashers',
                            totalsArrayName:'mashersTtl',
                            label:'Mashers'
                        },
                        {
                            roster:'stallions',
                            totalsArrayName:'stallionsTtl',
                            label:'Stallions'
                        },
                        {
                            roster:'rallycaps',
                            totalsArrayName:'rallycapsTtl',
                            label:'Rally Caps'
                        },
                    ];


                    var rosterNavList = sf1.app.rosters.sort(sf1.totalSort);
                    for (var k = 0;k < rosterNavList.length;k++){

                    }


                    new Morris.Line({
                        // ID of the element in which to draw the chart.
                        element: 'MainChart',
                        // Chart data records -- each entry in this array corresponds to a point on
                        // the chart.
                        data: masterArray,
                        // The name of the data record attribute that contains x-values.
                        xkey: 'date',
                        ymin:'auto',
                        ymax:'auto',
                        'hideHover':'auto',
                        // A list of names of data record attributes that contain y-values.
                        ykeys: [rosterNavList[0].slug + 'Ttl',rosterNavList[1].slug + 'Ttl',rosterNavList[2].slug + 'Ttl',rosterNavList[3].slug + 'Ttl',rosterNavList[4].slug + 'Ttl'],
                        // Labels for the ykeys -- will be displayed when you hover over the
                        // chart.
                        labels: [rosterNavList[0].name,rosterNavList[1].name,rosterNavList[2].name,rosterNavList[3].name,rosterNavList[4].name]
                    });













                    sf1.log(response);
                },
                error:function(response){
                    sf1.log(response);
                }
            });
        };
        var compareLength = function(a,b) {
            if (a.length < b.length){
                return -1;
            }
            if (a.length > b.length){
                return 1;
            }
            return 0;
        }
        return{
            init:init,
            ChartView:ChartView
        };
    }
);