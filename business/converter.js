/*
This module is incharge or applying the existing RATES to calculate new converted ammounts. 
*/

const Exchange = require('./../models/exchangeModel');
const validator = require('validator');

class Converter {

    constructor(rates) {
      this.rates = rates
    }
  
    convert(exchange) {
      const { amount,  from, to } = exchange;
      const exchangeRate = this.rates[to] /  this.rates[from]
      const convertedAmount = amount * exchangeRate;  
      return convertedAmount.toString()
    }
  
  }

  module.exports = Converter;
  