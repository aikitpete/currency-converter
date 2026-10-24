import { parseRates } from './rates';

// ECB reference rates, published daily by the Frankfurter project (no API key needed).
export const RATES_URL = 'https://api.frankfurter.dev/v1/latest';
export const CACHE_KEY = 'rates:v1';

async function fetchWithTimeout(fetchImpl, url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Load rates: live from the API when possible, otherwise the last successful response from storage.
 * Resolves to { data, source: 'live' | 'cached' }; rejects only when there is neither network nor a saved copy.
 */
export async function loadRates({ storage, fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  try {
    const response = await fetchWithTimeout(fetchImpl, RATES_URL, timeoutMs);
    if (!response.ok) {
      throw new Error(`Rates request failed with status ${response.status}`);
    }
    const data = parseRates(await response.json());
    try {
      await storage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (storageError) {
      // A full or unavailable cache must not block a successful live fetch.
    }
    return { data, source: 'live' };
  } catch (networkError) {
    let saved = null;
    try {
      saved = await storage.getItem(CACHE_KEY);
    } catch (storageError) {
      saved = null;
    }
    if (saved) {
      try {
        return { data: parseRates(JSON.parse(saved)), source: 'cached' };
      } catch (parseError) {
        // Fall through: a corrupt cache is treated as missing.
      }
    }
    throw networkError;
  }
}
