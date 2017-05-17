//================================================
// Express Server
//================================================
var express = require('express');

// Initialize Express
 var app = express();

//================================================
// Configure express-handlebars
//================================================
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//================================================
// Get HTML from URLs
//================================================
var request = require('request');

//================================================
// Scrape the HTML
//================================================
var cheerio = require('cheerio');


// Make public a static dir
app.use(express.static(process.cwd() + '/public'));

// app.get('/scraped', function(req, res) {
//   res.redirect('/');
// });

// A GET request to scrape the NY Times Ceramics and Pottery News website
 app.get('/scraped', function(req, res) {
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
      console.log(result);
      res.send('Scrape Complete');
  });
 });


 // Listen on PORT 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});