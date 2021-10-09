var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
    name: String,
    img: String,
    descrip: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});
module.exports = mongoose.model("Campground", campSchema);