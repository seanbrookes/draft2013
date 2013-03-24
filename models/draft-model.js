/**
 * Draft 2013
 *
 * User: sean
 * Date: 23/03/13
 * Time: 7:20 PM
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DraftPick = require('./draftpick-model');

var DraftPickSchema = new Schema({
    pickNumber: {type: Number, required: true},
    round: {type: Number, required: true},
    roster: {type: String},
    name : {type: String},
    pos : {type: String},
    team: {type: String},
    pickTime: {type: Date},
    pickTimeStamp: {type: Date, default: Date.now()}

});

var DraftSchema = new Schema({
    year : {type: Number, unique: true },
    draftTime : {type: Date },
    picks : [DraftPickSchema]

});

module.exports = mongoose.model('Draft', DraftSchema);