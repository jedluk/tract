const { checkPaths } = require('./config/assets');
const http = require('http');
const app = require('./api/app');
const logger = require('./config/logger');

(async function makeFileServer() {
  try {
    await checkPaths();
    const { PORT = 8081 } = process.env;
    http.createServer(app).listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Cannot start fileserver! ' + err);
  }
})();
