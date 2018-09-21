// FUNCTIONS to render movie titles from our topics array
// ==========================================================

var movies = ["Mamma Mia!", "crazy rich asians", "love actually", "about time", "50 first dates", "notting hill", "500 days of summer"];


function renderInitialButtons() {
    $('#buttons-view').empty();
    for (var i = 0; i < movies.length; i++) {

        var movieBtn = $("<button>");
        movieBtn.addClass("movie-btn mr-2 my-2 btn-outline-secondary btn-sm text-capitalize");
        movieBtn.attr("data-movie", movies[i]);
        movieBtn.text(movies[i]);
        $('#buttons-view').append(movieBtn);
    }
};
renderInitialButtons();

function renderButtons() {
    $('#buttons-view').empty();
    $('#added-movie-buttons-view').empty();

    for (var i = 0; i < 8; i++) {

        var movieBtn = $("<button>");
        movieBtn.addClass("movie-btn mr-2 my-2 btn-outline-secondary btn-sm text-capitalize");
        movieBtn.attr("data-movie", movies[i]);
        movieBtn.text(movies[i]);
        $('#buttons-view').append(movieBtn);
    }


    for (var i = 8; i < movies.length; i++) {

        var movieBtn = $("<button>");
        movieBtn.addClass("movie-btn mr-2 my-2 btn-outline-secondary btn-sm text-capitalize");
        movieBtn.attr("data-movie", movies[i]);
        movieBtn.text(movies[i]);
        $('#added-movie-buttons-view').append(movieBtn);
    }

};


$('#added-movie-buttons-view')

$('#add-movie').on("click", function(e){
    e.preventDefault();
    console.log("add-movie is clicked");

    var movie = $('#movie-input').val().trim();

    if (movie !== "") {
        movies.push(movie)
        renderButtons();
        $('#movie-input').val("");
    } else {
        console.log("User input is blank.")
    }

    //Display results
    var giphyQueryURL = buildGiphyQueryURL(movie);
    $.ajax({
        url: giphyQueryURL,
        method: 'GET'
    }).then(function(response){
        updateGifsView(response);
    });
    // ==========================================================

    var omdbQueryURL = buildOmdbQueryURL(movie);
    $.ajax({
        url: omdbQueryURL,
        method: 'GET'
    }).then(function(response){
        updateMoviesView(response);
    });


});

$('#clear-all').on("click", function(e){
    e.preventDefault();
    $('#buttons-view').empty();
    $('#added-movie-buttons-view').empty();
    $('#gifs-view').empty();
    $('#poster-view').empty();
    $('#movie-info-view').empty();
    renderButtons();
});



// FUNCTIONS to call GIPHY and OMDB APIs when ".movie-btn" is clicked
// ==========================================================

$(document).on("click",'.movie-btn',function(e){
    e.preventDefault();
    console.log("The movie you've clicked:", $(this).attr("data-movie"))
    var movieTitle = $(this).attr("data-movie");
    var giphyQueryURL = buildGiphyQueryURL(movieTitle);
    $.ajax({
        url: giphyQueryURL,
        method: 'GET'
    }).then(function(response){
        updateGifsView(response);
    });
    // ==========================================================

    var omdbQueryURL = buildOmdbQueryURL(movieTitle);
    $.ajax({
        url: omdbQueryURL,
        method: 'GET'
    }).then(function(response){
        updateMoviesView(response);
    });
})  

function buildGiphyQueryURL(movieTitle) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryParams = { "api_key": "v3fLq4sNNGto4wQ9ZPT5K83EJTjOU4pw" };
    queryParams.q = movieTitle.toString() + " movie";
    queryParams.limit = "10";
    queryParams.rating = "pg";
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
};

function updateGifsView(GIPHYdata) {
    
   
    $('#gifs-view').empty();

    var results = GIPHYdata.data;
    
    for (var i = 0; i < results.length; i++) {
        var gifDiv = $("<div class='float-left mb-3 mr-3'>");
        var gifRating = $("<small>").text("Rating: " + results[i].rating);
        var gifImg = $("<img>");
        gifImg.attr({
            "src": results[i].images.fixed_width_still.url,
            "data-still": results[i].images.fixed_width_still.url,
            "data-animated": results[i].images.fixed_width.url,
            "data-state": 'still',
            "class": "gif",
        })       

        var gifFavourite = $('<button class="fav-gif">');
        gifFavourite.addClass('btn btn-light btn-sm')
        gifFavourite.append('<i class="far fa-heart"></i>');
        gifFavourite.attr({
            "giphy-id": results[i].id
        })

        gifDiv.append(gifImg);
        gifDiv.append("<br>")
        gifDiv.append(gifRating);
        gifDiv.append("<br>")
        gifDiv.append(gifFavourite);
        gifDiv.append("<br>")
        $('#gifs-view').prepend(gifDiv);
    }
};

$(document).on("click", ".gif", function () {
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animated"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
})

// Function to add gifs to favorites
// ==========================================================
var favGifs = [];



