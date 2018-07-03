const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const publicPath = path.join(__dirname, "..", "..", "client", "public");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(require("./routes"));
app.use(require('./middleware/errorHandler'));
app.use(express.static(publicPath));
app.use("/ready", express.static(path.join(publicPath, "img", "gallery")));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;
