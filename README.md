# currency-converter

A simple React Native / Expo mobile app for converting currencies with live exchange-rate data and offline fallback support.

## What it does
The app lets a user:

- choose source and target currencies,
- enter an amount,
- fetch exchange-rate data,
- convert values in the UI,
- reuse previously stored data if the latest API request fails.

## Repository structure
- `App.js` – main application flow and state handling
- `components/` – UI pieces such as converter/picker components
- `services/` – API, conversion, and storage services
- `data/` – local data helpers
- `assets/` – app assets

## Tech
- React Native
- Expo
- JavaScript

## How it works
On startup, the app fetches exchange-rate data through an API service.  
If fresh data cannot be loaded, it falls back to previously stored data so the app remains usable.  
Conversion logic is separated into dedicated services instead of being buried directly inside the UI.

## Run locally
```bash
npm install
npm start
```

## Why this repo is useful
This is a straightforward mobile engineering sample that demonstrates:
- API integration
- local persistence fallback
- separation between UI and service logic
- practical state management in a small app
