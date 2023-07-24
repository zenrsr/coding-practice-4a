const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite = require("sqlite3");
let db = null;
const DatabasePath = path.join(__dirname, "cricketTeam.db");

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: DatabasePath,
      driver: sqlite.Database,
    });
    app.listen(3010, () => {
      console.log("Server running at http://localhost:3010/");
    });
  } catch (e) {
    console.log(`Database Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

// API 1
app.get("/players/", async (request, response) => {
  const getQuery = `SELECT * FROM cricket_team;`;
  const x = await db.all(getQuery);
  response.send(x.map((each) => convertDbObjectToResponseObject(each)));
});
// API 2
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const getQuery = `
        INSERT INTO cricket_team (player_name,jersey_number,role)
        VALUES (
            '${playerName}',
            ${jerseyNumber},
            '${role}'
        );
        `;
  try {
    const x = await db.run(getQuery);
    console.log(x);
    const playerId = x.lastID;
    console.log({ playerId: playerId });
    response.send("Player Added to Team");
  } catch (e) {
    console.log(`${e.message}`);
  }
});
// API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const x = await db.get(getQuery);
  //   const result = x.map((each) => convertDbObjectToResponseObject(each));
  const result = convertDbObjectToResponseObject(x);
  response.send(result);
});
// API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const getQuery = `
        UPDATE cricket_team
        SET 
            player_name = '${playerName}',
            jersey_number = ${jerseyNumber},
            role = '${role}'
        WHERE 
            player_id = ${playerId};
            `;
  try {
    const x = await db.run(getQuery);
    response.send("Player Details Updated");
  } catch (e) {
    console.log(`${e.message}`);
  }
});
// APi 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(getQuery);
  response.send("Player Removed");
});

module.exports = app;