$(document).on("click", ".fav-gif", function() {
    
    $('#fav-gifs-view').empty();

    var giphyId = $(this).attr("giphy-id");
    console.log("ID for getting GIF by ID Endpoint", giphyId);
    addGifToFavorites(giphyId);
    console.log("favGifs array", favGifs);
    renderFavGifs()
  
})

function addGifToFavorites(giphyId) {
    favGifs.push(giphyId)
}

function renderFavGifs() {
    for (var i = 0; i < favGifs.length; i++) {
        var favGifQueryId = buildFavGiphyQueryURL(favGifs[i]);

        $.ajax({
            url: favGifQueryId,
            method: 'GET'
        }).then(function(response){
            updateFavGifsView(response);
        });
    }
};

// Function to call Giphy API for favorties
// ==========================================================
function buildFavGiphyQueryURL(giphyId) {
    var queryURL = "https://api.giphy.com/v1/gifs/" + giphyId + "?";

    var queryParams = { "api_key": "v3fLq4sNNGto4wQ9ZPT5K83EJTjOU4pw" };


    console.log("---------------\nURL for Fav Gif: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
};

// Function to remove gifs for favorties
// ==========================================================
$(document).on("click", ".fav-gif-remove", function(){
    var giphyIdToRemove = $(this).attr("giphy-id");

    var index = favGifs.indexOf(giphyIdToRemove);
    if (index > -1) {
        favGifs.splice(index, 1);
    };

    console.log(favGifs);
    $(this).parent().remove();
    

})

function updateFavGifsView(GIPHYdata) {

    var result = GIPHYdata.data;
    
    var favGifDiv = $("<div class='card float-left fav-gif-card my-3 mx-3'>");
    var favGifRating = $("<small class='text-center'>").text("Rating: " + result.rating);
    var favGifImg = $("<img>");
    favGifImg.attr({
        "src": result.images.fixed_height_small_still.url,
        "data-still": result.images.fixed_height_small_still.url,
        "data-animated": result.images.fixed_height_small.url,
        "data-state": 'still',
        "class": "gif",
        "giphy-id": result.id
    })       
    var favGifRemove = $("<small class='fav-gif-remove text-center'>").append('Remove <i class="far fa-trash-alt"></i>');
    favGifRemove.attr("giphy-id", result.id);

    favGifDiv.append(favGifImg);
    favGifDiv.append("<br>")
    favGifDiv.append(favGifRating);
    favGifDiv.append(favGifRemove)
    favGifDiv.append("<br>")

    $('#fav-gifs-view').prepend(favGifDiv);
};


// Function to call OMDb API
// ==========================================================
function buildOmdbQueryURL(movieTitle) {
    var queryURL = "https://www.omdbapi.com/?";
    var queryParams = { "apikey": "a91775cc" };
    queryParams.t = movieTitle.toString();
    queryParams.plot = "short";
    queryParams.r = "json";
    queryParams.type = "movie";
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
};

function updateMoviesView(response) {
    console.log(response);
    console.log("------------------------------------");

    var results = response;

    var poster = results.Poster;
    var displayPoster = $("<img class='img-fluid movie-poster'>").attr("src", poster)
    $("#poster-view").empty();
    $("#poster-view").append(displayPoster);

    var movieInfoDiv = $("<div>")

    var title = results.Title;
    var displayTitle = $("<h5>").text(title);

    var runtime = results.Runtime;
    var displayRunTime = $("<p>").text(runtime);

    var releasedDate = results.Released;
    var displayReleasedDate = $("<p>").text(releasedDate);


    var plot = results.Plot
    var displayPlot = $("<small>").text(plot);

    movieInfoDiv.append(displayTitle);
    movieInfoDiv.append(displayReleasedDate);
    movieInfoDiv.append(displayRunTime);
    movieInfoDiv.append(displayPlot);

    $('#movie-info-view').empty();
    $('#movie-info-view').append(movieInfoDiv);
 
};


/**
 *    for (var i = 0; i < results.length; i++) {
        var gifDiv = $("<div class='my-3'>");
        var gifRating = $("<small>").text("Rating: " + results[i].rating);
        var gifImg = $("<img>");
        gifImg.attr({
            "src": results[i].images.fixed_height_still.url,
            "data-still": results[i].images.fixed_height_still.url,
            "data-animated": results[i].images.fixed_height.url,
            "data-state": 'still',
            "class": "gif",
        })       

        var gifFavourite = $('<button class="fav-gif">');
        gifFavourite.addClass('btn btn-light btn-sm')
        gifFavourite.append('<i class="far fa-heart"></i> Add To Favorites');
        gifFavourite.attr({
            "data-rating": results[i].rating,
            "data-src": results[i].images.fixed_height_still.url,
            "data-still": results[i].images.fixed_height_still.url,
            "data-animated": results[i].images.fixed_height.url,
            "data-state": 'still',
            "data-class": "gif",
        })

        gifDiv.append(gifImg);
        gifDiv.append("<br>")
        gifDiv.append(gifRating);
        gifDiv.append("<br>")
        gifDiv.append(gifFavourite);
        gifDiv.append("<br>")
        $('#gifs-view').prepend(gifDiv);
 */