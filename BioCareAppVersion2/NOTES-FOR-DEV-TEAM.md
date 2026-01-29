# NOTES FOR THE BIOCARE TEAM DEVS

This file contains information useful for the app developers working on this project.

## Project Setup

1. Clone the repo
2. `cd BioCareAppVersion2`
3. `npm install`
4. `npx expo start --clear`

## Important Notes

- BLE only works in **development builds** (not Expo Go)
  → Build command: `eas build --profile development --platform ios`
- Never commit real API keys or secrets
- Use `.env.local` for local development secrets (add it to `.gitignore`)
- Please be consistent with stylistic choices

## Folder Structure

- `app/`               → All screens/routes
- `utils/`             → Shared utilities (bleManager.ts, etc.)
- `BioCareESP32/`      → ESP32 firmware code
- `../BIOCARE-APP/BioCareAppVersion2` to run

## Common Commands

- Start dev server: `npx expo start --clear`
- Run iOS simulator: `npx expo start --ios` or `npx expo start`
- Build custom app: `eas build --profile development --platform ios` (I suggest NOT to do this as you will have to log in with you esp/eap which you most likely do NOT have)

## Stylistic Choices
- PLEASE KEEP THE HEADER AND FOOTER STYLES CONSISTENT ACROSS ALL PAGES

- PADDING FROM TOP PAGE TEXT SIZE = 68
- PADDING HORIZONTAL FROM TOP PAGE TEXT SIZE = 20

- TOP PAGE BACK ARROW FONT SIZE = 38 AND BACK ARROW FONT = BOLD
- TOP PAGE BACK ARROW COLOR = WHITE

- TOP PAGE HEADER FONT SIZE = 34 AND FONT = BOLD
- TOP PAGE HEADER COLOR = WHITE

## BLE MANAGEMENT

You need to make the custom app here to run the BLE because react-native-ble-plx module is not supported in ExpoGO
 - npx expo install expo-dev-client
 - eas build --profile development --platform ios
 - install the unique custom app to your phone
 - BLE Code should work 

## Additional Notes

Feel free to add anything useful here for the team!