//define packages
const express = require('express');
const session = require('express-session');
const validator = require('express-validator');
const handleBars = require('express-handlebars');
const bodyParser = require('body-parser');
// const parseUrl = require('parseurl');
const flash = require('express-flash');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const app = express();

//define templates
app.engine('handlebars', handleBars());
app.set('views', './views');
app.set('view engine', 'handlebars');

//define bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

//define where app will look for routes
const routes = require('./routes');

//configure how app will access static content
app.use(express.static('public'));

//configure session
app.use(
  session({
    //in the future this is to initiate a default session
    secret: 'asdlgkjpeoiwtu3',
    resave: false, //doesn't save without changes
    saveUninitialized: true, //creates a new session
  })
);

//configure how app will use routes
app.use('/', routes);

//configure local host
app.listen(3001, function(){
  console.log("Let's go guess some words!")
});
