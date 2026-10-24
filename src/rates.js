/** Normalised rates: { base, date, rates: { [code]: units of that currency per 1 unit of base } } */

export function parseRates(json) {
  if (!json || typeof json !== 'object' || typeof json.base !== 'string' || !json.rates || typeof json.rates !== 'object') {
    throw new Error('Unexpected exchange-rate response');
  }
  const rates = { [json.base]: 1 };
  for (const [code, value] of Object.entries(json.rates)) {
    const rate = Number(value);
    if (Number.isFinite(rate) && rate > 0) {
      rates[code] = rate;
    }
  }
  if (Object.keys(rates).length < 2) {
    throw new Error('Exchange-rate response contains no rates');
  }
  return { base: json.base, date: typeof json.date === 'string' ? json.date : null, rates };
}

export function currencyCodes(data) {
  return Object.keys(data.rates).sort();
}

/** Parse user input such as "1,234.50", "12,5" or " 7 ". Returns null when it is not a number. */
export function parseAmount(text) {
  const cleaned = String(text).trim().replace(/\s/g, '');
  if (cleaned === '') {
    return null;
  }
  // A single comma followed by one or two digits is a decimal separator ("12,5"); any other comma groups thousands.
  const normalised = /^[^,.]*,\d{1,2}$/.test(cleaned) ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
  const value = Number(normalised);
  return Number.isFinite(value) ? value : null;
}

export function convert(data, from, to, amount) {
  const fromRate = data.rates[from];
  const toRate = data.rates[to];
  if (!fromRate || !toRate || amount === null || !Number.isFinite(amount)) {
    return null;
  }
  return (amount / fromRate) * toRate;
}

export function formatAmount(value) {
  if (value === null) {
    return '';
  }
  const digits = Math.abs(value) >= 1 ? 2 : 4;
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: digits });
}
