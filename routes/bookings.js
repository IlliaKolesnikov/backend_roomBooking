const express = require('express')
const User = require('../models/user')
const Booking = require('../models/reservation')
const v4 = require('node-uuid')
const checkToken = require('../helpers/tokenCheck.js')
const router = express.Router()

router.use('/', checkToken)

router.post('/addbooking', async (req, res) => {
  const booking = await new Booking({
    time: req.body.time,
    roomColor: req.body.roomColor,
    user: req.payload._id,
    date: req.body.date,
  })
  const exist = await Booking.find({ date: req.body.date })
  let check = ''
  // console.log(req.payload._id)
  exist.forEach(async item => { // возвращает 6 не найдено и 1 найдено
    if (item.time === booking.time && item.roomColor === booking.roomColor) {
       console.log(item.user == req.payload._id)
      if (item.user == req.payload._id) {
        check = 'DELETED'
        // console.log(check)
        Booking.findOneAndDelete({ _id: item._id })
      }
    } else {
      console.log('NEMA')
    }
  })
  console.log(exist.length)

//  return res.json(check)

})

module.exports = router
