var express = require("express");
var db = require("../models");
var router = express.Router();

//getting all the comments from the db:
router.get("/my-comments", function(req,res){
    db.Comment.find({}, function(error, data){
        //Log errors
        if (error) {
            console.log(error);
        } // else - send result to browser
        else{
            res.json(data);
        }
    });
});

// route to post a comment to the database: 
router.post('/submit', function(req, res) {
    var commentId = [];
    
    db.Comment.create(req.body)
      .then(function(dbComment) {
        commentId.push(dbComment._id);
        return db.Article.findOneAndUpdate({ _id: req.body.article_id }, { $push: { comments: dbComment._id } }, { new: true });
      
      })
      .then(function(dbUser) {
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

//route to delete a comment:
router.delete('/delete/:id', function(req, res) {
    db.Comment.findByIdAndRemove({ _id: req.params.id}, function(err) {
      if (err)
          res.send(err);
      else
          res.json("delete");
    });
  });

module.exports = router;