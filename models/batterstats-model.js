/**
 * Draft 2013
 *
 * User: sean
 * Date: 01/04/13
 * Time: 9:17 AM
 *
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BatterStatsSchema = new Schema({
        ab: {type: Number },
        ao: {type: Number },
        avg: {type: Number },
        bats: {type: String },
        bb: {type: Number },
        cs: {type: Number },
        d: {type: Number },
        file_code: {type: String },
        g: {type: Number },
        gdp: {type: Number },
        gidp: {type: Number },
        go: {type: Number },
        go_ao: {type: Number },
        h: {type: Number },
        hbp: {type: Number },
        hr: {type: Number },
        ibb: {type: Number },
        jersey_number: {type: Number },
        last_name: {type: String },
        league: {type: String },
        league_id: {type: String },
        name_display_first_last: {type: String },
        name_display_init_last: {type: String },
        name_display_last_first: {type: String },
        name_display_last_init: {type: String },
        name_display_roster: {type: String },
        np: {type: Number },
        obp: {type: Number },
        ops: {type: Number },
        player_id: {type: String },
        pos: {type: String },
        r: {type: Number },
        rank: {type: Number },
        rbi: {type: Number },
        sac: {type: Number },
        sb: {type: Number },
        sbpct: {type: Number },
        sf: {type: Number },
        sh: {type: Number },
        slg: {type: Number },
        so: {type: Number },
        t: {type: Number },
        tb: {type: Number },
        team: {type: String },
        team_abbrev: {type: String },
        team_id: {type: String },
        team_name: {type: String },
        tpa: {type: Number },
        xbh: {type: Number },
        lastUpdate: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('BatterStats', BatterStatsSchema);