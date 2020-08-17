var express = require("express");
var app = express();
var http = require("http");
var ejs = require("ejs");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStratergy = require("passport-local");
var session = require("express-session");
var Photograph = require("./models/photographs");
//const photographs = require("./models/photographs");
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
app.get("/photographs", function(req, res) {
    Photograph.find({}, function(err, photographs) {
        if (err) {
            console.log(err);
        } else {
            res.render("photographs", { photographs: photographs });
        }
    });
});
app.get("/photographs/new", function(req, res) {
    res.render("new");
});

app.post("/photographs", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.descrip;
    var author = req.params.id;
    var object = { name: name, descrip: description, img: image, author: author };
    Photograph.create(object);
    res.redirect("/photographs");
});

app.get("/*", function(req, res) {
    res.send("Error 404 - File not found");
});

app.listen(8080, "127.0.0.1", function() {
    console.log("server running");
});