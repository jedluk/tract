const {loadImages, saveImage} = require("./processing");
const logger = require("../config/logger");

module.exports = (io, tfServer) => {
  io.on("connection", socket => {
    logger.info(`Client connected`);
    socket.on("process", ({ gray, color }) => {
        logger.info(`Started processing, sending request to tfServer with socketID: ${socket.id}`);
        loadImages(gray, color, (grayImg, colorImg) => {
          tfServer.emit("process", grayImg, colorImg, socket.id);
        });
    });
  });
  tfServer.on("processed", data => {
    logger.info(`tfServer responded, socketID: ${data.socketID}`);
    saveImage(data, (outImgName) => {
      io.to(data.socketID).emit("finished processing", {outImgName: outImgName});
      logger.info(`sent image path to client: ${outImgName}`);
    });
  });
  tfServer.on("message", data => {
    logger.info(`tfServer sent message: ${data}`);
  });
};
