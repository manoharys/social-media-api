const mongoose = require("mongoose");

const databaseUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/socailMedia";

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
