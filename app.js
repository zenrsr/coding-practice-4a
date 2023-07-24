// API 1
GET http://localhost:3010/players/
###

// API 2
POST http://localhost:3010/players/
Content-Type: application/json

{
  "playerName": "Vishal",
  "jerseyNumber": 17,
  "role": "Bowler"
}
###

// API 3
GET http://localhost:3010/players/12/
###

// API 4
PUT http://localhost:3010/players/5/
Content-Type: application/json

{
  "playerName": "Maneesh",
  "jerseyNumber": 4,
  "role": "All-rounder"
}
###

// API 5
DELETE http://localhost:3010/players/5/
