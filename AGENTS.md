# AGENTS.md

## Cursor Cloud specific instructions

### Overview
This repo is a fully self-contained, static single-page web app ("Projects Calendar"): `index.html`, `styles.css`, and `app.js` (vanilla JS, no framework). State is persisted client-side via `localStorage` (key `projects`). There is **no package manager, no build step, no backend, and no dependencies** to install.

### Running the app (dev)
Serve the directory over HTTP (required so the browser fetches `styles.css`/`app.js` correctly; opening via `file://` also works but HTTP mirrors normal dev):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Any static file server works (e.g. `npx serve`); Python 3 is already available.

### Notes / gotchas
- No lint/test/build tooling exists in this repo. "Build" is a no-op; there is nothing to compile.
- Default sample projects are generated in `getDefaultProjects()` (app.js) only when `localStorage` has no `projects` key. To reset to defaults, clear site data / localStorage in the browser.
- Right-click a project in the sidebar to delete it; clicking a day cell opens a day-detail modal.
