require("dotenv").config();

var moment = require('moment');
var axios = require('axios');
var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify); there is no Spotify constructor, why is this an instruction?

var argument = process.argv[2];
var search_terms = process.argv.slice(3).join("+");

// concert_this
function concert_this(artist)
{
	var bands_url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp" // this just returns an empty array in 90% of cases
	axios.get(bands_url)
	.then(function(response)
	{
		var new_time = response[0].datetime.split("T");
		console.log(
			"The next band appearance will be at: " + response[0].venue.name + " Venue."
			+ "\nThe venue location is: " + response[0].venue.city + ", " + response[0].venue.country
			+ "\nThe event will be on: " + moment(new_time[0], "YYYY-MM-DD").format("MM/DD/YYYY") + ", at " + new_time[1]
		);
	});
}
// spotify_this_song
function spotify_this_song()
{

}
// movie_this
function movie_this()
{
	
}

switch(argument)
{
	case "concert-this":
	concert_this(search_terms);
	break;

	case "spotify-this-song":
	spotify_this_song(search_terms);
	break;

	case "movie-this":
	movie_this(search_terms);
	break;

	case "do-what-it-says":
	spotify_this_song();
	break;
}