const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const publicPath = path.join(__dirname, "..", "..", "client", "public");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if(process.env.NODE_ENV !== "production"){
  app.use(morgan("dev"));
}
app.use(require("./routes"));
app.use(require('./middleware/errorHandler'));
app.use(express.static(publicPath));
app.use("/ready", express.static(path.join(publicPath, "img", "gallery")));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;
