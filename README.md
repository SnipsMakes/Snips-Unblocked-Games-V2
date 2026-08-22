# Snips Unblocked Games

A simple, static, no-AI, no-tracking games site. Games are listed in `games.json`
and loaded into an `<iframe>` when clicked.

## Files
- `index.html` — page structure
- `style.css` — theme (red / gold / black / white) + falling-cats animation
- `script.js` — loads `games.json`, builds the grid, handles search/filter/play
- `games.json` — your list of games

## Adding a game
Open `games.json` and add an entry to the array:

```json
{
  "id": "unique-id",
  "title": "Game Name",
  "category": "Action",
  "icon": "🎮",
  "src": "https://your-game-embed-url"
}
```

- `id` — unique string, no spaces
- `title` — shown on the card and in the player bar
- `category` — used to populate the category dropdown (any text you like)
- `icon` — an emoji shown on the card thumbnail
- `src` — the URL loaded into the iframe when the game is opened

**Important:** not every site allows itself to be put in an iframe. Sites can
send an `X-Frame-Options` or `Content-Security-Policy` header that blocks
embedding — if a game shows blank/refuses to load, that's why. Self-hosted
games (a folder with an `index.html` for the game itself) or game hosts that
explicitly support embedding work best. The two sample entries and the
"replace me" entry in `games.json` are placeholders — swap them for games you've
confirmed work.

## Running it
No build step needed. Either:
- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server` then visit `http://localhost:8000`

Serving it (rather than opening the file directly) is recommended, since some
browsers restrict `fetch()` on `file://` pages.

## Customizing
- Colors live as CSS variables at the top of `style.css` (`--red`, `--gold`, `--black`, `--white`).
- The falling-cats animation is in `style.css` (`.cat-drop`, `@keyframes cat-fall`) and
  `script.js` (`catRain` function) — adjust `setInterval(spawnCat, 900)` to make it rain
  more or less, and the `duration`/`size` ranges to change speed/size.
- The logo is an inline SVG cat icon in `index.html` — swap it for an `<img>` tag if you'd
  rather use an image file.
