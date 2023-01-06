const express = require('express');
const exchangeController = require('./../controllers/exchangeController');
const authController = require('./../controllers/authController');

const router = express.Router();

/*
This is the main endpoint of the service and will answer a currency exchange
it takes a request of the form 
{{baseUrl}}/api/v1/exchanges/convert?from=EUR&to=USD&amount=1
and and returns a result such as
{"status": "success",
    "data": {
        "amount": "1.0509664102425165",
        "currency": "USD"
}}
*/
router
  .route('/convert')
  .get(authController.protect, exchangeController.getConvertion)

//This endoint provides a way to query the saved exchange requests
router
  .route('/')
  .get(authController.protect, exchangeController.getAllExchanges)

module.exports = router;
