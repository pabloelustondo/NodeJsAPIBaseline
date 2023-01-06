const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const exchangeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String
    },
    from: {
      type: String,
      required: [true, 'An exchange needs a source (from) currency'],
      enum: {
        values: ['USD', 'EUR', 'BTC',  'ETH'],
        message: 'Please enter a valid currency'
      }
    },
    to: {
      type: String,
      required: [true, 'An exchange needs a destination (to) currency'],
      enum: {
        values: ['USD', 'EUR', 'BTC',  'ETH'],
        message: 'Please enter a valid currency'
      }
    },
    amount: {
      type: Number,
      required: [true, 'An exchange must have an amount']
    },
    convertedAmount: {
      type: Number,
      required: [true, 'An exchange must have an converted amount']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
