const express = require("express");
const fs = require("fs");
const path = require("path");
const publicPath = path.join(__dirname, '..', 'client','public');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(require("./routes/upload"));


if (!fs.existsSync(path.join(__dirname, "assets"))) {
  fs.mkdir(path.join(__dirname, "assets"), err => {
    if (err) {
      console.log("Could not create assets folder on server side");
    }
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath,'index.html'));
  });
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
