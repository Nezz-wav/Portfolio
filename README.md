# Haldoren portfolio: GitHub Pages site

## Deploy (5 minutes)
1. On github.com click **New repository** (e.g. `portfolio`), keep it Public.
2. Click **uploading an existing file**, drag in everything in this folder (keep the folder structure), commit.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save.**
4. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.
   (Name the repo `<your-username>.github.io` to get `https://<your-username>.github.io/`.)

## Editing
You can edit straight on GitHub: open a file → pencil icon → Commit. The site updates in about a minute.

| What | File |
|---|---|
| Projects (title, text, video), images, transition video | `assets/js/config.js` |
| Designer card (name, role, email, handle), nav button labels, contact links, page title | `index.html` |
| Colors, sizes, fonts, layout | `assets/css/style.css` |
| Animation/behaviour | `assets/js/main.js` |

### Add a project
Copy one `{ ... }` block inside `cases:[ ]` in `config.js`, paste it after a comma, change the text and the `v:` video link.

### Use your own images/videos
Put files in `assets/media/` and reference them like `v:'assets/media/my-reel.mp4'`.
The demo artwork is currently loaded from external CDNs (higgs.ai, cloudfront, r2.dev); download those files into `assets/media/` if you want the site to keep working independently.
Keep videos small (under about 25 MB each; GitHub rejects files over 100 MB).

### Contact links
`index.html` has two `mailto:` links on the "contacts" and "discuss a project" buttons; change the email there. Also update the designer card email/handle.
