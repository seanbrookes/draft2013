/**
 * Draft 2013
 *
 * User: sean
 * Date: 17/04/13
 * Time: 10:34 PM
 *
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TotalsSchema = new Schema({
    roster : {type: String, required: true },
    battersTotal : {type: Number, required: true },
    startersTotal : {type: Number, required: true },
    closersTotal : {type: Number, required: true },
    total : {type: Number, required: true },
    date: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Totals', TotalsSchema);