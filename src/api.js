const express = require("express");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const mongoDB = require("../config/db");
const path = require("path");
app.use(cookieParser());

var whitelist = [
  "https://corp-baigroupkz.netlify.app",
  "http://localhost:3000",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// var allowlist = [
//   "http://localhost:3000",
//   "https://corp-baigroupkz.netlify.app",
// ];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = {
//       origin: true,
//       Headers: { "Access-Control-Allow-Credentials": "true" },
//     }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };
// app.use(cors(corsOptionsDelegate));
// app.use(
//   cors({ credentials: true, origin: "https://corp-baigroupkz.netlify.app" })
// );
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://corp-baigroupkz.netlify.app",
// ];
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
// var corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors());

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
