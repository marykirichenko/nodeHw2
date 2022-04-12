const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    auto: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Error', errorSchema);
