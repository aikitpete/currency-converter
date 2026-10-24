import { CACHE_KEY, RATES_URL, loadRates } from '../src/ratesService';

const api = { base: 'EUR', date: '2026-10-23', rates: { USD: 1.1 } };

function memoryStorage(initial = {}) {
  const items = { ...initial };
  return {
    items,
    getItem: async (key) => (key in items ? items[key] : null),
    setItem: async (key, value) => { items[key] = value; },
  };
}

const okResponse = (body) => ({ ok: true, status: 200, json: async () => body });

describe('loadRates', () => {
  it('returns live data and caches it', async () => {
    const storage = memoryStorage();
    const fetchImpl = jest.fn().mockResolvedValue(okResponse(api));
    const result = await loadRates({ storage, fetchImpl });
    expect(fetchImpl).toHaveBeenCalledWith(RATES_URL, expect.any(Object));
    expect(result.source).toBe('live');
    expect(result.data.rates.USD).toBe(1.1);
    expect(JSON.parse(storage.items[CACHE_KEY]).rates.EUR).toBe(1);
  });

  it('falls back to saved rates when the request fails', async () => {
    const storage = memoryStorage();
    await loadRates({ storage, fetchImpl: async () => okResponse(api) });
    const result = await loadRates({ storage, fetchImpl: async () => { throw new Error('offline'); } });
    expect(result.source).toBe('cached');
    expect(result.data.rates.USD).toBe(1.1);
  });

  it('falls back to saved rates on a server error or malformed response', async () => {
    const storage = memoryStorage();
    await loadRates({ storage, fetchImpl: async () => okResponse(api) });
    const serverError = await loadRates({ storage, fetchImpl: async () => ({ ok: false, status: 503 }) });
    const malformed = await loadRates({ storage, fetchImpl: async () => okResponse({ hello: 'world' }) });
    expect(serverError.source).toBe('cached');
    expect(malformed.source).toBe('cached');
  });

  it('rejects when offline and nothing is saved', async () => {
    await expect(loadRates({ storage: memoryStorage(), fetchImpl: async () => { throw new Error('offline'); } })).rejects.toThrow('offline');
  });

  it('ignores a corrupt cache', async () => {
    const storage = memoryStorage({ [CACHE_KEY]: '{not json' });
    await expect(loadRates({ storage, fetchImpl: async () => { throw new Error('offline'); } })).rejects.toThrow('offline');
  });

  it('still returns live data when saving fails', async () => {
    const storage = { getItem: async () => null, setItem: async () => { throw new Error('disk full'); } };
    const result = await loadRates({ storage, fetchImpl: async () => okResponse(api) });
    expect(result.source).toBe('live');
  });
});
