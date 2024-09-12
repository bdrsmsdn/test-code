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
    name: {
        type: String,
        required: true
    },
    borrowedBook: {
      type: [],
    },
    isPenalty: {
        type: Boolean,
        required: true,
        default: false
    },
    timePenalty: {
      type: Date,
      default: null
    }
  },
  {
    collection: 'members',
  }
);

module.exports = mongoose.model('Member', memberSchema);