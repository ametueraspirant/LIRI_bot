require("dotenv").config();

const moment = require('moment');
const axios = require('axios');
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);

var argument = process.argv[2];
var search_terms = process.argv.slice(3).join("+");

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
		console.log(response.data);
		if(!response[0])
		{
			console.log("Oops! This band has no venues right now! Try again later");
		}
		else
		{
			var data_response = response.data[0];
			var new_time = data_response.datetime.split("T");
			console.log(
				"Results for the band: " + data_response.artist.name
				+ "\nThe next band appearance will be at: " + data_response.venue.name + " Venue."
				+ "\nThe venue location is: " + data_response.venue.city + ", " + data_response.venue.country
				+ "\nThe event will be on: " + moment(new_time[0], "YYYY-MM-DD").format("MM/DD/YYYY") + ", at " + moment(new_time[1], "HH:mm:ss").format("h:mm a")
			);
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
		console.log(select_track.album.external_urls.spotify);
    	console.log(
			"results for: " + select_track.name
			+ "\nArtist(s): " + select_track.artists[0].name
			+ "\nThis song was released in the album " + select_track.album.name
			+ "\nListen to the song here: \n" + select_track.album.external_urls.spotify
		);
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
		console.log(
			"Results for: " + response.data.Title
			+ "\nProduction year: " + response.data.Year
			+ "\nIMDB rating: " + response.data.Ratings[0].Value
			+ "\nRotton Tomatoes rating: " + response.data.Ratings[1].Value
			+ "\nProduction country: " + response.data.Country
			+ "\nProduction language: " + response.data.Language
			+ "\nPlot overview: " + response.data.Plot
			+ "\nActors: " + response.data.Actors
		);
	})
	.catch(function(err)
	{
		console.log(err);
	});
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