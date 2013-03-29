/**
 * Draft 2013
 *
 * User: sean
 * Date: 26/03/13
 * Time: 12:28 AM
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatMessageSchema = new Schema({
    nickname: {type: String, required: true},
    message: {type: String},
    messageTimeStamp: {type: Date, default: Date.now}

});


module.exports = mongoose.model('ChatMessage', ChatMessageSchema);