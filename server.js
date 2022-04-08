const express = require("express");
const db = require("./db/db");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// importing routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/posts", postRoutes);

db();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
