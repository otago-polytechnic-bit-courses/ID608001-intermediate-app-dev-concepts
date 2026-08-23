# fittrack-app (Module 07)

Expo Router app demonstrating Module 07: JWT login, `expo-secure-store` token
storage, and a single `apiFetch` wrapper that attaches the token to every
request. Set up following Module 05's project steps, then extended with
Module 06's fetching pattern and Module 07's auth pattern.

Pinned to **Expo SDK 54** (`expo ~54.0.37`) to match the current Expo Go app.
`create-expo-app@latest` defaults to whatever the newest SDK is - if you
regenerate this from scratch and Expo Go rejects it with an SDK mismatch,
that's why; run `npx expo install expo@^54.0.0`, delete `node_modules` and
`package-lock.json`, `npm install`, then `npx expo install --fix`.

`app.json`'s `plugins` list deliberately doesn't include `expo-status-bar`:
on SDK 54 that package has no config plugin to run, and listing it there
breaks `expo export`/`expo start` with a `PluginError`. `expo-router` and
`expo-secure-store` do need to stay listed.

## Running it

```bash
cd "../backend"
python3 -m venv venv && source venv/bin/activate   # first time only
pip install -r requirements.txt                     # first time only
python manage.py migrate                            # first time only
python manage.py createsuperuser                    # first time only
python manage.py runserver 8000

cd ../fittrack-app
npm install
npx expo start
```

`.env` points the app at `http://127.0.0.1:8000/api`, which reaches the
backend from a simulator on the same machine. For a physical device, see
Module 07 section 8 and swap in your machine's LAN address.

This copy of the backend already has a seeded superuser for testing the
login screen: `demo` / `demoPass123!`, plus one `Studio` and one `StudioClass`
created while verifying this app. Change or remove them before using this as
a starting point for real work.

## What's here

- `app/login.tsx` - username/password form, wired to `lib/auth.ts#login`. Handles the waiting, success, and failure states from Module 06.
- `app/index.tsx` - protected studios list. Redirects to `/login` if no token is stored; a "Log out" button clears it.
- `app/studios/[id].tsx` - studio detail, including its nested classes.
- `lib/auth.ts` - token storage (`expo-secure-store`) and `login()`.
- `lib/api.ts` - the `apiFetch` wrapper and typed `studiosApi`-style functions (`getStudios`, `getStudio`, `createStudio`).
- `lib/config.ts` - reads `EXPO_PUBLIC_API_URL`, shared by both of the above so the base URL is defined once.

## What was actually verified

No iOS/Android simulator was available in the environment this was built in,
so verification was:

1. `npx tsc --noEmit` - clean, no type errors.
2. `npx expo export --platform ios` - bundles cleanly (1100+ modules, every screen and `lib/` import resolves).
3. The exact request sequence each screen makes (`POST /api/token/`, `POST /api/studios/`, `GET /api/studios/`, `GET /api/studios/:id/`) was replayed with plain `fetch` against the real running Django server, and the JSON returned was checked against the TypeScript interfaces in `lib/api.ts` field-for-field.

What that doesn't cover: actually rendering on a device or simulator, gesture
behaviour, and anything specific to `expo-secure-store`'s native keychain/keystore
integration (which has no meaningful equivalent outside a real app runtime).
Before treating this as done, run it in Expo Go or a simulator and confirm
the login screen, the redirect, and the studios list all behave as expected.
