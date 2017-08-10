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


//define global variables
let i = (Math.floor(Math.random() * words.length))
let word_pick = words[i];
let letters = word_pick.split("").map(letter => null);
let badguessesList = [];
let attempts = 8;

console.log(word_pick);
console.log(letters);


//create default session that retains user data
//when a user selects a letter, we need the word to remain and
//for the selection to populate the appropriate box
router.get('/', (req, res) => {
    res.render('home', {
        letters: letters,
        attempts: attempts
      })
    })

router.get('/new_word', (req, res) => {
  let i = (Math.floor(Math.random() * words.length))
  let word_pick = words[i];
  let letters = word_pick.split("").map(letter => null);
  res.redirect('/');
})

//register a user guess, apply it to the word, and display if correct
//push to guessesList array if used and not correct + deduct attempt
router.post('/guess', (req, res) => {
  let guess = req.body.pick;
  console.log(guess)

  for (i = 0; i < word_pick.length; i++) {

    if (word_pick[i] === guess) {
      letters[i] = guess;

    } else if (word_pick[i] != guess) {
      // console.log('wrong!')
      // badguessesList.push(guess);
    }
  }
  console.log(badguessesList)
  if (letters.join('') === word_pick) {
    res.render("win")
  } else {
    res.redirect('/')
  }
})

//WIN CONDITION
// guess.join = word_pick

//LOSS CONDITION




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
