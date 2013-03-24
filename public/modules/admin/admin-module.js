/**
 * Simple Framework One
 *
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 *
 *
 */
define(
	['client', 'modules/admin/admin-i18n','text!/modules/admin/admin-template.html'],
	function(App, i18n,markup) {
        var sf1 = App.sf1;
		sf1.log('Admin module loaded ');

		var anchorSelector = '#TemplateContainer';
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


		}
		return {
			init:init
		};
	}
);