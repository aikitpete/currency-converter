export default class ConversionService {
  updateData(newData) {
    this.data = newData;
    this.def = this.data.default;
    this.rates = this.def.rates;
    this.currencies = this.rates.map(value=>value.currency);
    this.ratesToBase = this.rates.map(value=>value.rate);
  }
  getCurrenciesWithBase() {
    return [this.def.base, ...this.currencies];
  }
  getRateForCurrency(currency) {
    for (var i=0; i<this.currencies.length;i++) {
      console.log("COMPARING",this.currencies[i],currency)
      if (this.currencies[i]==currency) {
        return this.ratesToBase[i]
      }
    }
    return 1;// Returned for base currency (Euro)
  }
  convert(fromCurrency, toCurrency, amount) {
    const fromRate = this.getRateForCurrency(fromCurrency);
    const toRate =  this.getRateForCurrency(toCurrency);
    return amount/fromRate*toRate;
  }
}
