# AshPlayer

AshPlayer is a social video player that allows watching videos in sync with friends. The following core technologies are used:
  - App: Electron + Angular
  - Video player: `libvlc` (through [WebChimera.js](https://github.com/RSATom/WebChimera.js/))
  - Authentication: Firebase Authentication
  - Database: Firestore

# Setup

  1. Create a Firebase project
  2. Enable Email/Password authentication
  3. Enable Firestore
  4. Copy the content of `firestore.rules` from [AshPlayer Server](https://github.com/ramtinsoltani/ash-player-server/blob/master/firestore.rules) and paste them into Firestore rules
  5. Generate a Firebase web credentials config and save it at `src/app/firebase.cert.json`
  6. Setup, build, and host [AshPlayer Server](https://github.com/ramtinsoltani/ash-player-server)
  7. Create file `/src/app/app.config.json` with the following content (replace `HOSTED_SERVER_URL` with the full address of the hosted server):
      ```json
      {
        "serverUrl": "HOSTED_SERVER_URL"
      }
      ```

# Launching

```bash
npm start
```

# Building

```bash
npm run build
```
