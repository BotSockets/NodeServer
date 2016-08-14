
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var stream_server = require('./stream-server.js');

var botSocket = io.of('/deviceSocket');
var apiSocket = io.of('/api');

var devices = [];

const WS_STREAM_OUTPUT = 'ws://0.0.0.0/:';
const HTTP_STREAM_INPUT = 'http://0.0.0.0/:';
const PORT_BEGIN = 9000;

botSocket.on('connection', function(socket){
  console.log('device connected');

  socket.on('new device', function(device){
    // generate new endpoints
    var new_device_id = devices.length;
    var stream_input_port = PORT_BEGIN + new_device_id * 2;
    var stream_output_port = PORT_BEGIN + new_device_id * 2 + 1;

    stream_server.createStreamServer(device.secret, stream_input_port,
      stream_output_port, device.width, device.height);

    var new_device = {
      device_id: new_device_id,
      device_name: device.name,
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
  });

  socket.on('disconnect', function(device){
    // should teardown the streaming server, but lazy.
    console.log('device disconnected');
  });
});

app.get('/devices/:device_id/stream_host_url', function(req, res){
  res.json({
    "stream_host_url": devices[req.params.device_id].stream_host_url
  })
})

http.listen(3000, function(){
  console.log('Listening on *:' + 3000);
});