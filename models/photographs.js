var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
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

    }

});
module.exports = mongoose.model("Photograph", photoSchema);