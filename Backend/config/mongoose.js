const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

module.exports = connection;
// connection.on("connected", function () {
//   console.log("DB connected");
// });
