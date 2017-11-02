//internal calls to keys
var callTwitter = require("./keys.js");
var callSpotify = require("./spotKeys.js")
//api calls
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
//file system
var fs = require("fs");
//node arguments
var what = process.argv[2];
// var how = process.argv[3];

var how = "";
var movieName = "";

for (var i = 3; i < process.argv.length; i++) {
  how = how + process.argv[i] + " ";
}//"what" function definitions
function twitterCall() {

  ckey = callTwitter.consumer_key;
  csecret = callTwitter.consumer_secret;
  tkey = callTwitter.access_token_key;
  tsecret = callTwitter.access_token_secret;

  var Twitter = require('twitter');

  var client = new Twitter({
    consumer_key: ckey,
    consumer_secret: csecret,
    access_token_key: tkey,
    access_token_secret: tsecret
  });

  var params = { screen_name: '@mclaughs2', count: 20 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log("Posted: " + tweets[i].created_at);
        console.log("Tweeted: " + tweets[i].text);
      }
    }
  })
}

function spotifyCall() {

  spotID = callSpotify.id;
  spotSecret = callSpotify.secret;

  var spotify = new Spotify({
    id: spotID,
    secret: spotSecret,
  });

  var songQry;
  if (how === "") {
    songQry = "The Sign";
  }
  else {
    songQry = how;
  }
  spotify.search({ type: "track", query: songQry }, function (error, data) {
    if (error) {
      console.log(error);
    }
    else {
      // console.log(data.tracks.items);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Link: " + data.tracks.items[0].preview_url); //Fix why it always returns null.
      console.log("Album: " + data.tracks.items[0].album.name);
    }
  }
  )
}

function qryUrl() {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      // Complete movie data output.
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("Rated: " + JSON.parse(body).Rated);
      console.log("IMDB: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Rotton Tomatoes: " + JSON.parse(body).tomatoURL);
    }
  });
};

function omdbCall() {
  if (how === "") {
    movieName = "Mr. Nobody";
  }
  else {
    //reformat last argument with "+" between words in movie title
    how = process.argv;
    for (var i = 3; i < how.length; i++) {
      if (i > 3 && i < how.length) {
        movieName = movieName + "+" + how[i];
      }
      else {
        movieName += how[i];
      }
    }
  }
  console.log("Movie: " + movieName);
  qryUrl();
}
// debugger;

var doIt = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

switch (what) {
  case "my-tweets":
    twitterCall();
    break;
  case "spotify-this-song":
    spotifyCall();
    break;
  case "movie-this":
    omdbCall();
    break;
  case "do-what-it-says":
    doIt();
    break;
}
