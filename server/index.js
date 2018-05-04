const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { checkPaths } = require("./utils/checkPaths");
const { checkDocuments } = require("./utils/checkDocuments");
const publicPath = path.join(__dirname, "..", "client", "public");

const PORT = process.env.PORT || 5000;
const { mongoose } = require("./db/connection/connection");

checkPaths();
checkDocuments();

const app = express();
app.use(bodyParser.json());
app.use(require("./routes/upload"));
app.use(require("./routes/process"));
app.use(require("./routes/votes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
