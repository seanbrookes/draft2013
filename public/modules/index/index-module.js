/**
 * Simple Framework One
 *
 * User: sean
 * Date: 01/11/12
 * Time: 9:45 PM
 *
 */
define(
	['client','text!/modules/index/index-template.html'],
	function(App, markup) {
        
        var sf1 = App.sf1;
		sf1.log('Index module loaded ');

		var anchorSelector = '#TemplateContainer';
		// namespace for var reference in template
		_.templateSettings.variable = 'S';

		function init(){
			sf1.log('Index module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);
			var indexModuleContainer = $('script#IndexModuleContainer').html();

			var template = _.template(indexModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('.main-content-wrapper').html(templateMarkup);


			/*
			*
			* test code to demonstrate io.ajax namespace
			*
			* */
			$('#TestButton').click(function(event){
				$.ajax({
					type:'get',
					url:'/isauth',
					success:function(response){
						sf1.log('hell ya!');
						sf1.log(response);
					},
					error:function(response){
						sf1.log('hell no');
						sf1.log(response);
					}
				});
			});

            var markupOutput = '<tr><th>round</th><th>pick</th><th>roster</th><th>player</th><th>pos</th><th>team</th></tr>';
            sf1.io.ajax({
                type:'GET',
                url:'/draft',
                success:function(response){


                    var resObj = response;
                    var draftList = resObj[0].picks;
                    sf1.log('success: ' + JSON.stringify(response));
                    var nameVal = '', posVal = '', teamVal = '';
                    for (var i = 0;i < draftList.length;i++){
                        var x = draftList[i];
                        if (x.name){
                            nameVal = x.name;
                        }
                        if (x.team){
                            teamVal = x.team;
                        }
                        if (x.pos){
                            posVal = x.pos;
                        }
                        markupOutput += '<tr>';
                        markupOutput += '<td>' + x.round + '</td>';
                        markupOutput += '<td>' + x.pickNumber + '</td>';
                        markupOutput += '<td>' + x.roster + '</td>';
                        markupOutput += '<td>' + nameVal + '</td>';
                        markupOutput += '<td>' + posVal + '</td>';
                        markupOutput += '<td>' + teamVal + '</td>';
                        markupOutput += '</tr>';
                    }
                    $('#DraftList').html(markupOutput);
                },
                error:function(response){
                    sf1.log('error: ' + JSON.stringify(response));
                }



            });


//			var editor = ace.edit("editor");
//			editor.setTheme("ace/theme/monokai");
//			editor.getSession().setMode("ace/mode/javascript");
		}
		return {
			init:init
		};
	}
);