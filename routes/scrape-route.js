var express = require("express");
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var router = express.Router();

router.get("/scrapeAll", function(req, res){
    // first, we grab the body of the html with axios:
    //console.log("executing router.get /scrapeAll...");
    axios.get("https://www.nytimes.com/section/us").then(function(response){
        
        // console.log("executing axios.get...."); 
            
        var $ = cheerio.load(response.data);

        //console.log($); 
        
        $("div.css-13mho3u ol li ").each(function(i, element){
            var result = {};

            result.title = $(element).find("a").children("h2").text().trim();
            result.link = "https://www.nytimes.com" + $(element).find("a").attr("href"); 
            result.summary = $(element).find("a").children("p").text().trim();
            
//            console.log(result);

            // Add article to the database 
            // a. check if article already exists:
            db.Article.find({
                title: result.title
            }, function(err, data){
                // log if any error
                if (err){
                    console.log(err);
                }
                if (data.length === 0){
                    // no data in the db.. insert
                    db.Article.create(result).then(function(dbArticle){
                        
                    }).catch(function(err){
                        console.log(err);
                    });
                }
                // if article is in the database (data.length > 0), end res
                if (data.length !== 0){
                    res.end();
                }
            });
        });
        
        // send message to the client
        res.send("Scrape complete...");
    });
    
});

module.exports = router;

