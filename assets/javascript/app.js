// FUNCTIONS to render movie titles from our topics array
// ==========================================================

var movies = ["love actually", "50 first dates", "notting hill", "maid in manhattan", "silver linings playbook", "500 days of summer"];

function renderButtons() {
    $('#buttons-view').empty();

    for (var i = 0; i < movies.length; i++) {

        var movieBtn = $("<button>");
        movieBtn.addClass("movie-btn mr-2 my-2 btn-outline-secondary btn-sm text-capitalize");
        movieBtn.attr("data-movie", movies[i]);
        movieBtn.text(movies[i]);
        $('#buttons-view').append(movieBtn);

    }
};

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

});

$('#clear-all').on("click", function(e){
    e.preventDefault();
    $('#buttons-view').empty();
    $('#gifs-view').empty();
    $('#poster-view').empty();
    $('#movie-info-view').empty();
    renderButtons();
});

renderButtons();

// FUNCTIONS to call GIPHY and OMDB APIs when ".movie-btn" is clicked
// ==========================================================

$(document).on("click",'.movie-btn',function(e){
    e.preventDefault();
    console.log("Movie-btn is clicked", $(this).attr("data-movie"))
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
    console.log(GIPHYdata);
    console.log("------------------------------------");

    var results = GIPHYdata.data;
    for (var i = 0; i < results.length; i++) {
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
        gifDiv.append(gifImg);
        gifDiv.append("<br>")
        gifDiv.append(gifRating);
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

// ==========================================================
function buildOmdbQueryURL(movieTitle) {
    var queryURL = "https://www.omdbapi.com/?";
    var queryParams = { "apikey": "a91775cc" };
    queryParams.t = movieTitle.toString();
    queryParams.plot = "full";
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
    var displayPoster = $("<img class='movie-poster'>").attr("src", poster)
    $("#poster-view").empty();
    $("#poster-view").append(displayPoster);

    var movieInfoDiv = $("<div>")

    var title = results.Title;
    var displayTitle = $("<h3>").text(title);

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