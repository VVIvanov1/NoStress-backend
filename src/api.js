const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const mongoDB = require("../config/db");
const path = require("path");
app.use(cookieParser());

function returnAccessControlHeader(req) {
  let allowed = [
    "http://localhost:3000",
    "https://corp-baigroupkz.netlify.app",
    "http://project5380228.tilda.ws",
    "https://baigroupkz.com",
  ];
  if (allowed.indexOf(req.headers.origin) !== -1) {
    return req.headers.origin;
  } else {
    return false;
  }
}
app.use((req, res, next) => {
  console.log(req.path);
  console.log(req.params);
  console.log(req.query);
  console.dir(req.body);
  next();
});

app.use((req, res, next) => {
  let hdr = returnAccessControlHeader(req);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Origin", hdr);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    return res.status(200).json({});
  }
  next();
});

const orderRouter = require("../routes/orderRoutes");
const userRouter = require("../routes/userRoutes");
mongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { errorHandler } = require("../middleware/errorHandler");

app.use("/orders", orderRouter);
app.use("/users", userRouter);

app.use(errorHandler);
module.exports = app;
module.exports.handler = serverless(app);

// app.get("*", (req, res) =>
//   res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"))
// );
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("../../NoStress-front/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "NoStress-front", "build", "index.html")
//     );
//   });
// }
