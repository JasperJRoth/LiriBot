var axios = require("axios");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");

// Keys
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);