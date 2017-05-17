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
var Story = require('.models/Story.js');
var Message = require('.models/Message.js');

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
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
mongoose.connect("mongodb://localhost/mongoosearticles");
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

      //  var link = $(element).children('a').attr('href');
      //  var title = $(element).find('a').find('.story-meta').find('h2').text();
      //  var summary = $(element).find('a').find('.story-meta').find('p').text();
      //  var image = $(element).find('a').find('.wide-thumb').find('img').attr('src');

      result.link = $(element).children('a').attr('href');
      result.title = $(element).find('a').find('.story-meta').find('h2').text();
      result.summary = $(element).find('a').find('.story-meta').find('p').text();
      result.image = $(element).find('a').find('.wide-thumb').find('img').attr('src');

       // Save these results in an object that we'll store in a database.
       // Using our Story model, create a new entry
       // This effectively passes the result object to the entry
       var news = new Story(docS);

       // Save that news to the database.
       news.save(function(err, doc) {
         if err {
           console.log(err);
         } else {
           console.log(doc);
         }
       });

        // Tell the browser that we finished scraping the text
        });
      res.send('Scrape Complete');
    });

 });


// A GET request to scrape the NY Times Ceramics and Pottery News website
 app.get('/all', function(req, res) {
  // Get the HTML body with request
  request('https://www.nytimes.com/topic/subject/ceramics-and-pottery', function(error, response, html) {
    // Load the HTML into cheerio and save it to variable
    var $ = cheerio.load(html);
    // Store the scraped data in an empty array
    var result = [];
    // Select each HTML body instance you want to
    $('div.story-body').each(function(i, element) {
      var link = $(element).children('a').attr('href');
      var title = $(element).find('a').find('.story-meta').find('h2').text();
      var summary = $(element).find('a').find('.story-meta').find('p').text();
      var image = $(element).find('a').find('.wide-thumb').find('img').attr('src');

      // Save these results in an object that we'll push into the result array we defined earlier
      result.push({
        link: link,
        title: title,
        summary: summary,
        image: image
        });
      });
      res.send(result);
  });
 });


 // Listen on PORT 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});