var sqlite3 = require("sqlite3");
let db = new sqlite3.Database(
    "../infochange.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err && err.code == "SQLITE_CANTOPEN") {
            createDatabase();
            return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        runQueries(db);
    }
);

function createDatabase() {
    var newdb = new sqlite3.Database("infochange.db", (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

module.exports = db;
