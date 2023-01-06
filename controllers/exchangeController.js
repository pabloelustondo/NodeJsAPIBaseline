const Exchange = require('./../models/exchangeModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Converter = require('../business/converter');
const { getRates } = require('./../utils/ratesCache');
const RatesLoader = require('../business/ratesLoader');

//This endoint provides a way to query the saved exchange requests
exports.getAllExchanges = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Exchange.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const exchanges = await features.query;

  res.status(200).json({
    status: 'success',
    results: exchanges.length,
    data: {
      exchanges
    }
  });
});

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
exports.getConvertion = catchAsync(async (req, res, next) => {
  //TODO REFACTOR this function is tOo long, ha4rd to test and mixes layer.
  //Needs: Testabilty, Separations of Concerns.

  const exchange = new Exchange(req.query);
  const { amount, to, from } = exchange;

  //CHECK THAT CACHE TIMESTAMP IS OK OTHERWISE REFRESH 
  const now = new Date();
  const ratesTimestampOld = getRatesTimestamp();
  const ratesAge = now.getTime() - ratesTimestampOld.getTime();

  //REFRESH CACHE IF afet moe that max age

  const maxRatesAge = process.env.MAX_RATES_AGE;
  const ratesUrl = process.env.RATES_URL;

  if (ratesAge > maxRatesAge) {
    const rateLoader = new RatesLoader(ratesUrl);
    await rateLoader.loadRates();
  }

  
  const rates = getRates();
  const ratesTimestamp = getRatesTimestamp();
  
  const converter = new Converter(rates);
  const convertedAmount = converter.convert(exchange);
  exchange.convertedAmount = convertedAmount;
  await exchange.save();

  res.status(200).json({
    status: 'success',
    data: {
      amount: convertedAmount,
      currency: to,
      ratesTimestamp,
      ratesAge
     }
  });
});
