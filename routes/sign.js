const express = require("express");
const User = require("../models/user")
const jwt = require('jsonwebtoken')
const v4 = require('node-uuid')
const keygen = require("keygenerator");
const { check, validationResult } = require('express-validator/check');
const router = express.Router();


router.post('/signup', [check('username').isEmail()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: "Email is not valid" });
  }

    User.findOne({ name: req.body.username }, (err, user)=>{
      if(err){
        return res.status(400).json({error: err.message })
      }
      if(user){
        return res.status(400).json({error: "User is already exist"})
      }
      //регистрировать только в том случае, если пользователь ещё не зареган
      else{
      User.hashPassword(req.body.password, (err, passwordHash) => {
        if (err) {
          return res.status(400).json({ error: err.message })
        }

        const user = new User({
          name: req.body.username,
          password: req.body.password,
        })

        user.passwordHash = passwordHash
        user.save((err) => {
          if (err) {
            return res.status(400).json({ error: err.message })
          } else {
            return res.json('REGISTERED')
          }
        })
      })
    }
    })


  })

router.post('/signin', (req, res) => {
    const password = req.body.password
      User.findOne({ name: req.body.username }, (err, user) => {
        if (err) {
          console.log(JSON.stringify(err))
          return res.status(400).json({ error: err.message })
        }
        if (!user) {
          return res.status(400).json({ error: 'User not found' })
        }
        User.comparePasswordAndHash(password, user.passwordHash, (err, areEqual) => {
          if (err) {
            return res.status(400).json({ error: err.message })
          }
          if (!areEqual) {
            return res.status(400).json({ error: 'Wrong password' })
          }
          const payload = {
            _id: user._id,
            iss: 'http://localhost:8080',
            permissions: 'poll',
            mail: user.name
          }
          const options = {
            expiresIn: '1d',
            jwtid: v4(),
          }
          const secret = new Buffer("test", 'base64')
          jwt.sign(payload, secret, options, (err, token) => {
            return res.json({ data: token})
          })
        })
      })

  })

module.exports = router
