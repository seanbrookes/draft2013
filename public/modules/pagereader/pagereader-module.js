/**
 * Draft 2013
 * User: sean
 * Date: 19/03/13
 * Time: 10:51 PM
 *
 */
define(['sf1'],function(sf1){

    function init(){
       // alert('TEST');
        sf1.io.ajax({
            type:'get',
            url:'/pagereader',
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
        init:function(){
            return init();
        }
    };
});