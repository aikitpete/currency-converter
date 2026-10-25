# Currency converter

[![CI](https://img.shields.io/github/actions/workflow/status/aikitpete/currency-converter/ci.yml?branch=master&label=CI)](https://github.com/aikitpete/currency-converter/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/aikitpete/currency-converter)](LICENSE) ![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

React Native (Expo) app that converts between currencies using daily ECB reference rates and keeps working offline.

## Features

- Rates for the ECB reference currencies from the [Frankfurter API](https://frankfurter.dev) (ECB reference rates, updated each working day, no API key).
- Every successful response is saved on the device. If the next request fails or times out, the app shows the saved rates and says so, together with their date.
- Refreshes when the app returns to the foreground.
- Tolerant amount input: `1234.50`, `1,234.50` and `12,5` all work.

## Structure

| File | Purpose |
|---|---|
| `App.js` | UI and state (hooks) |
| `src/rates.js` | Parsing, conversion and formatting; pure functions |
| `src/ratesService.js` | Live fetch with timeout and storage fallback; dependencies are injected so it is testable |
| `tests/` | Jest tests for both modules (network failure, bad payloads, corrupt cache, input parsing) |

Conversion goes through the base currency: `amount / rate(from) * rate(to)`.

## Run

```bash
npm install
npm start        # then open in Expo Go, or press a / i / w
npm test
```

Built with Expo SDK 58 (React Native 0.88, React 19).

MIT licence.
