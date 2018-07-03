const http = require("http");
const app = require('./api/app');
const logger = require('./config/logger');
const checkPaths = require("./config/paths")();
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app).listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const IO = socketIO(server);
require('./socket')(IO);
