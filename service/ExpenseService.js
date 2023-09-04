const pool = require("../db.js");

exports.createExpenseSharing = async (connection, title, description, category, participants, callback) => {

    try {

        // Start a transaction
        connection.beginTransaction();

        // Insert data into the 'expense_sharing' table
        const insertQuery = "INSERT INTO expense_sharing (title, description, category) VALUES (?, ?, ?)";
        const insertValues = [title, description, category];

        connection.query(insertQuery, insertValues, (error, results) => {
            if (error) {
                // Rollback the transaction in case of an error
                connection.rollback(() => {
                    console.error("Error creating expense sharing:", error.message);
                    connection.end(); // Close the database connection
                });
                return callback(error);
            }
            console.log(results);
            const expenseId = results.insertId;
            console.log(expenseId);

            // Insert data into the 'expense_sharing_participants' table
            const participantValues = participants.map((participant) => [expenseId, participant]);
            const participantQuery = "INSERT INTO expense_sharing_participants (expense_sharing_id, participants) VALUES ?";

            connection.query(participantQuery, [participantValues], (err) => {
                if (err) {
                    // Rollback the transaction in case of an error
                    connection.rollback(() => {
                        console.error("Error creating expense sharing:", err.message);
                        connection.end(); // Close the database connection
                    });
                    return callback(err);
                }

                // Commit the transaction
                connection.commit((commitErr) => {
                    if (commitErr) {
                        console.error("Error committing transaction:", commitErr.message);
                        return callback(commitErr);

                    }

                    console.log("Expense sharing created successfully");

                    connection.release(); // Close the database connection
                    callback(null, expenseId);
                });
            });
        });
    } catch (error) {
        console.error("Error creating expense sharing:", error.message);
        return callback(error);
    }
};
exports.getAllExpenseSharing = async (connection, callback) => {
    try {
        connection.beginTransaction();
        const sqlQuery =
            "SELECT es.*,GROUP_CONCAT(esp.participants) as participants  FROM expense_sharing AS es LEFT OUTER  JOIN expense_sharing_participants as esp on es.id=esp." +
            "expense_sharing_id GROUP BY es.id";
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.log(err.message);
                return callback(err);
            }

            const processedResults = results.map((result) => ({
                ...result,
                participants: result.participants.split(',').map((participant) => participant.trim()),
            }));
            //  console.log(data)


            //   console.log(data)

            // for (let row of data) {
            //     let sqlQuery = 'SELECT * from expense_sharing_participants WHERE expense_sharing_id=?';
            //     let participants = [];
            //     connection.query(sqlQuery, [row.id], (error, filterData) => {
            //         if (error) {
            //             console.log(error.message);
            //             return callback(error);
            //         }
            //          filterData=JSON.stringify(filterData);
            //         //  console.log(filterData)
            //         for (let val of filterData) {
            //             //  console.log(val.participants);
            //             participants.push(val.participants)
            //         }
            //         // console.log(participants);
            //     })
            //     row.participants = participants;
            //     // console.log(row);

            // }
            callback(null, processedResults);
        })
    } catch (err) {
        console.log(err.message);
        return callback(err);
    }
}
exports.getExpenseSharingById = async (connection, id, callback) => {
    try {
        connection.beginTransaction();
        const sqlQuery = "SELECT es.*,GROUP_CONCAT(esp.participants) as participants  FROM expense_sharing AS es LEFT OUTER  JOIN expense_sharing_participants as esp on es.id =esp." +
            "expense_sharing_id WHERE es.id=? GROUP BY es.id";
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.log(err.message);
                return callback(err);
            }
            const processedResults = results.map((result) => ({
                ...result,
                participants: result.participants.split(',').map((participant) => participant.trim())

            }))
            if (processedResults.length === 0) {
                const response = { message: 'Record not found' };
                callback({ status: false, response });
            }
            else {
                callback(null, processedResults)
            }



        })
    } catch (error) {
        console.log("Error in getExpenseSharingById", error.message)
        callback(error, null)
    }
};
exports.updateExpenseSharing = () => ({ msg: "test" });
exports.deleteExpenseSharingById = () => ({ msg: "test" });
exports.createExpense = () => ({ msg: "test" });
exports.getAllExpenses = () => ({ msg: "test" });
exports.getAllExpensesByGroupId = () => ({ msg: "test" });
exports.getExpenseById = () => ({ msg: "test" });
exports.updateExpense = () => ({ msg: "test" });
exports.deleteExpense = () => ({ msg: "test" });
exports.getTransactionEntriesByExpenseId = () => ({ msg: "test" });
exports.getGroupBalance = () => ({ msg: "test" });
