const express = require("express");
const fs = require("fs");
const router = express.Router();
const formidable = require("formidable");
const path = require("path");

router.post("/upload", (req, res) => {
  if (!process.env.PROCESSING) {
    let form = new formidable.IncomingForm();
    const filePath = path.join(__dirname, "..", "assets");
    form.parse(req);
    form.on("fileBegin", function(name, file) {
      file.path = path.join(filePath, `black_${file.name}`);
    });
    form.on("end", () => {
      res.send("Image is saved!");
    });
  } else {
    res.send("Processing different data!");
  }
});

module.exports = router;
