# Mobile Shell Workspace

This folder contains the Capacitor shell setup for iOS and Android.

## Layout

- ios
- android

All mobile tooling and native project files stay inside this folder so the web root remains clean for GitHub Pages.

## Shell Mode

The app loads the live site directly:

- https://wortschatzapp.de

Capacitor config is in `mobile/capacitor.config.json`. Native OAuth uses `@capacitor/browser` + `@capacitor/app` deep links. Allowed navigation includes `*.supabase.co`.

## Commands

Run from this folder:

- `npm install`
- `npm run sync`
- `npm run open:ios`
- `npm run open:android`

## Local Web Dev

From the repository root (not this folder):

```bash
npm install
npm run dev
```

Serves the app at `https://localhost:3000` and starts a Cloudflare Quick Tunnel for mobile device testing. To restart in the background: `scripts/restart_server.sh`.

## Workflow

1. Make web changes in repository root files.
2. Commit web changes.
3. From `mobile/`, run `npm run sync`.
4. Test in Xcode/Android Studio.
