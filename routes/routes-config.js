/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 16/03/13
 * Time: 8:48 AM
 * To change this template use File | Settings | File Templates.
 */
var user = require('./user');
var pagereader = require('./pagereader');
var admin = require('./admin');
var roster = require('./roster');
module.exports = function(app){

    /*
     *
     * ROUTES
     *
     * */
    app.get('/roster/:name',roster.getRoster);
    app.get('/logout',user.logout);
    app.get('/isauth',user.isUserAuth);
    app.get('/pagereader/:name',pagereader.getPage);
    app.post('/auth',user.postAuthenticate);
    app.post('/user',user.createUser);
    app.get('/pendingaccounts',admin.getPendingAccountList);
}
