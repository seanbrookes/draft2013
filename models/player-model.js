/**
 * Draft 2013
 *
 * User: sean
 * Date: 20/03/13
 * Time: 7:33 AM
 *
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    mlbid : {type: String },
    name : {type: String, required: true },
    pos : {type: String, required: true },
    team: {type: String, required: true },
    posType: {type: String, required: true}, // batter, pitcher
    draftStatus: {type: String, required: true}, // protected, bubble, dropped
    playerStatus: {type: String, required: true}, // nl, dl, prospect, regular
    runs: {type: Number},
    hits: {type: Number},
    hr: {type: Number},
    rbi: {type: Number},
    sb: {type: Number},
    wins: {type: Number},
    losses: {type:Number},
    k: {type: Number},
    ip: {type: Number},
    saves: {type: Number},
    total: {type: Number},
    lastUpdate: {type: Date, default: Date.now },
    draftYear: {type: Number}



});

module.exports = mongoose.model('Player', PlayerSchema);

