require("dotenv").config();
var fs = require("fs");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var action = process.argv[2];
var nodeArgs = process.argv;

switch (action) {
  case "my-tweets":
    getTweets();
    break;

  case "spotify-this-song":
    spotifySong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-this":
    doThis();
    break;
}

function movieThis() {
  var request = require("request");
  var movieName = "";

  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName += "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
    }
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  console.log(queryUrl);

  request(queryUrl, function(error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log("  Movie Title is: " + JSON.parse(body).Title);
      console.log("  Movie Released in: " + JSON.parse(body).Year);
      console.log("  Movie Rating: " + JSON.parse(body).Rated);
      console.log("  Movie Genre: " + JSON.parse(body).Genre);
      console.log("  Movie Runtime: " + JSON.parse(body).Runtime);
      console.log("  Movie Plot: " + JSON.parse(body).Plot);
    }
  });
}

function getTweets() {
  var params = { screen_name: process.argv[3] };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        console.log("  Created: " + tweets[i].created_at);
        console.log("   Tweet: " + tweets[i].text);
      }
    }
  });
}

function spotifySong() {
  var title = "";
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      title += "+" + nodeArgs[i];
    } else {
      title += nodeArgs[i];
    }
  }

  spotify.search(
    {
      type: "track",
      query: title
    },
    function(err, data) {
      for (i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[0];
      }
      console.log("  Song Name: " + JSON.stringify(songData.name, null, 2));
      console.log(
        "  Song Artist: " + JSON.stringify(songData.artists[0].name, null, 2)
      );
      console.log(
        "  Song Album: " + JSON.stringify(songData.album.name, null, 2)
      );
      console.log(
        "  Song URL: " + JSON.stringify(songData.external_urls.spotify, null, 2)
      );
    }
  );
}

function doThis() {
  fs.readFile("./random.txt", "utf8", function(err, data) {
    data = data.split(", ");
    var result = 0;

    for (var i = 0; i < data.length; i++) {
      if (parseFloat(data[i])) {
        result += parseFloat(data[i]);
      }
    }
    console.log(data);
  });
}
