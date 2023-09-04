const mysql = require("mysql");
const pool = mysql.createPool({
    host: "localhost",
    user: "b8978bb4",
    password: "Cab#22se",
    database: "b8978bb4",
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
    }
    console.log("Connected to MySQL");
    connection.release();
});

module.exports = pool;
