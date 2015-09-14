// Node.JS Packages
var http = require('http');
var colors = require("colors");
var express = require('express');
var fs = require("fs");
var passport = require("passport");	
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

// Port
port = 3000

//Setup Color Scheme for Comments
colors.setTheme({
    title: ['white', 'italic'],
    error: ['bgRed', 'white', 'title'],
    info: ['bgYellow', 'white', 'italic'],
    success: ['bgGreen', 'white'],
});

// Setup SMTP Server
var smtpServer  = email.server.connect({
   user:    "email@email.com", 
   password: "password", 
   host:    "Smtp host", 
   ssl:     true
});

// MongoDB Token Store
var pathToMongoDb = 'mongodb://localhost/passwordless-simple-mail';
passwordless.init(new MongoStore(pathToMongoDb));

// Expressify the App and Initialize the Router
var app = express()
var router = express.Router();


// Imports for External User Node.JS Functions
var global = require('./modules/global.js');

// Add Delivery System for Passwordless
// Set up a delivery service
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'localhost:3000';
        smtpServer.send({
            text:    'Hello!\nAccess your account here: http://' 
            + host + '?token=' + tokenToSend + '&uid=' 
            + encodeURIComponent(uidToSend), 
            from:    yourEmail, 
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) { 
            if(err) {
                console.log(err);
            }
            callback(err);
        });
});

// Setup Redirects (Express)
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

// Setup Login
/* GET login screen. */
router.get('/login', function(req, res) {
   res.send('<html><body><h1>Login</h1><form action="/sendtoken" method="POST">Email:<br><input name="user" type="text"><br><input type="submit" value="Login"></form></body></html>');
});

/* POST login details. */
router.post('/sendtoken', 
    passwordless.requestToken(
        // Turn the email address into an user ID
        function(user, delivery, callback, req) {
            // usually you would want something like:
            User.find({email: user}, callback(ret) {
               if(ret)
                  callback(null, ret.id)
               else
                  callback(null, null)
          })
          // but you could also do the following 
          // if you want to allow anyone:
          // callback(null, user);
        }),
    function(req, res) {
       // success!
          res.render('sent');
});

/* GET restricted site. */
router.get('/restricted', passwordless.restricted(),
 function(req, res) {
	res.send('secret page');
});




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