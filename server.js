//================================================
// Dependencies
//================================================

// Express Server
var express = require('express');

//var bodyParser = require('body-parser');

// Logs errors in the console making it easier to debug during development.
var logger = require("morgan");

// Mongoose is an object modeling tool for MongoDB
var mongoose = require("mongoose");

// Get HTML from URLs
var request = require('request');

// Scrape the HTML
var cheerio = require('cheerio');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Require Models
var Story = require('./models/Story.js');
var Note = require('./models/Note.js');

// Initialize Express
var app = express();

// Use morgan to log app activity to the console and debug
app.use(logger("dev"));

// Use Body Parser
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

// Make public a static dir
app.use(express.static(process.cwd() + '/public'));

//================================================
// Configure express-handlebars
//================================================
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//================================================
// Database configuration with mongoose
//================================================
mongoose.connect("mongodb://localhost/nytPotteryStories");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//================================================
// Routes
//================================================

// If a user requests this '/' route, they will be redirected to the '/scraped' route.
app.get('/', function(req, res) {
 res.redirect('/scrape');
});

// A GET request to scrape the NY Times Ceramics and Pottery News website
 app.get('/scrape', function(req, res) {
  // Get the HTML body with request
  request('https://www.nytimes.com/topic/subject/ceramics-and-pottery', function(error, response, html) {
    // Load the HTML into cheerio and save it to variable
    var $ = cheerio.load(html);
    // Add the text and href of every link, and save them as properties of the result object.
     $('div.story-body').each(function(i, element) {

       // Store the scraped data in an empty object
       var result = {};

      // Get the link, title, summary, and image from every story and save them as properties of the result object
      result.link = $(this).children('a').attr('href');
      result.title = $(this).find('a').find('.story-meta').find('h2').text();
      result.summary = $(this).find('a').find('.story-meta').find('p').text();
      result.image = $(this).find('a').find('.wide-thumb').find('img').attr('src');

      // Save these results in an object that we'll store in a database.
      // Using our Story model, create a storyEntry
      // This passes the result object to the
      var storyEntry = new Story(result);

      // Save that storyEntry to the database.
      storyEntry.save(function(err, doc) {
       // Log any errors
       if (err) {
         console.log(err);
       } else {
         // Or log the doc
         console.log(doc);
       }
      });

    });
  });
    // Tell the browser that we finished scraping the text
    res.send('Scrape Complete');
});


// A GET request to access all the stories scraped from the MongoDB database
app.get('/stories', function(req, res) {
  // Get each doc from the Stories array
  Story.find({})
    // chain a call to populate the storyEntry with the stories
    .populate('notes') // ???????????????????????????
    // Execute that query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if(error) {
        res.send(error);
      } else {
        // Or send the results to the browser
        res.send(doc);
      }
  });
});


 // Listen on PORT 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});