var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors"); // add at the top

var restaurantsRouter = require("./routes/restaurants");
var usersRouter = require("./routes/users");

var app = express();

app.use(cors()); // add after 'app' is created
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); //not using public folder, using client folder

app.use("/api", restaurantsRouter);
app.use("/users", usersRouter);

module.exports = app;
