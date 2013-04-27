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
                    }

                    for (var j = 0;j < bashersSeries.length;j++){
                        try{
                            masterArray.push({
                                date:bashersSeries[j].date,
                                bashersTtl:bashersSeries[j].total || 200,
                                hootersTtl:hootersSeries[j].total || 200,
                                mashersTtl:mashersSeries[j].total || 200,
                                stallionsTtl:stallionsSeries[j].total || 200,
                                rallycapsTtl:rallycapsSeries[j].total || 200

                            });
                        }
                        catch(e){

                        }
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
        return{
            init:init,
            ChartView:ChartView
        };
    }
);