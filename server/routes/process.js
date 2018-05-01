const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { processImage } = require("../tensor/processingModule");

router.get("/process", (req, res) => {
  const { grayImg, colorImg, outImg } = req.query;
  // console.log(`Parameters requestes: ${grayImg} , ${colorImg} , ${outImg}`);
  if (process.env.NODE_ENV === "production") {
    setTimeout(() => {
      res.send({
        outImg: 'dafdfa00.jpg'
      });
    }, 5000);
  } else {
    processImage(grayImg, colorImg, outImg)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send(err);
      });
  }
});

module.exports = router;
