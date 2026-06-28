# Pawn Gambit - Neon Grid Puzzle Mobile App

A high-fidelity React Native Expo mobile app inspired by the puzzle coordination mechanics of Wallz.gg. 

## Features
- **9x9 Neon Grid Board**: Recreating the cartoon arcade neon aesthetic with high-fidelity gradients and glowing barriers.
- **Two-Ball Coordination**: Control both the Pink and Cyan balls. Get the Cyan ball to the Cyan top row and the Pink ball to the Pink bottom row.
- **10 Handcrafted Levels**: Increasing difficulty, starting with the layout from the reference image.
- **Blocked Movement Shake**: Board shakes physically when an illegal move or barrier collision is made.
- **Spring Movement Animation**: Smooth sliding animations with spring bounce on successful moves.
- **Time Attack Mode**: A 60-second countdown starting after clicking the Start button.
- **Undo / Reset**: Quick controls to revert moves or restart a level.
- **High Scores**: Saved locally using `@react-native-async-storage/async-storage`.

---

## How to Play
1. **Select a Ball**: Tap either the Pink or Cyan ball.
2. **Move**:
   - Tap an adjacent cell to step in that direction.
   - Swipe anywhere on the board to move the selected ball.
3. **Win Condition**: Place both balls in their target zones (Cyan on top row, Pink on bottom row).

---

## Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Expo Dev Server
```bash
npx expo start
```
- Scan the QR code with the **Expo Go** app on iOS/Android to run the app.
- Press `a` to run on an Android emulator or `i` to run on an iOS simulator.

---

## Production Builds with EAS

This project is ready to be built using [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/).

### Prerequisites
1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure the project:
   ```bash
   eas build:configure
   ```

### Android Build (APK / AAB)
- **To build a standard AAB for Google Play**:
  ```bash
  eas build --platform android
  ```
- **To build a test APK for direct installation**:
  Update your `eas.json` build profile to include `"developmentClient": false` and `"distribution": "internal"`, or run:
  ```bash
  eas build --platform android --profile preview
  ```

### iOS Build
- **To build for App Store submit**:
  ```bash
  eas build --platform ios
  ```
- **To build for Ad Hoc / Simulator testing**:
  ```bash
  eas build --platform ios --profile preview
  ```
