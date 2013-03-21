/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 10:10 PM
 *
 */
var rosterModel = function(){

    return{
        getRosterNav:function(){
            return [
                {
                    url:'#/roster/hooters',
                    label:'Hooters'
                },
                {
                    url:'#/roster/stallions',
                    label:'Stallions'
                },
                {
                    url:'#/roster/bashers',
                    label:'Bashers'
                },
                {
                    url:'#/roster/rallycaps',
                    label:'Rally Caps'
                },
                {
                    url:'#/roster/mashers',
                    label:'Mashers'
                }
            ];

        }
    };
}