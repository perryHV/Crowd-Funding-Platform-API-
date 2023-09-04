const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const ExpenseController = require("./controllers/ExpenseController");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/expense", ExpenseController);
app.listen(process.env.PORT, () => {
    console.log(
        "Project url: https://" + process.env.PORT + ".sock.hicounselor.com"
    );
});
