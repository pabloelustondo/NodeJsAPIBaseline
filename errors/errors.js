class RatesLoadError extends Error {
    constructor(message, obj) {
      super(message);
      this.name = "RatesLoadError";
      this.info = obj
    }
  }

  module.exports = { RatesLoadError };