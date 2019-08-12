var axios = require("axios");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");

// Keys
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Command Args
var command = process.argv[2];
var args = process.argv.slice(3);

// processes user input and runs the corresponding command
function takeInput(command){
    switch(command){
        case "concert-this":
            console.log("concert-this");
            break;
        case "spotify-this-song":
            console.log("spotify-this-song");
            break;
        case "movie-this":
            console.log("movie-this");
            break;
        case "do-what-it-says":
            console.log("do-what-it-says");
            break;
        //if the command is not valid, let the user know and give them a chance to re-enter the command
        default:
            inquirer.prompt({
                input: "input",
                name: "ans",
                message: `${command} is not recognised as a valid command, please enter a valid command\n(Hit enter if you want to cancel)`,
            }).then(function(answers){
                if(answers.ans != ""){
                    takeInput(answers.ans);
                }
            });
    }
}

takeInput(command);
