require("./config/properties");
require("./config/db_connection");
require("./config/db_model");

var express = require('express')
    ,app = express()
    ,server = require('http').createServer(app)
    ,io = require('socket.io')(server)
    ,port = process.env.PORT || 3000
    ,path = require('path')
    ,fs = require("fs")
    ,bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    console.log('Time:', Date.now(), req.method, req.originalUrl);
    next();
});
app.use(logErrors);
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

var services = require('./routes/services');
app.get('/', function(req, res) {
    fs.readFile('./views/index.html', function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});
app.get('/invite/:code/:cid', services.validateInvite);
app.post('/users/all', services.allUsers);
app.post('/users/remove', services.removeUser);
app.post('/users/signin', services.signIn);
app.post('/users/register', services.register);
app.post('/users/registerUser', services.registerUser);
app.post('/users/invite', services.inviteUser);
app.post('/issues/all', services.allIssues);
app.post('/issues/save', services.saveIssue);
app.post('/issues/update', services.updateIssue);
app.post('/issues/remove', services.removeIssue);
app.post('/releases/all', services.allReleases);
app.post('/releases/save', services.saveRelease);
app.post('/releases/remove', services.removeRelease);
app.post('/sprints/all', services.allSprints);
app.post('/sprints/save', services.saveSprint);
app.post('/sprints/remove', services.removeSprint);
app.get('*', function(req, res) {
    res.redirect("/");
});

server.listen(port, function(){
    console.log('listening on *:' + port);
});
io.on('connection', function(socket){
    socket.on('add_issue', function(data){
        socket.broadcast.emit('add_issue', data);
    });
    socket.on('remove_issue', function(data){
        socket.broadcast.emit('remove_issue', data);
    });
    socket.on('update_issue', function(data){
        socket.broadcast.emit('update_issue', data);
    });
});
process.on('uncaughtException', function(err) {
    console.log("Uncaught exception!", err);
});
