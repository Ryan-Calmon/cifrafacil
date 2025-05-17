// backend/dbUtils.js
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

function lerDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function salvarDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { lerDB, salvarDB };
