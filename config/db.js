const mongoose = require("mongoose");
const path = require("path");
// const mongoose = require("mongoose");
const connUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@backofice.v7bq8ry.mongodb.net/?retryWrites=true&w=majority`;
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
