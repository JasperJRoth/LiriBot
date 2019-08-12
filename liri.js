var axios = require("axios");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var fs = require("fs");
var os = require('os');

// Keys
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Command Args
var command = process.argv[2];
var args = process.argv.slice(3);

// processes user input and runs the corresponding command
function takeInput(command, args){
    switch(command){
        case "concert-this":
            concertThis(args.join(" "));
            break;
        case "spotify-this-song":
            spotifyThisSong(args.join(" "))
            break;
        case "movie-this":
            movieThis(args.join("+"));
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        //if the command is not valid, let the user know and give them a chance to re-enter the command
        default:
            inquirer.prompt({
                input: "input",
                name: "ans",
                message: `${command} is not recognised as a valid command, please enter a valid command\n(Hit enter if you want to cancel)`,
            }).then(function(answers){
                if(answers.ans != ""){
                    var input = answers.ans.split(" ");
                    takeInput(input[0], input.slice(1));
                }
            });
    }
}

//searches for the provided band/artist and logs the venue and date of upcoming concerts.
function concertThis(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(res){
        var bandData = res.data;
        if(bandData.length > 0){
            console.log("--------------------");
            bandData.forEach(function(concert){
                
                console.log(`Venue name: ${concert.venue.name}`);
                console.log(`Latitude: ${concert.venue.latitude}`);
                console.log(`Longitude: ${concert.venue.longitude}`);
                console.log(`At ${concert.datetime}`);
                console.log("--------------------");
            });
        }else{
            console.log("Sorry, no results found.");
        }
    }).catch(function(error){
        if(error) throw error;
    });
}

function spotifyThisSong(songName){
    if(songName == ""){
        songName = "The Sign";
    }
    spotify.search({
        type: "track",
        query: songName
    }).then(function(res){
        var tracks = res.tracks.items;

        console.log("--------------------");
        tracks.forEach(function(track){
            console.log(`Artists: ${track.artists.map(function(artist){
                return artist.name;
            }).join(", ")}`)
            console.log(`Song: ${track.name}`);
            console.log(`Preview: ${track.preview_url}`);
            console.log(`Album: ${track.album.name}`);
            console.log("--------------------");
        });
    }).catch(function(error){
        if(error) throw error;
    });
}

function movieThis(movieName){
    if(movieName == ""){
        movieName = "Mr.+Nobody";
    }
    axios.get(`http://www.omdbapi.com/?t=${movieName}&apikey=be479476`).then(function(res){
        var movie = res.data;
        console.log("--------------------");
        console.log(movie.Title);
        console.log(`Came out in ${movie.Year}`);
        console.log(`IMDB rating: ${movie.imdbRating}`);
        console.log(`Produced in: ${movie.Country}`);
        console.log(`Actors: ${movie.Actors}`);
        console.log(movie.Plot);
        console.log("--------------------");
    }).catch(function(error){
        if(error) throw error;
    });
}

function doWhatItSays(){
    var random = fs.readFileSync("./random.txt", {encoding: "utf-8"}).split(os.EOL);
    var line = random[Math.floor(Math.random() * random.length)];

    console.log(line);

    takeInput(line.split(" ")[0], line.split(" ").slice(1));
}

takeInput(command, args);
