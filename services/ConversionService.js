export default class ConversionService {
  updateData(newData) {
    this.data = newData;
    this.rates = this.data.rates;
    this.currencies = this.rates.map(value=>value.currency);
    this.ratesToBase = this.rates.map(value=>value.rate);
  }
  getCurrenciesWithBase() {
    //console.log("this.def",this.currencies, this.def)
    if (!this.data || !this.data.base || !this.currencies) {
      return [];
    }
    return [this.data.base, ...this.currencies];
  }
  getRateForCurrency(currency) {
    for (var i=0; i<this.currencies.length;i++) {
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
