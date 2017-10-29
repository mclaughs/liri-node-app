//internal calls to keys
var callTwitter = require("./keys.js");
var callSpotify = require("./spotKeys.js")
//api calls
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
//node arguments
var what = process.argv[2];
var how = process.argv[3];
console.log(how);

//"what" function definitions

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

  var songQry = "";
  if (how === undefined) {
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

function omdbCall() {
  var nodeArgs = how;
  var movieName = "";
  for (var i = 2; i < nodeArgs.length; i++) {
    if (i > 2 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    }
    else { 
      movieName += nodeArgs[i]; 
    } 
  }
  if (how === undefined) {
    movieName = "Mr. Nobody"
  }
  else {
    movieName = how
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

  console.log(queryUrl);

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
    // Complete movie data output.
      console.log("Release Year: " + JSON.parse(body).Year);
    }
  })
}

// debugger;

// call appropriate function on launch
// fix functionality so that the second argument takes in multiple spaced words.

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
    // declare doIt function
    // doIt();
    break;
}

