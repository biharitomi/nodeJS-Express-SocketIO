var express=require('express');
var server=express();
var http=require('http');
var httpServer=http.createServer(server);
var io = require('socket.io').listen(httpServer);

httpServer.listen(3000);

server.get('/', function(req, res){
  res.sendfile('./frontend/views/index.html');
});
server.use(express.static('frontend/resources'));

// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];

io.sockets.on('connection', function (socket) {
	socket.on('setPseudo', function (data) {
		var userColor=colors[Math.floor(Math.random()*colors.length)];
		var userData={ 'userName':data, 'userColor':userColor};
		socket.set('pseudo', userData);
		//send back the color to the connected user
		socket.emit('setPseudo', userData);
		var data = {  pseudo : userData, 'message' : 'entered the room.' };
		//broadcast the new comers entering
		socket.broadcast.emit('message', data);
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = {  pseudo : name, 'message' : message };
			socket.broadcast.emit('message', data);
			console.log("user " + name.userName + ' with color: ' + name.userColor + " send this : " + message);
		})
	});
});