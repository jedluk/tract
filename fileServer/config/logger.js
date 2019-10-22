const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(format.splat(), format.timestamp(), format.simple()),
  transports: [new transports.Console(), new transports.File({ filename: 'log.log' })]
});

module.exports = logger;
