const express = require('express');
const router = express.Router();
const exphbrs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const parseUrl = require('parseurl');
const flash = require('express-flash');
const validator = require('express-validator');
const session = require('express-session');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

router.use((req, res, next) => {
      if (!req.session.word_pick) {

        req.session.random = (Math.floor(Math.random() * words.length))
        req.session.word_pick = words[req.session.random];
        req.session.actual = req.session.word_pick.split("")
        req.session.letters = req.session.actual.map(letter => "");
        req.session.badGuesses = [];
        req.session.attempts = 8;
      }
      console.log(req.session)
      next();
    })

router.get('/', (req, res) => {
    res.render('home', {
        letters: req.session.letters,
        attempts: req.session.attempts,
        badguesses: req.session.badGuesses
      })
    })

router.get('/lose', (req, res) => {
    res.render('lose', {
        word_pick: req.session.word_pick
      })
    })


router.get('/new_word', (req, res) => {
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
})

//register a user guess, apply it to the word, and display if correct
//push to badguesses array if used and not correct + deduct attempt
router.post('/guess', (req, res) => {
  let guess = req.body.pick;

  console.log(guess)

  //Win-Loss
  if (req.session.word_pick.search(guess) === -1) {
    if (req.session.badGuesses.length == 7) {
      res.render('lose')

    } else {
    req.session.attempts = req.session.attempts - 1;
    req.session.badGuesses.push(guess);
    console.log(req.session.badGuesses)
    res.redirect('/')
  }

  } else {

    for (i = 0; i < req.session.word_pick.length; i++) {

      if (req.session.word_pick[i] === guess) {
        req.session.letters[i] = guess;
      }
    }
    if (req.session.letters.join('') === req.session.word_pick) {
      res.render("win")
    } else {
      res.redirect('/')
    }
  }
})

//LOSS CONDITION
//ATTEMPT COUNTER
//WORD RESET




//----------------VALIDATION-----------------//

//Tell the application what to post to the server and how to validate
//login against existing values

// app.post('/login', (req, res) => {
//   let userInfo = req.body;
//
//   req.checkBody('username', 'username is required').notEmpty();
//   req.checkBody('password', 'password is required').notEmpty();
//
//   let errors = req.validationErrors();
//
//   if (errors){
//     //if there is an error print it
//     res.render('login', {errors: errors});
//   } else {
//     //otherwise
//     let players = users.filter(function(userCheck){
//       return userCheck.username === req.body.username;
//     });
//
//     //if that user does not exist return an error on the login page
//     if (players.length === 0) {
//       let not_a_user = "User not found. Please create an account";
//       res.render('login', {notUser: not_a_user});
//       return;
//     }
//
//     let user = players[0];
//
//     //if the passwords match direct to the home page
//     if (user.password === req.body.password){
//       req.session.users = user.username;
//       res.redirect('/');
//     } else {
//       let not_your_password = "Sorry, that password is incorrect";
//       res.render('login', {something: not_your_password});
//     }
//   }
// });
module.exports = router;
