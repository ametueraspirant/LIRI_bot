require("dotenv").config();

const moment = require('moment');
const axios = require('axios');
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

var argument = process.argv[2];
var search_terms = process.argv.slice(3).join("+");
var replay = false;
var number_of_loops = 0;

function concert_this(artist)
{
	if(!artist)
	{
		artist = "the+correspondents"
		console.log("No band entered. Here's a band I recommend:\n");
	}
	var bands_url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
	axios.get(bands_url)
	.then(function(response)
	{
		if(!response.data[0])
		{
			console.log("Oops! This band has no venues right now! Try again later");
		}
		else
		{
			var data_response = response.data[0];
			var new_time = data_response.datetime.split("T");
			var pretty_post = 
				"\nResults for the band: " + data_response.artist.name
				+ "\nThe next band appearance will be at: " + data_response.venue.name + " Venue."
				+ "\nThe venue location is: " + data_response.venue.city + ", " + data_response.venue.country
				+ "\nThe event will be on: " + moment(new_time[0], "YYYY-MM-DD").format("MM/DD/YYYY") + ", at " + moment(new_time[1], "HH:mm:ss").format("h:mm a")
				+ "\n"
			;
			console.log(pretty_post);
			fs.appendFile("log.txt", pretty_post, "utf8", function(err)
			{
  				if (err) throw err;
  				// console.log('Saved!');
			});
		}
	})
	.catch(function(err)
	{
		console.log(err);
	});
}

function spotify_this_song(track)
{
	if(!track)
	{
		track = "venetian+snares" //dude it's so hard to search for songs made by this band. the api keeps returning null.
		console.log("You haven't specified a track. Here's a song I recommend:\n");
	}
	spotify.search(
	{
		type: 'track', query: track
	})
	.then(function(response)
	{
		select_track = response.tracks.items[0];
    	var pretty_post =
			"\nresults for: " + select_track.name
			+ "\nArtist(s): " + select_track.artists[0].name
			+ "\nThis song was released in the album " + select_track.album.name
			+ "\nListen to the song here: \n" + select_track.album.external_urls.spotify
			+ "\n"
		;

		console.log(pretty_post);
		fs.appendFile("log.txt", pretty_post, "utf8", function(err)
		{
  			if (err) throw err;
  			// console.log('Saved!');
		});
		if(!replay)
		{
			fs.readFile('random.txt', 'utf8', (err, data) => {
 				if (err) throw err;
 				var array = data.split(",");
				for(var l00p = 0; l00p < array.length; l00p++)
				{
					if(select_track.name.toLowerCase() == array[l00p])
					{
						return;
					}
				}
			does_exist();
			});
			function does_exist()
			{
				fs.appendFile("random.txt", select_track.name.toLowerCase() + ",", "utf8", function(err)
				{
  					if (err) throw err;
				});
			}
		}
	})
	.catch(function(err)
	{
		console.log(err);
	});
}

function movie_this(movie)
{
	if(!movie)
	{
		movie = "eraserhead";
		console.log("You haven't searched for anything. May I make a recommendation? \n");
	}
	var movie_url = "http://www.omdbapi.com/?apikey=trilogy&";
	axios.get(movie_url + "t=" + movie)
	.then(function(response)
	{
		var pretty_post =
			"\nResults for: " + response.data.Title
			+ "\nProduction year: " + response.data.Year
			+ "\nIMDB rating: " + response.data.Ratings[0].Value
			+ "\nRotton Tomatoes rating: " + response.data.Ratings[1].Value
			+ "\nProduction country: " + response.data.Country
			+ "\nProduction language: " + response.data.Language
			+ "\nPlot overview: " + response.data.Plot
			+ "\nActors: " + response.data.Actors
			+ "\n"
		;
		console.log(pretty_post);
		fs.appendFile("log.txt", pretty_post, "utf8", function(err)
		{
  			if (err) throw err;
  			// console.log('Saved!');
		});
	})
	.catch(function(err)
	{
		console.log(err);
	});
}

function random_curated_song()
{
	fs.readFile('random.txt', 'utf8', (err, data) => {
 		if (err) throw err;
 		var array = data.split(",");
		spotify_this_song(array[Math.floor(Math.random() * array.length)]);
	});
}

function inquire_liri_bot()
{
	inquirer.prompt(
	[
		{
			type: "input",
			name: "greeting",
			message: "Hi! I'm lIRI! What would you like to do today?\n\nYou can type 'concert this' and then a band to search for nearby venues this band will be in!\nYou can type 'spotify this song' and then a song to search for that track on spotify.\nYou can also type 'movie this' and then a movie to bring up the cas list and other information!\nFinally. You can type 'random curated song' to bring up a list of premade songs, as well as the songs you've searched for previously!\n\nIf you would like to exit at any time, simply say 'exit'\n"
		}	
	])
	.then(function(answer)
	{
		if(number_of_loops < 5)
		{
			response = answer.greeting.split(" ");
			switch(response[0])
			{
				case "exit":
				console.log("alright, goodbye then!");
				break;

				case "concert":
				if(response[1] === "this")
				{
					concert_this(response.slice(2).join("+"));
				}
				break;

				case "concert-this":
				concert_this(response.slice(1).join("+"));
				break;

				case "spotify":
				if(response[1] === "this-song")
				{
					spotify_this_song(response.slice(2).join("+"));
				}
				else if(response[1] === "this" && response[2] === "song")
				{
					spotify_this_song(response.slice(3).join("+"));
				}
				break;

				case "spotify-this":
				if(response[1] === "song")
				{
					spotify_this_song(response.slice(2).join("+"));
				}
				break;

				case "spotify-this-song":
				spotify_this_song(response.slice(1).join("+"));
				break;

				case "movie":
				if(response[1] === "this")
				{
					movie_this(response.slice(2).join("+"));
				}
				break;

				case "movie-this":
				movie_this(response.slice(1).join("+"));
				break;

				case "random":
				if(response[1] === "curated-song")
				{
					random_curated_song();
				}
				else if(response[1] === "curated" && response[2] === "song");
				{
					random_curated_song();
				}
				break;

				case "random-curated":
				if(response[1] === "song")
				{
					random_curated_song();
				}
				break;

				case "random-curated-song":
				random_curated_song();
				break;

				default:
				console.log("I'm sorry, I didn't understand that.\n");
				inquire_liri_bot();
				number_of_loops++;
				break;
			}
		}
		else
		{
			return console.log("I'm sorry, you're going to have to try again later. Goodbye!");
		}
	});
}

switch(argument)
{
	case "concert-this":
	concert_this(search_terms);
	break;

	case "spotify-this-song":
	replay = false;
	spotify_this_song(search_terms);
	break;

	case "movie-this":
	movie_this(search_terms);
	break;

	case "random-curated-song":
	replay = true;
	random_curated_song();
	break;

	default:
	inquire_liri_bot();
	break;
}