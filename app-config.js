/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 19/03/13
 * Time: 11:14 PM
 * To change this template use File | Settings | File Templates.
 */
var config = {
    app: {
        friendlyName: 'Draft 2013',
            name:'draft2013'
    },
    db: {
        db: 'd2013',
        host: 'localhost',
        port: 27017,  // optional, default: 27017
        collection: 'sessions', // optional, default: sessions
        options:{
            db: {
                safe: true
            }
        }
    },
    salt: '076ee61d63aa10a115ea872411e433bc',
    socketio: false, //
    cookieSecretString: 'a secret string 2013',
    localPort: 3009
};
module.exports = config;
