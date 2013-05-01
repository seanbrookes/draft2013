/**
 * Simple Framework One
 *
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 *
 *
 * hooters:514bd73c9388c80200000002
 * 
 *
 */
define(
	['client', 'modules/admin/admin-i18n','text!/modules/admin/admin-template.html'],
	function(App, i18n,markup) {
        var sf1 = App.sf1;
		sf1.log('Admin module loaded ');

		var anchorSelector = '#TemplateContainer';
        var currentMatchRosterPlayer;
        var currentMatchRoster;
        var currentMatchMLBId;
        var allRosterPlayersArray = [];
        var currentProcessingType;
        var currentMLBStatsData = [];
        var PlayerPointsObj = function(){
            return {
                runs:0,
                hits:0,
                hr:0,
                rbi:0,
                sb:0,
                wins:0,
                losses:0,
                ip:0,
                k:0,
                saves:0
            };


        };

		_.templateSettings.variable = 'P';

		function init(){
			sf1.log('Admin module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);
			var adminModuleContainer = $('script#AdminModuleContainer').html();

			var template = _.template(adminModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('#MainContent').html(templateMarkup);

            var rosterPlayerForm = $('#AdminModuleAddNewRosterPlayerTemplate').html();
            $('.admin-module-container').append(rosterPlayerForm);

			$('.btn-list-pending').click(function(event){
				sf1.log('list accounts');
				$.ajax({
					type:'get',
					url:'/pendingaccounts',
					success:function(response){
						sf1.log('success get pending accounts');
						var outPutMarkup = '';
						sf1.log(response);
						if (response.length){
							for (var i = 0;i < response.length;i++){
								var user = response[i];
								outPutMarkup += '<li><a href="#">' + user.userName  + '</a></li>';
								//sf1.log('response[' + i +  '][' + JSON.stringify(response[i]) + ']');
							}
							$('.pending-account-list').html(outPutMarkup);
						}

					},
					error:function(response){
						sf1.log('error get pending accounts: ' + response);
					}
				});
			});

            $('#CreateDraft').click(function(event){
                event.preventDefault();
                sf1.io.ajax({
                    type:'POST',
                    url:'/createdraft',
                    data: {},
                    success:function(response){
                        sf1.log('success: ' + JSON.stringify(response));
                    },
                    error:function(response){
                        sf1.log('error: ' + JSON.stringify(response));
                    }



                });
            });
            $('#CreateDraftList').click(function(event){
                event.preventDefault();
                sf1.io.ajax({
                    type:'POST',
                    url:'/createdraftlist',
                    data: {},
                    success:function(response){
                        sf1.log('success: ' + JSON.stringify(response));
                    },
                    error:function(response){
                        sf1.log('error: ' + JSON.stringify(response));
                    }



                });
            });
            $('#GetDraft').click(function(event){
                event.preventDefault();
                sf1.io.ajax({
                    type:'GET',
                    url:'/draft',
                    success:function(response){
                        sf1.log('success: ' + JSON.stringify(response));
                    },
                    error:function(response){
                        sf1.log('error: ' + JSON.stringify(response));
                    }



                });
            });
// this is too generic - is it necessary?
//            $('.btn-cmd-link').click(function(event){
//                var id = $(event.target).data('id');
//                sf1.log('command button clicked: ' + id);
//                document.location.href = '#draft/' + id;
//            });



            $('#BtnSaveRosterLink').click(function(event){
                var udpateObj = {};

                var assocRoster = $('#AssociateRosterSelect').val();

                if (assocRoster){
                    udpateObj.mlbid = currentMatchMLBId;
                    udpateObj.roster = assocRoster;
                    udpateObj.playerId = currentMatchRosterPlayer;

                    sf1.io.ajax({
                       type:'PUT',
                       url:'/associatemlbid',
                       data:udpateObj,
                       success:function(response){
                           sf1.log(response);
                           // clear all checkboxes

                           sf1.EventBus.trigger('admin.getRosterPlayersRequest');
                       },
                       error:function(response){
                           sf1.log(response);
                       }
                    });
                }
                else{
                    sf1.log('no roster supplied ');
                }

            });

            $('#BtnUpdateSingleRoster').click(function(event){
                var urlToGet = '/singlerosterstats/' + $('#AssociateRosterSelect').val();
                sf1.io.ajax({
                    type:'GET',
                    url:urlToGet,
                    success:function(response){
                        sf1.log('success: ' + response);
                    },
                    error:function(response){
                        sf1.log('error: ' + response)
                    }
                });
            });

            $('#BtnUpdateRosters').click(function(event){
               sf1.io.ajax({
                  type:'GET',
                  url:'/processlateststats',
                   success:function(response){
                       sf1.log('success: ' + response);
                   },
                   error:function(response){
                       sf1.log('error: ' + response)
                   }
               });
            });
            $('#BtnGetRosterPlayers').click(function(event){
                sf1.EventBus.trigger('admin.getRosterPlayersRequest');

            });
            $('#BtnPullPitcherStats').click(function(event){
                sf1.io.ajax({
                    type:'GET',
                    url:'/pullstats/pitchers',
                    success:function(response){
                        sf1.log('success pull stats');
                        sf1.EventBus.trigger('admin.playerDataLoadComplete',[response]);

                    },
                    error:function(response){
                        sf1.log('error pull stats: ' + response);
                    }
                })
            });
            $('#GetLatestStats').click(function(event){
               sf1.io.ajax({
                   type:'GET',
                   url:'/getlateststats',
                   success:function(response){
                       sf1.log('success: ' + JSON.stringify(response));
                   },
                   error:function(response){
                       sf1.log('error: ' + JSON.stringify(response));
                   }
               });
            });
            $('#BtnPullBatterStats').click(function(event){
               sf1.io.ajax({
                   type:'GET',
                   url:'/pullstats/batters',
                   success:function(response){
                       sf1.log('success pull stats');
                       sf1.EventBus.trigger('admin.playerDataLoadComplete',[response]);

                   },
                   error:function(response){
                       sf1.log('error pull stats: ' + response);
                   }
               })
            });



//            $('#ProcessCurrentBatterStats').click(function(event){
//                sf1.log('Process current stats');
//
//            });
            $('.btn-submit-rosterplayer').unbind().click(function(event){
                event.preventDefault();
                var newPlayerObj = {};
               // get form elements
                newPlayerObj.roster = $('#RosterSelect').val();
                newPlayerObj.name = $('#PlayerNameInput').val();
                newPlayerObj.pos = $('#PosSelect').val();
                newPlayerObj.team = $('#TeamSelect').val();
                newPlayerObj.draftStatus = $('#DraftStatusSelect').val();
                newPlayerObj.playerStatus = $('#PlayerStatusSelect').val();
                newPlayerObj.posType = $('#PosTypeSelect').val();

                if (newPlayerObj.roster && newPlayerObj.name && newPlayerObj.pos
                    && newPlayerObj.team && newPlayerObj.draftStatus && newPlayerObj.playerStatus
                    && newPlayerObj.posType){
                    sf1.io.ajax({
                        type:'POST',
                        url:'rosterplayer',
                        data:newPlayerObj,
                        success:function(response){
                            // toast successs
                            sf1.log('successful add new player');
                            $('#PlayerNameInput').val('');
                        },
                        error:function(response){
                            sf1.log('error creating player');
                        }
                    })
                }


                // build post object
                // execute ajax
                // handle response

            });

		}
        // set global stats variable
        sf1.EventBus.bind('admin.playerDataLoadComplete',function(event, rawData){
            var parsedResultSet = JSON.parse(rawData.data);
            currentMLBStatsData = parsedResultSet.stats_sortable_player.queryResults.row;
        });
        sf1.EventBus.bind('admin.playerDataLoadComplete',function(event, data){
            var statObj = data;
            var totalRecords = statObj.metadata.totalRecords;
            var recordsPerPage = statObj.metadata.recordsPerPage;
            var pageCount = statObj.metadata.pageCount;
            var currentPage = statObj.metadata.currentPage;

            var metaDataMarkup = '<p>Total Records:<span>' + totalRecords + '</span></p>';
            metaDataMarkup += '<p>Records Per Page:<span>' + recordsPerPage + '</span></p>';
            metaDataMarkup += '<p>Page Count:<span>' + pageCount + '</span></p>';
            metaDataMarkup += '<p>Current Page:<span>' + currentPage + '</span></p>';

            var mainOutput = '<ul>';



            var parsedResultSet = JSON.parse(statObj.data);
            var rows = parsedResultSet.stats_sortable_player.queryResults.row;
            rows.sort(compareMLBFirstName);
            for (var i = 0;i < rows.length;i++){
                var row = rows[i];
                mainOutput += '<li><input class="mlb-check" type="checkbox" value="' + row.player_id + '" data-id="' + row.player_id + '">Player Name:  <span>' + row.name_display_first_last + '</span></li>'
            }
            mainOutput += '</ul>';

            $('.stat-service-stats').html(metaDataMarkup);
            $('.display-stats-container').html(mainOutput);
            // ProcessCurrentStats
            sf1.EventBus.trigger('admin.renderPlayerStatsComplete');

        });
        sf1.EventBus.bind('admin.renderPlayerStatsComplete',function(event,data){
            $('.stat-players-title').text('MLB (pending...)');

            $('.mlb-check').click(function(event){
                currentMatchMLBId = $(event.target).val();
            });
        });
        function comparePool(a,b) {

            if (a.name < b.name){
                return -1;
            }
            if (a.name > b.name){
                return 1;
            }
            return 0;
        }
        function compareMLBFirstName(a,b) {

            if (a.name_display_first_last < b.name_display_first_last){
                return -1;
            }
            if (a.name_display_first_last > b.name_display_first_last){
                return 1;
            }
            return 0;
        }

        sf1.EventBus.bind('admin.processCurrentStatsRequest',function(event){

            // toggle between each type of stat [pitcher/batter]
            // get the rosters array
            var rosterArray = allRosterPlayersArray;
            var postObj = {};

            if (rosterArray && rosterArray.length){
                for (var i = 0;i < rosterArray.length;i++){
                    var rosterPlayer = rosterArray[i];
                    // process only pitchers or batters at a time
                    // pitchers
                    if ((currentProcessingType === 'pitcher') && ((rosterPlayer.pos === 'SP') || (rosterPlayer.pos === 'RP'))){
                        // it's a pitcher
//                        sf1.log('|');
//                        sf1.log('|      PROCESS THIS PITCHER - ' + rosterPlayer.name + '[' + rosterPlayer.pos + ']');
//                        sf1.log('|');



                        var match = $.grep(currentMLBStatsData, function(e) { return e.player_id == rosterPlayer.mlbid });
                       if (match.length > 0){
                           sf1.log('|--------------------------------------');
                           sf1.log('|');
                           sf1.log('|      MATCHED THIS PITCHER - ' + rosterPlayer.name + '[' + rosterPlayer.pos + ']');
                           sf1.log('|');
                           sf1.log('|-----------------------------------------');
                           // post this players stats to the server

                           postObj.stats = match[0];
                           postObj.posType = currentProcessingType;

                           sf1.io.ajax({
                               type:'POST',
                               data:postObj,
                               url:'/playerstats',
                               success:function(response){
                                   sf1.log('success posting pitcher stat ');
                               },
                               error:function(response){
                                   sf1.log('error posting pitcher stat ' + response);

                               }
                           });
                       }
                    }
                    // batters
                    else{
                        // it's a batter
//                        sf1.log('|');
//                        sf1.log('|      PROCESS THIS BATTER - ' + rosterPlayer.name);
//                        sf1.log('|');
                        var match = $.grep(currentMLBStatsData, function(e) { return e.player_id == rosterPlayer.mlbid });
                        if (match.length > 0){
                            sf1.log('|--------------------------------------');
                            sf1.log('|');
                            sf1.log('|      MATCHED THIS BATTER - ' + rosterPlayer.name + '[' + rosterPlayer.pos + ']');
                            sf1.log('|');
                            sf1.log('|');
                            sf1.log('|  MLB Batter: ' + match[0].name_display_first_last);
                            sf1.log('|');
                            sf1.log('|-----------------------------------------');

                            postObj.stats = match[0];
                            postObj.posType = currentProcessingType;

                            sf1.io.ajax({
                                type:'POST',
                                data:postObj,
                                url:'/playerstats',
                                success:function(response){
                                    sf1.log('success posting batter stat ');
                                },
                                error:function(response){
                                    sf1.log('error posting batter stat ');

                                }
                            });

//                            var currentPointsObj = new PlayerPointsObj();
//
//                            var currentMatch = new PlayerPointsObj();


                        }
                    }
                }
            }

            // get the current mlb array
            // iterate over the mlb array
            // for each item
            // iterate over the roster player array
            // if there is match
            // grab the stats - json object structure
            // post it to the server
            // create an entry in the stats collection
            // update the roster numbers
            // respond
            // get roster should redturn an indication it has been updated -
            // maybe just an indication the stats have been saved.


        });

        sf1.EventBus.bind('admin.renderRosterPlayersComplete',function(event){
            $(':checkbox:checked').prop('checked', false);
            // clear the key vars
            currentMatchRosterPlayer = null;
            currentMatchRoster = null;
            currentMatchMLBId = null;


            $('#ProcessCurrentBatterStats').click(function(event){
                currentProcessingType = 'batter';
                sf1.EventBus.trigger('admin.processCurrentStatsRequest');
            });
            $('#ProcessCurrentPitcherStats').click(function(event){
                currentProcessingType = 'pitcher';
                sf1.EventBus.trigger('admin.processCurrentStatsRequest');
            });



            /*
            *
            *
            * process zero init scores
            *
            * */
            $('#BtnInitRosterScoresLink').click(function(event){

                // iterate over the roster array
                // create put object
                // put to the server
                // let the responses come in

                var udpateObj = {};

                var roster = $('#AssociateRosterSelect').val();

                if (roster){
                    udpateObj.roster = roster;

                    sf1.io.ajax({
                        type:'PUT',
                        url:'/initrostertotals',
                        data:udpateObj,
                        success:function(response){
                            sf1.log(response);
                            // clear all checkboxes

                            //sf1.EventBus.trigger('admin.getRosterPlayersRequest');
                        },
                        error:function(response){
                            sf1.log(response);
                        }
                    });
                }
                else{
                    sf1.log('no roster supplied ');
                }


            });
        });
        sf1.EventBus.bind('admin.getRosterPlayersRequestSuccess',function(){
            var mainOutput = '<ul>';
            for (var j = 0;j < allRosterPlayersArray.length;j++){
                var row = allRosterPlayersArray[j];
                mainOutput += '<li>[' + (j + 1) + ']Player:  <span>' + row.name + '</span><input type="checkbox" class="roster-check" data-mlbid="' + row.mlbid + '" data-id="' + row._id + '" data-roster="' + row.roster + '"></li>'
            }
            mainOutput += '</ul>';

            //$('.display-players-container').html(metaDataMarkup);
            $('.display-players-container').html(mainOutput);

            $('.roster-check').click(function(event){
                currentMatchRosterPlayer = $(event.target).data('id');
                currentMatchRoster = $(event.target).data('roster');
            });
            $('.roster-check').not('[data-mlbid=\'undefined\']').parent().addClass('associated');


            sf1.EventBus.trigger('admin.renderRosterPlayersComplete');
        });
        sf1.EventBus.bind('admin.getRosterPlayersRequest',function(event){
            sf1.io.ajax({
                type:'GET',
                url:'/rosterplayer',
                success:function(response){
                    sf1.log('success pull players');
                    //  var statObj = JSON.parse(response);
                    var statObj = response;

                    var rosterArrayX = ['hooters','stallions','bashers','rallycaps','mashers'];


                    var masterArray = [];
                    for (var i = 0;i < statObj.length;i++){
                        var thisArray = statObj[i].players;
//                            for (var j = 0;j < thisArray.length;j++){
//                                var itemPlayer = thisArray[j];
//                                itemPlayer.roster = rosterArrayX[i];
//                            }
                        masterArray = $.merge(masterArray,thisArray);
                    }

//                        var totalRecords = statObj.stats_sortable_player.queryResults.totalSize;
//                        var recordsPerPage = statObj.stats_sortable_player.queryResults.recPP;
//                        var pageCount = statObj.stats_sortable_player.queryResults.totalP;
//                        var currentPage = statObj.stats_sortable_player.queryResults.recSP;
//
//                        var metaDataMarkup = '<p>Total Records:<span>' + totalRecords + '</span></p>';
//                        metaDataMarkup += '<p>Records Per Page:<span>' + recordsPerPage + '</span></p>';
//                        metaDataMarkup += '<p>Page Count:<span>' + pageCount + '</span></p>';
//                        metaDataMarkup += '<p>Current Page:<span>' + currentPage + '</span></p>';


//                        var rows = statObj.stats_sortable_player.queryResults.row;
                    masterArray.sort(comparePool);


                    allRosterPlayersArray = masterArray;

                    sf1.EventBus.trigger('admin.getRosterPlayersRequestSuccess');



                },
                error:function(response){
                    sf1.log('error pull stats: ' + response);
                }
            });
        });
		return {
			init:init
		};
	}
);