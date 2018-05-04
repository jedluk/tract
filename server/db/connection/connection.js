const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const { name, user, password } = require("./config");
const db = {
  localhost: `mongodb://localhost:27017/${name}`,
  mlab: `mongodb://${user}:${password}@ds215370.mlab.com:15370/${name}`
};

mongoose
  .connect(process.env.NODE_ENV === "production" ? db.mlab : db.localhost)
  .then(() => console.log("Connection with DB has been established"))
  .catch(e => console.log(e));

module.exports = { mongoose };

