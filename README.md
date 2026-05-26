# ISO27001 Forms Request Site

Minimal static site for collecting requests to receive ISO27001 analysis forms and checklists.

## How it works
- The form builds a pre-filled `mailto:` message to your configured recipient.
- Edit `app.js` and set `RECIPIENT` to your support/security email.

## Run locally
1. Open `index.html` directly in a browser, or run a simple server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

## Files
- `index.html` - request form
- `styles.css` - styles
- `app.js` - submission handler
