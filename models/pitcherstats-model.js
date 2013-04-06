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

var PitcherStatsSchema = new Schema({
        ab: {type: Number },
        ao: {type: Number },
        avg: {type: Number },
        bb: {type: Number },
        bb_9: {type: Number },
        bk: {type: Number },
        cg: {type: Number },
        cs: {type: Number },
        er: {type: Number },
        era: {type: Number },
        file_code: {type: String },
        g: {type: Number },
        gf: {type: Number },
        gidp: {type: Number },
        go: {type: Number },
        go_ao: {type: Number },
        gs: {type: Number },
        h: {type: Number },
        h_9: {type: Number },
        hb: {type: Number },
        hld: {type: Number },
        hr: {type: Number },
        ibb: {type: Number },
        ip: {type: Number },
        jersey_number: {type: Number },
        k_9: {type: Number },
        k_bb: {type: Number },
        l: {type: Number },
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
        p_ip: {type: Number },
        pk: {type: Number },
        player_id: {type: String },
        r: {type: Number },
        rank: {type: Number },
        sb: {type: Number },
        sf: {type: Number },
        sh: {type: Number },
        sho: {type: Number },
        slg: {type: Number },
        so: {type: Number },
        sv: {type: Number },
        svo: {type: Number },
        tb: {type: Number },
        tbf: {type: Number },
        team: {type: String },
        team_abbrev: {type: String },
        team_id: {type: String },
        team_name: {type: String },
        throws: {type: String },
        w: {type: Number },
        whip: {type: Number },
        wp: {type: Number },
        wpct: {type: Number },
        lastUpdate: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('PitcherStats', PitcherStatsSchema);