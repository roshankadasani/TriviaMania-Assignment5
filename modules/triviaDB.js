var mongoose = require("mongoose");

mongoose.connect('mongodb://cpsc473:webdev@ds053146.mlab.com:53146/473projects');

// Create a movie schema
var triviaGameSchema = mongoose.Schema({
    question: String,
    answer: String,
});

// Create a database collection model
var triviaGame = mongoose.model('triviaGame', triviaGameSchema);

module.exports.triviaGame = triviaGame;
