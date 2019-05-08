var mongoose = require("mongoose"); 

// save reference to the Schema constructor
var Schema = mongoose.Schema; 

// Using the Schema constructor, create a new UserSchema object 

var ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    }, 
    // 'link' is required and String
    link: {
        type: String,
        required: true
    }, 
    // 'summary' is required and string
    summary: {
        type: String,
        required: true
    },
    // 'comments' is an object that stores a comment id
    // the ref property links the ObjectId to the Comment model
    // this allows us to populate the Article with an associated note
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
