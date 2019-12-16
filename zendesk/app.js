var express = require('express');
var mongoose = require('mongoose');
var Requestor = require('./Model/requestor');
var Organization = require('./Model/organization');
var Engineer = require('./Model/engineer');
var Ticket = require('./Model/ticket');
var TicketHelp = require('./Model/ticketHelp');
var TicketTable = require('./Model/ticketTable');
var User = require('./Model/user');
var ZDUser = require('./Model/zduser');
var Meeting = require('./Model/meeting');
var Corespondence = require('./Model/corespondence');
var Bow = require('./Model/bow');
let Sfdc = require('./Model/sfdc');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var https = require('https');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var wfQueue = require('./controller/wfQueue');


mongoose.connect(config.database);
mongoose.Promise = global.Promise;
//Get the default connection
//var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app = express();
port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// use morgan to log requests to the console
app.use(morgan('dev'));

let options = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt')
}

var server = https.createServer(options, app).listen(port, function() {
    console.log("Express server listening on port " + port);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

app.options('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.sendStatus(200);
});

/* GET home page. */
var index = require('./api/routes/index');
app.use('/', index);

/*var userRoutes = require('./api/routes/users');
userRoutes(app);
var authRoutes = require('./api/routes/auth');
authRoutes(app);*/
var zduserRoutes = require('./api/routes/zdusers');
zduserRoutes(app);
var engineerRoutes = require('./api/routes/engineers');
engineerRoutes(app);
var requestorRoutes = require('./api/routes/requestors');
requestorRoutes(app);
var organizationRoutes = require('./api/routes/organizations');
organizationRoutes(app);
var ticketRoutes = require('./api/routes/tickets');
ticketRoutes(app);
var ticketTable = require('./api/routes/ticketTable');
ticketTable(app);
var userRoutes = require('./api/routes/users');
userRoutes(app);
var meetingRoutes = require('./api/routes/meetings');
meetingRoutes(app);
var corespondenceRoutes = require('./api/routes/corespondence');
corespondenceRoutes(app);
var bowRoutes = require('./api/routes/bow');
bowRoutes(app);
var ticketHelpRoutes = require('./api/routes/ticketHelp');
ticketHelpRoutes(app);
let sfdcRoutes = require('./api/routes/sfdc');
sfdcRoutes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});
