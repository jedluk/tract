const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(require("./routes/upload"));

const PORT = process.env.PORT || 5000;

if (!fs.existsSync(path.join(__dirname, "assets"))) {
  fs.mkdir(path.join(__dirname, "assets"), err => {
    if (err) {
      console.log("Could not create assets folder on server side");
    }
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
}

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
