const expect  = require('chai').expect;
const Converter = require('../../business/converter');
const Exchange = require('../../models/exchangeModel');
const SAMPLE_RATES = require('./sample_rates')

describe('Converter', function () {
  describe('convert()', function () {
    it('should return a converted money value', function () {
      const converter = new Converter(SAMPLE_RATES.data.rates);
      const exchange = new Exchange({
        amount: 100,
        from: 'EUR',
        to: 'USD'
      });
      const result = converter.convert(exchange);
      const expectedResult = "105.09664102425165";
      expect(result).to.be.not.empty;
      expect(result).to.be.equal(expectedResult)
    });
  });
});