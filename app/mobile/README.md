# Mobile App

React Native / Expo mobile app for the BioCARE prosthetic arm.

## Requirements

- Node.js 22.13 or newer
- npm
- Xcode for local iOS builds
- Android Studio for local Android builds

Run commands from `app/mobile`.

## Install

For a fresh clone, install the exact dependency versions from `package-lock.json`:

```bash
npm ci
```

Use `npm install` when intentionally adding or updating dependencies. Commit both
`package.json` and `package-lock.json` after dependency changes.

Expo and React Native packages must match the installed Expo SDK. Add or update
these packages with Expo rather than installing arbitrary versions:

```bash
npx expo install <package>
npx expo install --check
```

## Run

Start the Expo development server:

```bash
npm start
```

Run a specific platform:

```bash
npm run web
npm run ios
npm run android
```

If Metro has stale dependency data, restart it with a cleared cache:

```bash
npm start -- --clear
```

## Validate

```bash
npm run lint
npx tsc --noEmit
npx expo install --check
```

## Bluetooth

The app uses `react-native-ble-plx`, which contains native code. BLE functionality
will not work in the web build or the standard Expo Go app. Use an iOS or Android
development build when testing Bluetooth features.

## Troubleshooting

### Module resolution errors after installing

First confirm the lockfile is current in Git, then perform a clean,
lockfile-based install:

```bash
rm -rf node_modules
npm ci
npm start -- --clear
```

Do not fix Expo dependency warnings with `npm audit fix --force`; that can upgrade
the Expo SDK across breaking versions. Use `npx expo install --check` and update
the reported packages with `npx expo install`.

### Port 8081 is already in use

Find and stop the old Metro process:

```bash
lsof -nP -iTCP:8081 -sTCP:LISTEN
kill <PID>
```

## Git Ignore

The repository-level `.gitignore` excludes `node_modules`, `.expo`, and build
outputs. It does not exclude `package.json` or `package-lock.json`; both files
must remain committed so a fresh `npm ci` reproduces the working install.
