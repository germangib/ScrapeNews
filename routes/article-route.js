var express = require('express');
var db = require("../models");
var router = express.Router();

// get all articles from the database
router.get("/", function(req, res){
    db.Article.find().sort({"title": 1}).exec(function(error, data){
        //Log any errors
        if(error){
            console.log(error);
        }
        // else, send the result to the browser
        else{
            res.json(data); 
        }
    });
}); 

module.exports = router; 