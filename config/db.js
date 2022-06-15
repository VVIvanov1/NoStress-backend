const mongoose = require("mongoose");
const path = require("path");
// const mongoose = require("mongoose");
const connUrl = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@backofice.v7bq8ry.mongodb.net/?retryWrites=true&w=majority`;
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connUrl, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
