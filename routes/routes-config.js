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
var chat = require('./chat');
var stats = require('./stats');

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
    app.get('/drafttranscript', chat.getDraftTranscript);
    app.get('/pendingaccounts',admin.getPendingAccountList);
    app.get('/pullstats/:type',stats.pullStats);
    app.get('/rosterplayer',roster.getAllPlayers);
    app.get('/getlateststats',stats.getLatestStats);
    app.get('/processlateststats',stats.processLatestStats);
    app.get('/singlerosterstats/:roster',stats.processSingleRosterStats);
    app.get('/dopitchers',stats.triggerPitcherStats);
    app.get('/dobatters',stats.triggerBatterStats);
    app.get('/togglefetchstats/:value', stats.toggleFetchStats);
    app.get('/fetchstatsstatus', stats.getFetchStatsStatus);
    app.get('/totalshistory',stats.getTotalsHistory);
    app.get('/lastupdate',stats.getLastUpdate);


    app.post('/createdraft', draft.createDraft);
    app.post('/createdraftlist', draft.createDraftList);
    app.post('/auth',user.postAuthenticate);
    app.post('/user',user.createUser);
    app.post('/deleterosterplayer', roster.deletePlayer);
    app.post('/postpicktoroster', draft.postPickToRoster);
    app.post('/rosterplayer', roster.addRosterPlayer);
    app.post('/playerstats', stats.postPlayerStats);
    app.post('/totals',roster.addRosterTotals);

    app.put('/statusupdate', roster.updateDraftStatus);
    app.put('/playerrosterupdate', roster.updatePlayerRoster);
    app.put('/pickroster', draft.updateDraftPickRoster);
    app.put('/pickname', draft.updateDraftPickName);
    app.put('/rosterpos', roster.updateRosterPos);
    app.put('/pickpos', draft.updateDraftPickPos);
    app.put('/pickteam', draft.updateDraftPickTeam);
    app.put('/associatemlbid', roster.associateMLBId);
    app.put('/initrostertotals', roster.initRosterTotals);


};
