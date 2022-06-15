"use strict";

const app = require("./src/api");

app.listen(process.env.PORT || 5000, () =>
  console.log("Local app listening on port 5000!")
);
