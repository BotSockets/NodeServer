/**
 * Created by callumjhays on 14/08/16.
 */

var spawn = require('child_process').exec;
// this file is mainly here to test the core.js module and see if it works
const BOTSOCKETS_HOST = "http://localhost/deviceSocket";

var socket = require('socket.io-client')(BOTSOCKETS_HOST);

var deviceInfo = {
  name: "SERVER CAMERA",
  secret: "bigpoo",
  width: 320,
  height: 240
};

socket.on('connect', function(){
  console.log('Connected to socket server.');

  // register new device with device information
  socket.emit('new device', deviceInfo);
});

socket.on('device created', function(response){
  console.log('Device created! Response: ', response);

  spawn('ffmpeg -s 320x240 -f video4linux2 -i /dev/video1 -f mpeg1video \
  -b 800k -r 30 ' + response.device.stream_listener_url);
});

socket.on('command', function(command){
  console.log('Received command: ', command);
});

socket.on('disconnect', function(){
  console.log('Server disconnected');
});