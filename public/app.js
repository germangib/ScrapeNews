$(document).ready(function(){
    var commentDivSelector;
    // Get all the news:  
    //console.log("app.js... on load");
    // 1. scrap all articles from the NY Times
    // 1.1 this procedure will inster the information into the db
    $.get('/app/scrape/scrapeAll', function(data){
       // $("#articles").append("<h2> ARTICLES </h2>");
    });

    // 2. get the articles from the database to display it
    getAllArticles();

    
});

//Scrap again if click on Jumbotron
$(document).on('click', '.jumbotron', function(){
    // 1. scrap all articles from the NY Times
    // 1.1 this procedure will inster the information into the db
    $.get('/app/scrape/scrapeAll', function(data){
        // $("#articles").append("<h2> ARTICLES </h2>");
     });
 
     // 2. get the articles from the database to display it
     getAllArticles();
});


// Function to get all articles from database
function getAllArticles(){
    console.log("getAllArticles...");
    $("#articles").empty();
    // go to db route and get the articles
    $.get('/app/articles', function(data){
        var articles = data; // avoid changing data, use other variable
        // Print articles in the screen..
        printArticles(articles);
    });
    console.log("end getAllArticles...");
}

// Function to print articles
function printArticles(articles){
    console.log("printArticles...");
    $("#articleScrapeInfo").empty();
    var tableRow = "";
    var tmpLinkvar = "";

    //console.log(articles); 

    for (var i = 0; i < articles.length; i++){
        
        /* design 
        ------ card ---------
        -----headRow -------
        /title / link / Summary
        ---- inputDiv ------
        /input form/ buttons
        --------------------
        */

        var card = $('<div class="card col-sm-12">');
        
        var headRow = $('<div class="card w-100">');
        var linkRow = $('<a href="' + articles[i].link + '" class="font-weight-bold h4" target="_blank"></a>'); 
        linkRow.text(articles[i].title);
        var summaryRow = $('<div class="text-center">');
        summaryRow.text(articles[i].summary);

        var commentBtn = $('<button class="btn text-white comment mt-5" id="' + articles[i]._id + '" disabled>');
        commentBtn.text('Write your comments below...');
        
        var inputDiv = $('<div class="commentDiv" id="input' + articles[i]._id + '">');
        var input = $('<textarea class="form-control mt-12" id="inputComment'+ articles[i]._id+ '" >');
        var submitInput = $('<button class="btn submitComment mt-5" key="'+articles[i]._id+ '">');
        submitInput.text('Submit your comment');
        var divPostedCom = $('<div class="border-top pt-3 mt-4" id="postComment' + articles[i]._id + '" >');

        $.get('/app/comments/', function(articles){
            for(var i=0; i < articles.length; i++){
                for(var j=0; j < articles.comments.length; j++){
                    if(articles[i]._id === articles.comments[j]){
                        divPostedCom.append($('<div class="border mt-2 p-3 w-75 commentborder addedComments" id="deleteBox'+articles[i]._id+'"><div class="text-right"><button class="btn deleteBtn text-white" id="'+articles[i]._id+'">x</button></div>'+articles[i].user+':<br>'+ articles[i].body +'</div>'));
                    }
                }
            }
        })

        linkRow.appendTo(headRow);
        summaryRow.appendTo(headRow);
        commentBtn.appendTo(headRow);

        input.appendTo(inputDiv);
        submitInput.appendTo(inputDiv);
        inputDiv.appendTo(headRow);
        divPostedCom.appendTo(headRow);
        headRow.appendTo(card);
        $("#articles").append(headRow);

    } // End For
    
    console.log("end of Print Articles...");
}


//click event to submit a comment to an article
$(document).on('click', '.submitComment', function(){
        
    var inputSelector = '#inputComment' + $(this).attr("key");
    commentDivSelector = '#input' + $(this).attr("key");
    var commentBtnSelector = '#' + $(this).attr("key");
    
    var newComment = { body: $(inputSelector).val(), article_id: $(this).attr("key")};
    var postDivSelector = '#postComment' +  $(this).attr("key");

    $(commentBtnSelector).show();

    $.post("/app/comments/submit", newComment, function(data) {
        $(inputSelector).val('');
        $(commentDivSelector).hide();
    });

    $.get('/app/comments/my-comments', function(comments){
        //grab the latest comment to display right away in the DOM
        var index = comments.length - 1;
        $(postDivSelector).append($('<div class="border mt-2 p-3 w-75 commentborder addedComments" id="deleteBox'+ comments[index]._id +'"><div class="text-right"><button class="btn deleteBtn text-white" id="'+ comments[index]._id +'">x</button></div>'+ comments[index].user +':<br>'+ comments[index].body +'</div>'));
    })
});

$(document).on('click', '.deleteBtn', function(){
    var deleteSelector = $(this).attr('id');
    var deleteCommentBox = '#deleteBox' + $(this).attr('id');
    console.log(deleteCommentBox)
    
    $.ajax({
        type: "DELETE",
        url: "/app/comments/delete/" + deleteSelector
    });

    $(deleteCommentBox).remove();
});

