const logger = require('../../config/logger');

module.exports = (error, req, res, next) => {
  logger.error(error.message || error.msg);
  res.status(error.status || 500);
  res.json({ message: error.message || error.msg });
};
