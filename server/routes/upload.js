const express = require("express");
const router = express.Router();
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

router.post("/upload", (req, res) => {
  let form = new formidable.IncomingForm();
  const filePath = path.join(__dirname, "..", "assets");
  form.parse(req);
  form.on("fileBegin", (name, file) => {
    file.path = path.join(filePath, name);
  });
  form.on("end", () => {
    res.send("Captured image!");
  });
});

module.exports = router;
