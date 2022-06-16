const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const mongoDB = require("../config/db");
const path = require("path");
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://corp-baigroupkz.netlify.app/",
];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       var msg =
//         "The CORS policy for this site does not " +
//         "allow access from the specified Origin.";
//       callback(new Error(msg), false);
//     }
//   },
//   optionsSuccessStatus: 200,
//   // credentials: true,
// };
// app.use(cors(corsOptions));
app.use(cors());

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
