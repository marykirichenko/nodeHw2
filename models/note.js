const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    auto: true,
  },
  userId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Note', noteSchema);
