const processImage = require("./processing");
const logger = require("../config/logger");

module.exports = io => {
  io.on("connection", socket => {
    socket.on("process", ({ gray, color }) => {
      processImage(gray, color)
        .then(data => {
          socket.emit("finished processing", data);
        })
        .catch(err => {
          logger.error(err);
        });
    });
  });
};
