# NodeServer

## API Spec

###GET /schedule
```
return JSON:
{
    "next_game": DateTimeObj,
    "submissions_close": DateTimeObj
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
Post JSON:
{
    "user_id": String,
    "user_name": String
}

###GET /winner
return JSON:
{
    "user_id": Number,
    "user_name": String,
    "moves_taken": Number,
    "commands_used": Array of Number,
    "solved_in": Number (seconds)
}