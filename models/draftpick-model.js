/**
 * Draft 2013
 *
 * User: sean
 * Date: 23/03/13
 * Time: 7:21 PM
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DraftPickSchema = new Schema({
    pickNumber: {type: Number, required: true},
    round: {type: Number, required: true},
    roster: {type: String},
    name : {type: String},
    pos : {type: String},
    team: {type: String},
    pickTime: {type: Date},
    pickTimeStamp: {type: Date}

});


module.exports = mongoose.model('DraftPick', DraftPickSchema);