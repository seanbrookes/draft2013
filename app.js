/**
 * Draft 2013
 *
 *
 * Basic bootstrap application based node/mongo/backbone
 *
 */
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('./app-config');
var locale = require('./locale');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'app.log' })
	]
});

var app = express();



app.set('port', process.env.PORT || config.localPort);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.cookieParser(config.cookieSecretString));
app.use(express.session({
    secret: config.salt,
    cookie: {
        path     : '/',
        httpOnly : true,
        maxAge   : null    //one year(ish)
    }
}));

app.use(express.methodOverride());	// important that this comes after session management
/*
*
* LOCALE
*
*
* */
app.use(locale.locale);
app.use(app.router);



app.configure('development', function(){
    app.use(express.errorHandler());
});


/*
*
* ROUTES
*
* */
require('./routes/routes-config')(app);

/*
*
*
* CREATE THE APP
*
*
*
* */
http.createServer(app).listen(app.get('port'), function(){
	console.log('|--------------------------------');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');

// TODO - parameterize the name of the application
// TODO - set configuration to enable and turn off this messaging


	console.log("|	" + config.app.friendlyName + " app server listening on port " + app.get('port'));
	console.log('|');
	console.log('|');
	//console.log('|	Initialize Db connection');
	console.log('|');

    /*
     DB Connection

     */
    var dbConString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'http://' + config.db.host + ':' + config.db.port +'/' + config.db.db;
logger.info('DBCONSTRING[' + dbConString + ']');
	var db = mongoose.connect(dbConString, config.db.options ,function(err){
		if(err){
			console.log('|');
			console.log('|');
			console.log('--------------------------------');
			//console.log('|	' + dbConString + ' [db] connection error : ' + err);
			console.log('|	 [db] connection error : ' + err);
			console.log('--------------------------------');
			console.log('|');
		}
		else{
			console.log('|');
			console.log('|	Connected to db	');
			console.log('|');
			console.log('|');
		}
		console.log('|==========================================');
		console.log('|==========================================');
		console.log('|');
		console.log('|');

	});
});
