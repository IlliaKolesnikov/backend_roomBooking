
const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
router.use('/', (req,res, next)=>{
      const cert = new Buffer("test", 'base64')
    jwt.verify(req.headers.authorization, cert, { algorithms: ['HS256'] }, function (err, payload) {
      if(err){
        console.log("token err");
        res.status(422).json({error: err.message})
      } // if token alg != RS256,  err == invalid signature
      else{
          console.log("send token")
          req.payload = payload;
        next()
      }

    })
})

module.exports = router
