import { convert, currencyCodes, formatAmount, parseAmount, parseRates } from '../src/rates';

const api = { amount: 1, base: 'EUR', date: '2026-10-23', rates: { USD: 1.1, GBP: 0.85, JPY: 160 } };

describe('parseRates', () => {
  it('adds the base currency with rate 1 and keeps the date', () => {
    const data = parseRates(api);
    expect(data.rates).toEqual({ EUR: 1, USD: 1.1, GBP: 0.85, JPY: 160 });
    expect(data.date).toBe('2026-10-23');
    expect(currencyCodes(data)).toEqual(['EUR', 'GBP', 'JPY', 'USD']);
  });

  it('drops invalid rates', () => {
    expect(parseRates({ ...api, rates: { USD: 1.1, XXX: 'n/a', YYY: -2, ZZZ: 0 } }).rates).toEqual({ EUR: 1, USD: 1.1 });
  });

  it.each([null, {}, { base: 'EUR' }, { base: 'EUR', rates: {} }, 'text'])('rejects %p', (input) => {
    expect(() => parseRates(input)).toThrow();
  });
});

describe('convert', () => {
  const data = parseRates(api);

  it('converts via the base currency', () => {
    expect(convert(data, 'EUR', 'USD', 100)).toBeCloseTo(110);
    expect(convert(data, 'USD', 'EUR', 110)).toBeCloseTo(100);
    expect(convert(data, 'USD', 'GBP', 11)).toBeCloseTo(8.5);
  });

  it('round-trips', () => {
    expect(convert(data, 'GBP', 'JPY', convert(data, 'JPY', 'GBP', 123.45))).toBeCloseTo(123.45);
  });

  it('returns null for unknown currencies or missing amounts', () => {
    expect(convert(data, 'EUR', 'ABC', 1)).toBeNull();
    expect(convert(data, 'EUR', 'USD', null)).toBeNull();
  });
});

describe('parseAmount', () => {
  it.each([
    ['12', 12],
    ['12.5', 12.5],
    ['12,5', 12.5],
    ['1,234.50', 1234.5],
    ['1,234', 1234],
    [' 7 ', 7],
  ])('parses %p', (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });

  it.each(['', 'abc', '1.2.3'])('returns null for %p', (text) => {
    expect(parseAmount(text)).toBeNull();
  });
});

describe('formatAmount', () => {
  it('formats with thousands separators and sensible precision', () => {
    expect(formatAmount(1234.5)).toBe('1,234.50');
    expect(formatAmount(0.012345)).toBe('0.0123');
    expect(formatAmount(null)).toBe('');
  });
});
