var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Scrapping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
//      it works on the client and on the server

var axios = require("axios");
var cheerio = require("cheerio"); 

// Require all models
var db = require("./models"); 

var PORT = process.env.PORT || 3000;

// initialize express
var app = express(); 

// connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapeNews"; 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }); 

//use morgan logger for logging requests
app.use(logger("dev")); 
//Parse request body as JSON
app.use(express.urlencoded({ extended: true})); 
app.use(express.json()); 

// Make public a static folder
app.use(express.static(path.join(__dirname, 'public'))); 

// ----------------------------
// Routes
// ----------------------------
// GET route for scraping NY Times
app.use('/app/scrape', require('./routes/scrape-route'));
// route for articles
app.use('/app/articles', require('./routes/article-route')); 
app.use('/app/comments', require('./routes/comment-route'));

// Start the server
app.listen(PORT, function(){
    console.log("ScrapeNews app running on port " + PORT + "!");
}); 