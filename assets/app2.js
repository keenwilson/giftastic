
// Initial array of movies
var topics = ["Breakfast at Tiffany's", "Crazy Rich Asians", "Mission: Impossible - Fallout", "Incredibles 2", "Hotel Transylvania 3", "Harry Potter Series: Harry Potter And The Half Blood Prince"];

// FUNCTIONS to render movie titles from our topics array
// ==========================================================

function renderMovieButtons() {
    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)  
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < topics.length; i++) {
        var movieButton = $("<button>");
        movieButton.addClass("movie-btn mr-2 my-2 btn-outline-secondary btn-sm");
        movieButton.attr("data-movie", topics[i]);
        movieButton.text(topics[i]);
        $("#buttons-view").append(movieButton)
    }
}


// Function to handle when the user submit a movie name
$("#add-movie").on("click", function (event) {
    alert("This submit button is clicked")
    // This line grabs the input from the textbox
    var movie = $("#movie-input").val().trim();
    // Adding movie from the textbox to our topics array
    topics.push(movie);
    console.log("Push " + movie + "to Topics array")
    console.log("new Topics array", topics)
    renderMovieButtons();
})


// Calling the displayMoviesTitles function to display the intial buttons
renderMovieButtons();


    /**
     * 
     * @param {string*} movie 
     * @returns {string} URL for GIPHY API
     */
    function buildGiphyQueryURL(movie) {
        // queryURL is the url we'll use ti query the API 
        var queryURL = "https://api.giphy.com/v1/gifs/search?"

        // Begin building an object to contain query parameters of our API calls
        // Set the API key
        var queryParams = { "api_key": "v3fLq4sNNGto4wQ9ZPT5K83EJTjOU4pw" };

        // Add a search term "movie" to the queryParams object 
        queryParams.q = movie;

        // Include limit and rating in the queryParams object 
        queryParams.limit = "10";
        queryParams.rating = "pg-13";

        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));
        return queryURL + $.param(queryParams);
    };

    /**
     * Take API data (JSON/object) and turns it into elements on the page
     * @param {object} GIPHYdata - object containing GIPHY API data
     */
    function updatePage(GIPHYdata) {
        // Log the GIPHYdata to console, where it will show up as an object
        console.log(GIPHYdata);
        console.log("------------------------------------");

        // storing the data from the AJAX request in the results variable
        var results = GIPHYdata.data;
        var $movieWrapper = $("<div class'giphy-wrapper'>");

        // Looping through each result item
        for (var i = 0; i < results.length; i++) {

            // Creating and storing a div tag
            var movieDiv = $("<div class='giphy-item'>");

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("GIPHY Rating: " + results[i].rating);

            // Creating and storing an image tag
            var movieImg = $("<img>");

            // Setting the src attribute of the image to a property pulled off the result item
            movieImg.attr({
                "src": results[i].images.fixed_height_still.url,
                "data-still": results[i].images.fixed_height_still.url,
                "data-animated": results[i].images.fixed_height.url,
                "data-state": 'still',
                "class": "gif",
            })

            // Appending the paragraph and image tag to the movieDiv
            movieDiv.append(p);
            movieDiv.append(movieImg);

            // Apeending movieDiv to $movieWrapper
            $movieWrapper.append(movieDiv)
        }
        // // Prependng the movieDiv to the HTML page in the "#gifs-appear-here" div
        $("#giphy-display-here").prepend($movieWrapper);
    };



    /**
     * 
     * @param {string*} movie 
     * @returns {string} URL for Omdb API
     */
    function buildOmdbQueryURL(movie) {
        // queryURL is the url we'll use ti query the API 
        var queryURL = "https://www.omdbapi.com/?"

        // Begin building an object to contain query parameters of our API calls
        // Set the API key
        var queryParams = { "apikey": "a91775cc" };

        // Add a search term "movie" to the queryParams object 
        queryParams.t = movie;

        // Include limit and rating in the queryParams object 
        queryParams.plot = "short";
        queryParams.r = "json";
        queryParams.type = "movie";

        // Logging the URL so we have access to it for troubleshooting
        console.log("---------------\nURL: " + queryURL + "\n---------------");
        console.log(queryURL + $.param(queryParams));
        return queryURL + $.param(queryParams);
    };




    /**
     * Take API data (JSON/object) and turns it into elements on the page
     * @param {object} OmdbData - object containing Omdb API data
     */
    function updateMovieInfo(OmdbData) {
        // Log the OmdbData to console, where it will show up as an object
        console.log(OmdbData);
        console.log("------------------------------------");

        // storing the data from the AJAX request in the results variable
        var results = OmdbData.data;
        var $movieInfoDiv = $("<div>")

        // Storing the movie's title data
        var title = results.title;
        // Create an element to have the title displayed
        var displayTitle = $("<h3>").text(title);

        // Storing the movie's run time data
        var runtime = results.runtime
        // Create an element to have the run time displayed
        var displayRunTime = $("<p>").text(runtime);

        // Storing the movie's released date data
        var releasedDate = results.released;
        // Create an element to have the released date displayed
        var displayReleasedDate = $("<p>").text(releasedDate);

        // Create an element to have the poster displayed
        var displayPoster = $("<img class='movie-poster'>").attr("src", results.poster)

        // Create an element to have the movie's plot displayed
        var displayPlot = $("<small>").text(results.plot);


        // Append the entire movie info  to HTML
        $movieInfoDiv.append(displayTitle, displayRunTime, displayReleasedDate, displayPoster, displayPlot);

        // Add the $movieInfoDiv to the HTML page in the "#omdb-display-here" div
        $("#omdb-display-here").HTML($movieInfoDiv);

    };


    function displyGifs(movie) {
        // Grabbing and storing the data-movie property value from the button
        var movie = $(this).attr("data-movie");

        // Build the query URL for the ajax request to GIPHY API and Omdb API
        var giphyQueryURL = buildGiphyQueryURL(movie);

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: giphyQueryURL,
            method: 'GET'
        }).then(updatePage);
    }


    function displayMovieInfo(movie) {
        // Grabbing and storing the data-movie property value from the button


        // Build the query URL for the ajax request to GIPHY API and Omdb API
        var omdbQueryURL = buildOmdbQueryURL(movie);

        // Performing an AJAX request with the queryURL
        $.ajax({
            url: omdbQueryURL,
            method: 'GET'
        }).then(updateMovieInfo);
    }






    $(document).on("click", ".movie-button", function (event) {
        event.preventDefault();
        console.log("movie-button is clicked.")
        var movie = $(this).attr("data-movie");
        displyGifs(movie);
        displayMovieInfo(movie);
    });



    // Handling still-anomated'
    $(document).on("click", ".gif", function () {
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");

        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            // Else set src to the data-still value
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    })


    //  .on("click") function associated with the clear button
    $("#clear-all").on("click", function () {
        //clear();
    })



