/**
 * Draft 2013
 * User: sean
 * Date: 19/03/13
 * Time: 10:51 PM
 *
 */
define(['sf1'],function(sf1){

    function init(rosterName){
       // alert('TEST');
        sf1.io.ajax({
            type:'get',
            url:'/pagereader/' + rosterName,
            success:function(response){
                sf1.log('success: ' + JSON.stringify(response));
                $('.main-content-wrapper').html(response);
            },
            error:function(response){
                sf1.log('error: ' + response);
            }
        });

    }
    return {
        init:function(rosterName){
            return init(rosterName);
        }
    };
});