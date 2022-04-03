const express = require("express");
const db = require("./db/db");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importing routes
const userRoutes = require("./routes/user");

app.use("/api/v1/user", userRoutes);

db();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
