# NodeServer

## API Spec

Current server IP: **172.19.59.128**

###Video Streaming
????

###GET /schedule
```
return JSON:
{
    "nextEvent": String, // descriptor of next event
    "timeOfNextEvent": DateTime
}
```

###POST /commands
```
Post JSON:
{
    "user_id": Number,
    "commands": Array of Number
}
```

```
return JSON:
{
    "submission", String ("confirmed", "denied")
}
```

###POST /set_username
```
Post JSON:
{
    "user_id": String,
    "user_name": String
}
```

###GET /winner
```
return JSON:
{
    "user_id": Number,
    "user_name": String,
    "moves_taken": Number,
    "commands_used": Array of Number,
    "solved_in": Number (seconds)
}
```

## Commands
```
0 = forward a grid
1 = backward a grid
2 = left 90 degrees
3 = right 90 degrees
```