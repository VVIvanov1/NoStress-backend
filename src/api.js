const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const mongoDB = require("../config/db");
const path = require("path");
app.use(cookieParser());
const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      callback(new Error(msg), false);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
// app.use(
//   cors({
//     // origin: function (origin, callback) {
//     //   return callback(null, true);
//     // },
//     optionsSuccessStatus: 200,
//     credentials: true,
//     origin: "http://localhost:3000",
//   })
// );
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const orderRouter = require("../routes/orderRoutes");
const userRouter = require("../routes/userRoutes");
mongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { errorHandler } = require("../middleware/errorHandler");
// app.use((req, res, next) => {
//   const err = new Error("Not found");
//   err.status = 404;
//   next(err);
// });

// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.send({ error: { message: err.message } });
// });

app.use("/.netlify/functions/api/orders", orderRouter);
app.use("/.netlify/functions/api/users", userRouter);

// app.use(express.static(path.join(__dirname, "../client/build")));

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

app.use(errorHandler);
module.exports = app;
module.exports.handler = serverless(app);
