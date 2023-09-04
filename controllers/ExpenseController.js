const express = require("express");
const router = express.Router();
const ExpenseService = require("../service/ExpenseService");
const pool = require("../db.js");


router.use(express.json())
router.post("/group", async (req, res) => {
    await pool.getConnection(
        (error, connection) => {
            if (error) {
                console.error("Error connecting to MySQL:", error);
                throw error;
            }
            console.log("Connected to MySQL");
            const { title, description, category, participants } = req.body;
            if (!title || title.trim() === "") {
                return res.status(400).json({ error: "Title is required." });
            }
            if (!Array.isArray(participants) || participants.length === 0 || participants.length === 1) {
                return res.status(400).json({ error: "Participants must be a non-empty array." });
            }

            ExpenseService.createExpenseSharing(connection, title, description, category, participants, (error, expenseId) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.status(200).json({
                        "id": expenseId,
                        title,
                        description,
                        category, participants

                    });
                }
            });


        });



});
router.get("/groups", async (req, res) => {
    await pool.getConnection(
        (error, connection) => {
            if (error) {
                console.error("Error connecting to MySQL:", error);
                throw error;
            }
            console.log("Connected to MySQL");
            ExpenseService.getAllExpenseSharing(connection, (error, data) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.status(200).json(data);
                }
            });

        });
})
router.get("/groupById/:id", async (req, res) => {
    await pool.getConnection(
        (error, connection) => {
            if (error) {
                console.error("Error connecting to MySQL:", error);
                throw error;
            }
            console.log("Connected to MySQL");
            const { id } = req.params;
            // console.log(id)
            ExpenseService.getExpenseSharingById(connection, id, (error, data) => {
                if (error) {
                    res.status(400).json(error);
                }
                else if (!data) {
                    res.status(400).json("record not found")
                }
                else {
                    res.status(200).json(data);
                }
            });

        });

});
router.post("/group/update/:id", async (req, res) => {
    let result = await ExpenseService.updateExpenseSharing();
    res.send(result);
});
router.post("/group/delete/:id", async (req, res) => {
    let result = await ExpenseService.deleteExpenseSharingById();
    res.send(result);
});
router.post("/group/:groupId/addExpense", async (req, res) => {
    let result = await ExpenseService.createExpense();
    res.send(result);
});
router.get("/", async (req, res) => {
    let result = await ExpenseService.getAllExpenses();
    res.send(result);
});
router.get("/group/:groupId", async (req, res) => {
    let result = await ExpenseService.getAllExpensesByGroupId();
    res.send(result);
});
router.get("/:expenseId", async (req, res) => {
    let result = await ExpenseService.getExpenseById();
    res.send(result);
});
router.post("/update/:expense_id", async (req, res) => {
    let result = await ExpenseService.updateExpense();
    res.send(result);
});
router.post("/delete/:expense_id", async (req, res) => {
    let result = await ExpenseService.deleteExpense();
    res.send(result);
});
router.get("/transaction/:expenseId", async (req, res) => {
    let result = await ExpenseService.getTransactionEntriesByExpenseId();
    res.send(result);
});
router.get("/group/:groupId/balance", async (req, res) => {
    let result = await ExpenseService.getGroupBalance();
    res.send(result);
});
module.exports = router;
