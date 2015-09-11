// Node.JS Packages
var http = require('http');
var colors = require("colors");
var express = require('express');
var fs = require("fs");
var passport = require("passport");	

// Setup variables
port = 3000
colors.setTheme({
    title: ['white', 'italic'],
    error: ['bgRed', 'white', 'title'],
    info: ['bgYellow', 'white', 'italic'],
    success: ['bgGreen', 'white'],
});
var app = express()

// Imports for External User Node.JS Functions
var global = require('./modules/global.js');

global.log("App", "Successfully Imported All Packages", "success");

app.use(express.static('static'))

global.log("App", "Successfully Hosted Static Files", "success");

app.get("/", function(req, res) {
    fs.readFile("pages/index.html", "ASCII", function(err, data) {
        res.send(data);
    });
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });
 
app.listen(port)

global.log("App", "Server listening on: http://localhost:" + port, "success");