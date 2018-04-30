const express = require("express");
const fs = require("fs");
const path = require("path");
const { checkPaths } = require('./utils/checkPaths');
const publicPath = path.join(__dirname, "..", "client", "public");

const PORT = process.env.PORT || 5000;

checkPaths();

const app = express();
app.use(require("./routes/upload"));
app.use(require("./routes/process"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
