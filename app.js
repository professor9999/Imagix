var express = require("express");
var app = express();
var http = require("http");
var ejs = require("ejs");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStratergy = require("passport-local");
var session = require("express-session");
var Campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var flash = require('connect-flash');

mongoose.connect("mongodb://localhost/campgrounds", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(flash());

app.use(session({
    secret: "secret CIA",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("error");
    res.locals.message2 = req.flash("success");
    next();
});

//==============================
//PRIMARY ROUTES
//==============================

app.get("/", function(req, res) {
    res.redirect("/home");
});
app.get("/home", function(req, res) {
    res.render("home");
});
app.get("/photos", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        res.render("campground", { campgrounds: campgrounds });
    });
});
app.get("/campgrounds", function(req, res) {
    res.redirect("/photos");
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.descrip;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var object = { name: name, descrip: description, img: image, author: author };
    Campground.create(object);
    res.redirect("/campgrounds");
});

app.get("/photos/new", isLoggedIn, function(req, res) {
    res.render("new");
});
app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.redirect("/photos/new");
});

app.get("/photos/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campsite) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.render("campsite", { camp: campsite });
        }
    });
});

app.get("/campgrounds/:id", function(req, res) {
    res.redirect("/photos/" + req.params.id);
});

app.get("/photos/:id/edit", function(req, res) {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        Campground.findById(id, function(err, campsite) {
            if (err) {
                res.send("<h2>ERROR 404</h2>");
            } else {
                if (req.user._id == String(campsite.author.id)) {
                    res.render("campground-edit", { camp: campsite });
                } else {
                    res.status(401).send();
                }

            }
        });
    } else {
        req.flash("info", "Login to edit photos!");
        res.redirect("/login");
    }
});

app.get("/campgrounds/:id/edit", function(req, res) {
    res.redirect("/photos/" + req.params.id + "/edit");
});

app.post("/campgrounds/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var img = req.body.image;
    var descrip = req.body.descrip;
    var object = { name: name, img: img, descrip: descrip }
    Campground.findByIdAndUpdate(id, object, function(err, updated) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.redirect("/campgrounds/" + id);
        }
    });
});

app.post("/campgrounds/:id/delete", isLoggedIn, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campsite) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            if (req.user._id == String(campsite.author.id)) {
                Campground.findByIdAndRemove(id, function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send();
                    } else {
                        res.redirect("/campgrounds");
                    }
                });
            } else {
                console.log("Unauthorised access");
                res.redirect("/campgrounds/" + id);
            }
        }

    });
});


//==============================
//COMMENT ROUTES
//==============================

app.get("/photos/:id/comments/new", isLoggedIn, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campsite) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.render("comments/new", { camp: campsite });
        }
    });
});
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    res.redirect("/photos/" + req.params.id + "/comments/new");
});
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campsite) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + id);
        } else {
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            var comment = req.body.comment;
            Comment.create({ text: comment, author: author }, function(err, comment) {
                campsite.comments.push(comment);
                campsite.save();
                res.redirect("/campgrounds/" + id);
            });
        }
    });
});

app.get("/photos/:id/comments/:comment_id/edit", isCommentOwner, function(req, res) {
    if (req.isAuthenticated()) {
        var id = req.params.id;
        if (req.user)
            Campground.findById(id, function(err, campsite) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                } else {
                    var comment_id = req.params.comment_id;
                    Comment.findById(comment_id, function(err, selectedComment) {
                        if (err) {
                            console.log(err);
                            res.status(500).send();
                        }
                        res.render("comment-edit", { selectedComment: selectedComment, camp: campsite });
                    });
                }
            });
    } else {
        res.redirect("/login");
    }
});

app.get("/campgrounds/:id/comments/:comment_id/edit", isCommentOwner, function(req, res) {
    res.redirect("/photos/" + req.params.id + "/comments/" + req.params.comment_id + "/edit");
});

app.post("/campgrounds/:id/comments/:comment_id", isCommentOwner, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campsite) {
        if (err) {
            res.redirect("/campgrounds/" + id);
        } else {
            var comment_id = req.params.comment_id;
            var text = req.body.text;
            var object = { text: text };
            Comment.findByIdAndUpdate(comment_id, object, function(err, updated) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                } else {
                    req.flash("success", "Your comment has been edited");
                    res.redirect("/campgrounds/" + id);
                }
            });
        }
    });
});

app.post("/campgrounds/:id/comments/:comment_id/delete", isCommentOwner, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, campsite) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (req.user)
                var comment_id = req.params.comment_id;
            Comment.findByIdAndRemove(comment_id, function(err) {
                req.flash("success", "Your comment has been deleted");
                res.redirect("/campgrounds/" + id);
            });
        }
    })
});

//==============================
//AUTHORISATION ROUTES
//==============================

app.get("/signin", function(req, res) {
    res.render("auth/signin");
});

app.post('/signin', function(req, res, next) {

    User.register(new User({ username: req.body.username }), req.body.password, function(err) {
        if (err) {
            console.log('error while user register!', err);
        }
        req.flash("success", "You have signed in a new account");
        res.redirect('/home');
    });
});

app.get('/login', function(req, res) {
    res.render("auth/login");
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    req.flash("success", "You have loggged in");
    res.redirect('/home');
});

app.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "You have logged out");
    res.redirect("back");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in");
    res.redirect("/login");
}

function isCommentOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds/" + req.params.id);
            } else {
                if (String(comment.author.id) == req.user._id) {
                    return next();
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    } else {
        res.redirect("/login");
    }
}

app.get("*", function(req, res) {
    res.status(404).send();
});

app.listen(8080, '127.0.0.1', function() {
    console.log('Yelp server running on port 8080');
});