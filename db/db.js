const mongoose = require("mongoose");
require("dotenv").config();

const databaseUrl = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(databaseUrl, { useNewUrlParser: true });
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = connectDb;
