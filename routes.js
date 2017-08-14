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
  //if duplicate pick, do not log wrong answer but flash "letter already chosen"
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

module.exports = router;
