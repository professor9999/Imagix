var express = require("express");
var app = express();
var http = require("http");
var ejs = require("ejs");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStratergy = require("passport-local");
var session = require("express-session");
//var Photographs = require("./models/photographs");
//var Comment = require("./models/comments");
//var User = require("./models/user");
//var flash = require('connect-flash');

mongoose.connect("mongodb://localhost/imagix", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: true }));

//================
//PRIMARY ROUTES
//================

app.use("/", function(req, res) {
    res.send("Working");
});

app.listen(8080, "127.0.0.1", function() {
    console.log("server running");
});