/**
 * Created by callumjhays on 14/08/16.
 */

// this file is mainly here to test the core.js module and see if it works
const BOTSOCKETS_HOST = "http://localhost:3000/deviceSocket";

var socket = require('socket.io-client')(BOTSOCKETS_HOST);

var deviceInfo = {
  name: "TEST DEVICE",
  secret: "lmaolmao",
  width: 360,
  height: 240
};

socket.on('connect', function(){
  console.log('Connected to socket server.');

  // register new device with device information
  socket.emit('new device', deviceInfo);
});

socket.on('device created', function(response){
  console.log('Device created! Response: ', response);
});

socket.on('command', function(command){
  console.log('Received command: ', command);
});

socket.on('disconnect', function(){
  console.log('Server disconnected');
});