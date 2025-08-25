# sev-website

Y2K-style landing page that displays the headline:

"Some things just should exist"

Includes a subtle animated starfield, CRT scanlines, and glossy chrome UI accents.

## Run / View

- Open `index.html` directly in your browser, or
- Serve locally (recommended for correct fonts/CORS on some browsers):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Files

- `index.html`: Markup for the landing page window
- `styles.css`: Y2K visuals (Orbitron/VT323, chrome, scanlines)
- `script.js`: Animated starfield and button flash
