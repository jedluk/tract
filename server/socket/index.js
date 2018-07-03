const processImage = require("./processing");

module.exports = io => {
  io.on("connection", socket => {
    socket.on("process", ({ gray, color }) => {
      processImage(gray, color)
        .then(data => {
          socket.emit("finished processing", data);
        })
        .catch(err => {
          socket.emit("error", err);
        });
    });
  });
};
