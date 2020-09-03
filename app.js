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
app.get("/about", function(req, res) {
    res.render("about");
});
app.get("/photographs", function(req, res) {
    Photograph.find({}, function(err, photographs) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.render("photographs", { photographs: photographs });
        }
    });
});
app.get("/photographs/new", function(req, res) {
    res.render("form");
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

app.get("/photographs/:id", function(req, res) {
    var photoid = req.params.id;
    Photograph.findById(photoid, function(err, photo) {
        if (err) {
            console.log(err);
            res.status(404).send();
        } else {
            res.render("photodetails", { photo: photo });
        }
    });

});


app.get("/photographs/:id/edit", function(req, res) {
    var id = req.params.id;
    Photograph.findById(id, function(err, photo) {
        if (err) {
            console.log(err);
            res.status(404).send();
        } else {
            res.render("photograph-edit", { photo: photo });
        }
    });

});

app.post("/photographs/:id", function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var img = req.body.image;
    var descrip = req.body.descrip;
    var author = req.params.id;
    var object = { name: name, img: img, descrip: descrip, author: author }
    Photograph.findByIdAndUpdate(id, object, function(err, updated) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.redirect("/photographs/" + id);
        }
    });
});

app.get("/*", function(req, res) {
    res.status(404).send();
});

app.listen(8080, "127.0.0.1", function() {
    console.log("server running");
});