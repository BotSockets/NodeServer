var express = require('express');
var cors = require('cors');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors());

var users = [];

function create_new_user(){
  users.push({
    user_name: "Anonymous",
    commands: []
  });

  // return the user id
  return users.length - 1;
}

app.get('/schedule', function(req, res){
  var time_now = new Date();

  const UTC_PER_MINUTE = 60000;

  var minutes_until_next_event = 4;
  var next_event_descriptor = "Submissions Close";

  var time_of_next_event = new Date(time_now.getTime() + (180 + minutes_until_next_event) * UTC_PER_MINUTE);

  console.log(time_now);
  console.log(time_of_next_event);

  res.json({
    "nextEvent": next_event_descriptor,
    "timeOfNextEvent": time_of_next_event
  });
});

app.get('/join', function(req, res){
  var new_user_id = create_new_user();

  res.json({
    "user_id": new_user_id
  });
});

app.get('/winner', function(req, res){
  var winner  = users[users.length - 1];

  res.json({
    "message": "This is just a test",

    "user_id": users.length - 1,
    "user_name": winner.user_name,
    "moves_taken": winner.commands.length,
    "commands_used": winner.commands,
    "solved_in": 420 // hardcoded for now
  });
});

function areCommandsValid(commands){
  var validCommands = [0, 1, 2, 3, 4];

  for(var i in commands){
    if(validCommands.indexOf(commands[i]) == -1){
      return false;
    }
  }

  return true;
}

app.post('/commands', function(req, res){
  var resp = "";
  var statusCode = 400; // assume all is unwell unless otherwise specified

  if(req.body.user_id in users){

    if(areCommandsValid(req.body.commands)){
      users[req.body.user_id].commands = req.body.commands;
      resp = "Confirmed";
      statusCode = 200;
    } else {
      resp = "Denied. Command array is invalid."
    }
  } else {
    resp = "Denied. No user with that ID found";
  }

  res.statusCode(statusCode).json({
    "message": resp
  });
});

app.post('/set_username', function(req, res){
  if(req.body.user_id in users){
    users[req.body.user_id].user_name = req.body.user_name;

    res.json({
      "username_result": "user_id " + req.body.user_id
        + " has set their username to " + req.body.user_name
    });
  } else {
    res.json({
      "ERROR": "a user with that username does not exist"
    });
  }
});

app.listen(80, "0.0.0.0");