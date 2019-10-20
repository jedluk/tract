const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { assetsDir } = require('../config/assets');

const app = express();
app.use(express.json());
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'common'));
app.use(require('./routes'));
app.use(require('./middleware/errorHandler'));
app.use(express.static(assetsDir));

module.exports = app;
