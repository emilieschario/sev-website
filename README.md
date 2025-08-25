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

## Deploy to GitHub Pages (custom domain)

This repo is preconfigured for GitHub Pages via GitHub Actions and a custom domain `shouldexistventures.com`.

1) Repository requirements

- Make the repository public, or ensure the account/organization has a plan that supports Pages for private repositories.
- Default branch: `main`.

2) GitHub Pages settings

- Settings → Pages:
  - Build and deployment: “GitHub Actions”.
  - Custom domain: `shouldexistventures.com` (a `CNAME` file is already in the repo).
  - Enable “Enforce HTTPS”.

3) DNS records for shouldexistventures.com

- Apex A records (add all four):
  - `@  A  185.199.108.153`
  - `@  A  185.199.109.153`
  - `@  A  185.199.110.153`
  - `@  A  185.199.111.153`
- Optional IPv6 (if your DNS provider supports AAAA):
  - `@  AAAA  2606:50c0:8000::153`
  - `@  AAAA  2606:50c0:8001::153`
  - `@  AAAA  2606:50c0:8002::153`
  - `@  AAAA  2606:50c0:8003::153`
- WWW subdomain (apex redirect):
  - `www  CNAME  shouldexistventures.com`
  - When the custom domain in GitHub is set to the apex (`shouldexistventures.com`), GitHub Pages will automatically redirect `www.shouldexistventures.com` → `shouldexistventures.com`.

Notes:
- Some DNS providers support `ALIAS`/`ANAME` at apex; if so, pointing `@` to `emilieschario.github.io` also works.
- After saving the custom domain in GitHub, you may be prompted to add a TXT verification record like `_github-pages-challenge-emilieschario`. Copy the exact TXT value shown in Settings → Pages and add it to DNS. Remove it after verification completes.

4) Trigger a deployment

- Push to `main` (already configured). The workflow `.github/workflows/pages.yml` will build and deploy the static site from the repo root.
- First HTTPS issuance can take a few minutes after DNS propagates (usually up to 30 minutes; sometimes 24–48 hours depending on DNS TTLs).

