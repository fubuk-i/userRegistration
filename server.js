var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const routes = require('./api/routes');
const auth = require('./api/config/auth');
const port = 4000;

var app = express();


//app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.initialize());
auth.setJwtStrategy();
 app.use('/', routes);


app.listen(port);

console.log('Server started on port ' + port);