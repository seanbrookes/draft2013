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
		_.templateSettings.variable = 'P';

		function init(){
			sf1.log('Admin module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);
			var adminModuleContainer = $('script#AdminModuleContainer').html();

			var template = _.template(adminModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('.main-content-wrapper').html(templateMarkup);

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
            $('#BtnGetRosterPlayers').click(function(event){
                sf1.EventBus.trigger('admin.getRosterPlayersRequest');

            });
            $('#BtnPullPitcherStats').click(function(event){
                sf1.io.ajax({
                    type:'GET',
                    url:'/pullstats/pitchers',
                    success:function(response){
                        sf1.log('success pull stats');
                        var statObj = JSON.parse(response);
                        var totalRecords = statObj.stats_sortable_player.queryResults.totalSize;
                        var recordsPerPage = statObj.stats_sortable_player.queryResults.recPP;
                        var pageCount = statObj.stats_sortable_player.queryResults.totalP;
                        var currentPage = statObj.stats_sortable_player.queryResults.recSP;

                        var metaDataMarkup = '<p>Total Records:<span>' + totalRecords + '</span></p>';
                        metaDataMarkup += '<p>Records Per Page:<span>' + recordsPerPage + '</span></p>';
                        metaDataMarkup += '<p>Page Count:<span>' + pageCount + '</span></p>';
                        metaDataMarkup += '<p>Current Page:<span>' + currentPage + '</span></p>';

                        var mainOutput = '<ul>';
                        var rows = statObj.stats_sortable_player.queryResults.row;
                        rows.sort(compareMLBFirstName);
                        for (var i = 0;i < rows.length;i++){
                            var row = rows[i];
                            mainOutput += '<li><input class="mlb-check" type="checkbox" value="' + row.player_id + '" data-id="' + row.player_id + '">Player Name:  <span>' + row.name_display_first_last + '</span></li>'
                        }
                        mainOutput += '</ul>';

                        //$('.player-synch-controls').append(metaDataMarkup);
                        $('.display-stats-container').html(mainOutput);


                        $('.mlb-check').click(function(event){
                            currentMatchMLBId = $(event.target).val();
                        });
                    },
                    error:function(response){
                        sf1.log('error pull stats: ' + response);
                    }
                })
            });
            $('#BtnPullBatterStats').click(function(event){
               sf1.io.ajax({
                   type:'GET',
                   url:'/pullstats/batters',
                   success:function(response){
                       sf1.log('success pull stats');
                       var statObj = JSON.parse(response);
                       var totalRecords = statObj.stats_sortable_player.queryResults.totalSize;
                       var recordsPerPage = statObj.stats_sortable_player.queryResults.recPP;
                       var pageCount = statObj.stats_sortable_player.queryResults.totalP;
                       var currentPage = statObj.stats_sortable_player.queryResults.recSP;

                       var metaDataMarkup = '<p>Total Records:<span>' + totalRecords + '</span></p>';
                       metaDataMarkup += '<p>Records Per Page:<span>' + recordsPerPage + '</span></p>';
                       metaDataMarkup += '<p>Page Count:<span>' + pageCount + '</span></p>';
                       metaDataMarkup += '<p>Current Page:<span>' + currentPage + '</span></p>';

                       var mainOutput = '<ul>';
                       var rows = statObj.stats_sortable_player.queryResults.row;
                       rows.sort(compareMLBFirstName);
                       for (var i = 0;i < rows.length;i++){
                           var row = rows[i];
                           mainOutput += '<li><input class="mlb-check" type="checkbox" value="' + row.player_id + '" data-id="' + row.player_id + '">Player Name:  <span>' + row.name_display_first_last + '</span></li>'
                       }
                       mainOutput += '</ul>';

                       //$('.player-synch-controls').append(metaDataMarkup);
                       $('.display-stats-container').html(mainOutput);


                       $('.mlb-check').click(function(event){
                           currentMatchMLBId = $(event.target).val();
                       });
                   },
                   error:function(response){
                       sf1.log('error pull stats: ' + response);
                   }
               })
            });

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

        sf1.EventBus.bind('admin.renderRosterPlayersComplete',function(event){
            $(':checkbox:checked').prop('checked', false);
            // clear the key vars
            currentMatchRosterPlayer = null;
            currentMatchRoster = null;
            currentMatchMLBId = null;


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
        sf1.EventBus.bind('admin.getRosterPlayersRequest',function(event){
            sf1.io.ajax({
                type:'GET',
                url:'/rosterplayer',
                success:function(response){
                    sf1.log('success pull players');
                    //  var statObj = JSON.parse(response);
                    var statObj = response;

                    var rosterArray = ['hooters','stallions','bashers','rallycaps','mashers'];


                    var masterArray = [];
                    for (var i = 0;i < statObj.length;i++){
                        var thisArray = statObj[i].players;
//                            for (var j = 0;j < thisArray.length;j++){
//                                var itemPlayer = thisArray[j];
//                                itemPlayer.roster = rosterArray[i];
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

                    var mainOutput = '<ul>';
//                        var rows = statObj.stats_sortable_player.queryResults.row;
                    masterArray.sort(comparePool);
                    for (var j = 0;j < masterArray.length;j++){
                        var row = masterArray[j];
                        mainOutput += '<li>[' + (j + 1) + '][' + row._id + ']Player:  <span>' + row.name + '</span><input type="checkbox" class="roster-check" data-mlbid="' + row.mlbid + '" data-id="' + row._id + '" data-roster="' + row.roster + '"></li>'
                    }
                    mainOutput += '</ul>';

                    //$('.display-players-container').html(metaDataMarkup);
                    $('.display-players-container').html(mainOutput);

                    $('.roster-check').click(function(event){
                        currentMatchRosterPlayer = $(event.target).data('id');
                        currentMatchRoster = $(event.target).data('roster');
                    });
                    $('.roster-check').not('[data-mlbid=\'undefined\']').attr('disabled','disabled').parent().addClass('associated');


                    sf1.EventBus.trigger('admin.renderRosterPlayersComplete');


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