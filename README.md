# DoomBreak

A small mobile app that helps you stop doom-scrolling. You give yourself a daily scroll budget; once it runs out, the feed locks until tomorrow.

Built with [Expo](https://expo.dev/) / React Native + TypeScript. Runs on iOS, Android, and web.

## How it works

1. On first launch, pick a daily scroll budget (e.g. 10 minutes).
2. From the home screen, tap **Open the feed**. A built-in social-style feed starts draining your budget in real time.
3. When the budget hits zero, the feed hard-locks and you get a lock screen with a countdown until midnight. You can't scroll again today.
4. Tomorrow, the budget resets automatically.

You can change the budget or reset today's usage at any time from Settings.

### Why an in-app feed instead of blocking Instagram / TikTok?

A third-party mobile app can't force-close other apps on iOS. On Android it's possible with Accessibility / UsageStats permissions but is fragile and user-hostile. DoomBreak takes the opposite approach: it gives you a *safe* scroll feed with a hard cap, so the dopamine loop has an actual end.

## Run it

```bash
npm install
npm run start        # Expo dev server (scan QR with Expo Go on your phone)
npm run web          # run in the browser
npm run android      # run on an Android emulator / connected device
npm run ios          # run on iOS simulator (macOS only)
```

On your phone: install [Expo Go](https://expo.dev/go), then scan the QR code from `npm run start`.

## Project layout

```
App.tsx                       # screen switcher + global state
src/
  screens/
    OnboardingScreen.tsx      # first-run budget picker
    HomeScreen.tsx            # remaining time + "Open the feed" CTA
    FeedScreen.tsx            # mock social feed, drains budget as you scroll
    LockScreen.tsx            # shown when budget is exhausted
    SettingsScreen.tsx        # change budget, reset today
  storage.ts                  # AsyncStorage helpers + daily reset logic
  feedData.ts                 # mock posts
  theme.ts, format.ts, types.ts
```

Daily usage is stored with today's date and automatically resets on a new calendar day.
