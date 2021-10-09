var mongoose = require("mongoose");
var passportlocalMongoose = require("passport-local-mongoose");

var usersSchema = new mongoose.Schema({
    username: String,
    password: String,
});
usersSchema.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", usersSchema);