//define packages
const express = require('express');
const session = require('express-session');
const validator = require('express-validator');
const handleBars = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const users = require('./data.js');
const app = express();

//define templates
app.engine('handlebars', handleBars());
app.set('views', './views');
app.set('view engine', 'handlebars');

//define bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

//configure session
app.use(
  session({
    //in the future this is to initiate a default session
    secret: '123456789',
    resave: false, //doesn't save without changes
    saveUninitialized: true, //creates a new session
  })
);

//setup morgan to log requests
// app.use(morgan('dev'));

//configure how app will access static content
app.use(express.static('public'));

//configure validator
app.use(validator());

//create default session
app.use((req, res, next) => {

  if(!req.session.users) {

    req.session.users = [];

  }
  console.log(req.session);

  next();
});


app.get('/', (req, res) => {
  if (req.session.users === undefined || req.session.users.length === 0){
    res.redirect('/login');
  } else {
    let users = req.session;
    console.log(users);
    res.render('home', {
      users: users
    })
  }
})


app.get('/login', (req, res) => {

  res.render('login')
})

app.post('/login', (req, res) => {
  let userInfo = req.body;

  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();

  let errors = req.validationErrors();

  if (errors){
    //if there is an error print it
    res.render('login', {errors: errors});
  } else {
    //otherwise
    let players = users.filter(function(userCheck){
      return userCheck.username === req.body.username;
    });

    //if that user does not exist return an error on the login page
    if (players.length === 0) {
      let not_a_user = "User not found. Please create an account";
      res.render('login', {notUser: not_a_user});
      return;
    }

    let user = players[0];

    //if the passwords match direct to the home page
    if (user.password === req.body.password){
      req.session.users = user.username;
      res.redirect('/');
    } else {
      let not_your_password = "Sorry, that password is incorrect";
      res.render('login', {something: not_your_password});
    }
  }
});


//configure local host
app.listen(3000, function(){
  console.log("You have started the application!")
});
