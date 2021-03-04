const mongoose = require('mongoose')

const dreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dreamDate: {
    type: Date
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SChema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Dream', dreamSchema)
