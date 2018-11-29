const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservationSchema = new Schema({
  roomColor: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }
})

const Boooking = mongoose.model('Booking', reservationSchema)

module.exports = Boooking
