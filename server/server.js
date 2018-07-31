const http = require("http");
const app = require('./api/app');
const logger = require('./config/logger');
const checkPaths = require("./config/paths")();
const socketIO = require('socket.io');
const socketIOclient = require('socket.io-client');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app).listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const IO = socketIO(server);
const tfServer = socketIOclient.connect('ws://127.0.0.1:6000');
require('./socket')(IO, tfServer);
