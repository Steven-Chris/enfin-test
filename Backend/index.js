const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("./config/mongoose");
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

const bookRoutes = require("./api/routes/bookRoutes");
app.use("/book", bookRoutes);

mongoose.on("connected", function () {
  console.log("DB connected");
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
});
