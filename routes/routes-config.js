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
var draft = require('./draft');

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
    app.get('/draft', draft.getDraftModel);
    app.get('/drafttranscript', draft.getDraftTranscript);
    app.post('/createdraft', draft.createDraft);
    app.post('/createdraftlist', draft.createDraftList);
    app.put('/draftpick', draft.updateDraftPick);
    app.post('/auth',user.postAuthenticate);
    app.post('/user',user.createUser);
    app.get('/pendingaccounts',admin.getPendingAccountList);
    app.put('/statusupdate', roster.updateDraftStatus);
}
