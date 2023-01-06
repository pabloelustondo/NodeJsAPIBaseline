/*
This module is incharge of fetching the current exchange rates from the coinbase API.
The module will store the result in the rates cached in memory.

A second verion will also use the database to allow horizontal scalability

*/
const { curly } = require('node-libcurl');
const Error = require('../errors/errors');
const { setRates } = require('../utils/ratesCache');

class RatesLoader {

    constructor(ratesUrl) {
      this.ratesUrl = ratesUrl;  
    }
  
    async loadRates() {
        try {
          const {  statusCode, data, headers }  = await curly.get( this.ratesUrl );     
          if (statusCode === 200 ){
            //we supposdley we have a good seet opf fresh exchange rates ad we will put them in the case
            const ratesTimestamp = new Date(Date.parse(headers[0].date));
            setRates( data.data.rates, ratesTimestamp );
            // we are saving all the incoming data as we suspect we can use of it later
            
          } else {
            throw new Error.RatesLoadError({ statusCode });
          }
        } catch(e) {
            throw new Error.RatesLoadError({ e });
        }

     }
}

  module.exports = RatesLoader;