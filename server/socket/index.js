const {loadImages, saveImage} = require("./processing");
const logger = require("../config/logger");
const request = require("request");

const TFURL = process.env.TFSERVER || "http://127.0.0.1:4000/api";

function sendRequest(data, socket) {
  request.post(
    TFURL,
    data,
    function (error, response, body) {
      if(!error && response.statusCode == 200) {
        saveImage(body.img, (outImgName) => {
          socket.emit("finished processing", {outImgName: outImgName});
          logger.info(`Sent image to client: ${outImgName}`);
        });
      }
      else {
        logger.info(`Request failed`);
      };
    }
)};

module.exports = (io) => {
  io.on("connection", socket => {
    logger.info(`Client connected`);
    socket.on("process", ({ gray, color }) => {
        loadImages(gray, color, (data) => {
          logger.info(`Sending request to tfServer with socketID: ${socket.id}`);
          sendRequest(data, socket)
        });
    });
  });
};
