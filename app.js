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

app.get("/", function(req, res) {
    res.redirect("/home");
});
app.get("/home", function(req, res) {
    res.render("home");
});
app.get("/main", function(req, res) {
    res.render("main.ejs");
});

app.get("/*", function(req, res) {
    res.send("Error 404 - File not found");
});

app.listen(8080, "127.0.0.1", function() {
    console.log("server running");
});