const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const { name, user, password, mongoURL } = require("./config");
const db = {
  localhost: `mongodb://localhost:27017/${name}`,
  mlab: `mongodb://${user}:${password}@${mongoURL}/${name}`
};

mongoose
  .connect(process.env.NODE_ENV === "production" ? db.mlab : db.localhost)
  .then(() => console.log("Connection with DB has been established"))
  .catch(e => console.log(e));

module.exports = { mongoose };

