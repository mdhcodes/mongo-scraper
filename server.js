//================================================
// Get HTML from URLs
//================================================
var request = require('request');

//================================================
// Scrape the HTML
//================================================
var cheerio = require('cheerio');

//================================================
// Request the HTML body from Hacker News
//================================================
request('https://news.ycombinator.com/', function(error, response, html) {
  // Load the HTML into cheerio and save it to variable
  var $ = cheerio.load(html);
  // Store the scraped data in an empty array
  var result = [];
  // Select each HTML body instance you want to scrape
  $('td.title').each(function(i, element) {
    var link = $(element).children('a:first-child').attr('href');
    var title = $(element).children().text();

    // Save these results in an object that we'll push into the result array we defined earlier
    result.push({
      title: title,
      link: link
    });
  });
  console.log(result);
});