const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema(
  {
    timeStamp: {
      type: Date,
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    stock: {
        type: Number
    }
  },
  {
    collection: 'books',
  }
);

module.exports = mongoose.model('Book', memberSchema);