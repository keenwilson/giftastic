# Movies GifTastic | Giphy & OMDb APIs
Integrated the features of GIPHY's search engine and the OMDb (open movie database) into the app by using the Giphy API and the OMDb API to make a dynamic web page that popultes with gifs and snippets of information about the movie of your choice.

## How This Application Works

* The initial array of movies is created once the page is loaded. The user can add a movie in the textbox. The application will dynamically generate buttons for each movie.
* _Dynamic Elements_: The user triggers gifs to appear related to the movie listed in the button as well as various snippets of information about that movie are displayed underneath. 
* _Pausing Gifs_: The user can stop/start animation by clicking on the gifs

## Behind the Application

### Front-End:
* Used Bootstrap to create the layout and Font Awesome to add more visual appeal.
* Created click events and registered the submit button. 
* Created working transfers of data between the text-boxes and the backend. 
* Created content regions for where the Giphy and OMDb results will go. 
* Used the attr jQuery method to stop/start animation

### Back-End:
* Worked with the Giphy and OMDb APIs. 
* Created the AJAX queries with various optional parameters in order to retrieve and parse data in JSON formats. 
* Utilized jQuery to show the user Giphy and OMDb results based on their search term.

