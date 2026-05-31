# Anchor Scaffold MCP — Marketing Website

A polished, single-page marketing site for **Anchor Scaffold MCP**, the AI code
generator for Solana's Anchor framework.

Built with **vanilla HTML, CSS, and JavaScript** — no build step, no dependencies,
no framework. It is fully static, so it works on GitHub Pages, Vercel, Netlify, or
just by double-clicking `index.html`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page markup and content |
| `styles.css` | Dark, Solana-inspired theme (purple `#9945FF` → green `#14F195`) |
| `script.js` | Copy buttons, scroll reveals, tabs, animated terminal |
| `README.md` | This file |

## Run locally

The simplest option:

- **Double-click `index.html`** — it opens in your browser and works fully offline.

> Note: when opened via `file://`, the clipboard uses a legacy fallback automatically,
> so the copy buttons still work. When hosted over `https://`, the modern
> `navigator.clipboard` API is used.

Optional local server (nicer for testing):

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080

# or Node
npx serve .
```

## Deploy

### GitHub Pages

1. Create a repo (e.g. `anchor-scaffold-mcp-website`) and push these files to the
   `main` branch (the three files must be at the repo root).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
5. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/<repo-name>/`.

To use a custom domain, add a `CNAME` file containing your domain and configure
DNS per GitHub's docs.

### Vercel

**Dashboard:**
1. Push the files to a Git repo and import it at [vercel.com/new](https://vercel.com/new).
2. Framework Preset: **Other**. Build Command: leave **empty**. Output Directory: `./`.
3. Click **Deploy**.

**CLI:**
```bash
npm i -g vercel
vercel        # from this folder; accept defaults (no build command)
vercel --prod # promote to production
```

### Netlify

**Drag & drop (fastest):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this folder onto the page. Done.

**From Git:**
1. Connect your repo in Netlify.
2. Build command: leave **empty**. Publish directory: `.` (root).
3. Deploy.

**CLI:**
```bash
npm i -g netlify-cli
netlify deploy --dir=. --prod
```

## Customizing

- **Links** — search `index.html` for `mukulcodezz` / `anchor-scaffold-mcp` to update
  GitHub and npm URLs.
- **Colors** — edit the CSS variables at the top of `styles.css` (`--purple`, `--green`, `--grad`).
- **Terminal animation** — edit the `script` array in `script.js` to change the lines
  that "type" in the hero terminal.
- **Copy snippets** — copy-button text lives in the `data-copy="..."` attributes in `index.html`.

## Notes

- Responsive (mobile + desktop), keyboard accessible, includes a skip link and
  respects `prefers-reduced-motion`.
- No analytics, trackers, or external scripts (only Google Fonts, which can be
  self-hosted if you prefer zero third-party requests).
- License: MIT — match the product's license.

Built by Mukul.
