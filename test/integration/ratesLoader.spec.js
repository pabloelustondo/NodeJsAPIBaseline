const expect  = require('chai').expect;
const RatesLoader = require('../../business/ratesLoader');
const ratesUrl = 'https://api.coinbase.com/v2/exchange-rates?currency=BTC';
const { getRates } = require('../../utils/ratesCache');

describe('RatesLoader', function () {
  describe('loadRates', function () {
    it('should fetch current rates from coinbase API', async function() {


      const rateLoader = new RatesLoader(ratesUrl);
      await rateLoader.loadRates();

      const result = getRates();


      expect(result).to.be.not.empty;
      expect(result['EUR']).to.be.not.empty;


    })

  });
});