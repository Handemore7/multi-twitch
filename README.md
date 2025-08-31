# multichatter

Follow multiple Twitch chats at the same time. Add chats, change channels, and share the layout via URL.

## Features
- Add/remove chats dynamically
- Auto grid layout based on count (2,4,6,9, ...)
- Twitch chat embeds
- Shareable URL (?channels=shroud,riotgames,otknetwork)

## Dev
1. Install deps
```
npm install
```
2. Run dev server
```
npm run dev
```

## Build
```
npm run build
npm run preview
```

## Deploy
Any static host works (GitHub Pages, Netlify, Vercel). Ensure the domain is added as `parent` in the Twitch iframe URL. This app passes the current hostname automatically.
