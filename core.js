
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var stream_server = require('./stream-server.js');
var body_parser = require('body-parser');
var ip = require('ip');

app.use(body_parser.json()); // for parsing application/json

var botSocket = io.of('/deviceSocket');
var apiSocket = io.of('/api');

var devices = [];

const HOST_IP = ip.address();

const WS_STREAM_OUTPUT = 'ws://' + HOST_IP + ':';
const HTTP_STREAM_INPUT = 'http://' + HOST_IP + ':';
const PORT_BEGIN = 9000;

botSocket.on('connection', function(socket){
  console.log('device connected');

  socket.on('new device', function(device){
    console.log(device);

    // generate new endpoints
    var new_device_id = devices.length;
    var stream_input_port = PORT_BEGIN + new_device_id * 2;
    var stream_output_port = PORT_BEGIN + new_device_id * 2 + 1;

    stream_server.createStreamServer(device.secret, stream_input_port,
      stream_output_port, device.width, device.height);

    var new_device = {
      device_id: new_device_id,
      device_name: device.name,
      secret: device.secret,
      socket_id: socket.id,
      stream_listener_url: HTTP_STREAM_INPUT + stream_input_port +
        '/' + device.secret + '/' + device.width + '/' + device.height,
      stream_host_url: WS_STREAM_OUTPUT + stream_output_port + '/'
    };
    devices.push(new_device);

    socket.emit('device created', {
      "response": "device creation successful",
      "message": "You must now use a streaming from capture service such as FFMPEG. \
        Point it to the stream_listener_url for your device (under device) \
        and you can view the output through stream_host_url",
      "device": new_device
    });

    console.log('device created');

    // test the commands
    console.log('Testing sending commands');
    setTimeout(function(){
      var commands = [
        0, 1, 2, 0, 1, 4, 3
      ];

      console.log('sending commands');
      sendCommands(new_device_id, commands);
    }, 5000);
  });

  socket.on('disconnect', function(device){
    // should teardown the streaming server, but lazy.
    console.log('device disconnected');
  });
});

app.get('/devices/:device_id/stream_host_url', function(req, res){
  if(req.query.secret === devices[req.params.device_id].secret){
    res.json({
      stream_host_url: devices[req.params.device_id].stream_host_url
    });
  } else {
    res.statusCode(400).end("ERROR. Device secret is invalid");
  }
});

// function for interfacing between REST api and sockets
function sendCommands(device_id, commands){
  var device = devices[device_id];

  io.of('/deviceSocket').to(device.socket_id)
    .emit('command', commands);
}

app.post('/devices/:device_id/commands', function(req, res){
  var device = devices[req.params.device_id];
  if(req.body.secret === device.secret){
    sendCommands(device.device_id, req.body.commands);
    res.end("Commands accepted!");
  } else {
    res.end("Commands rejected. Secret is invalid.");
  }
});

http.listen(80, function(){
  console.log('Listening on *:' + 80);
});