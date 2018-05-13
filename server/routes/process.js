const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { processImage } = require("../tensor/processingModule");

router.get("/process", (req, res) => {
  const { grayImg, colorImg, outImg } = req.query;
  console.log(`Parameters requested: ${grayImg} , ${colorImg} , ${outImg}`);
    processImage(grayImg, colorImg, outImg)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send(err);
      });
});

module.exports = router;
