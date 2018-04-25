const express = require('express');
const app = express();

const PORT = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send({ hi: 'Make let not var !' })
});

app.listen(PORT);