let cache = {};

getRatesTimestamp = () => cache.ratesTimestamp;
getRates = () => cache.rates;
setRates = (rates, timestamp) => {
    cache.rates  = rates;
    cache.ratesTimestamp  = timestamp;
} 

module.exports = { getRates, setRates } 