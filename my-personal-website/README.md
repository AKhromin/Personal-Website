# Personal website

React portfolio built with Vite and published to GitHub Pages at [alexeykhromin.com](https://alexeykhromin.com).

Run the following commands from this directory (`my-personal-website/`).

## Local preview

On a fresh checkout, install dependencies with `npm ci`. Start the development server with:

```sh
npm run dev
```

Open the local address printed in the terminal, normally http://localhost:5173.

## Publish to GitHub Pages

```sh
npm run deploy
```

This automatically runs `npm run build`, creates the production site in `dist/`, and publishes it to the `gh-pages` branch using the configured Git remote. You need GitHub push access. GitHub Settings → Pages should use **Deploy from a branch**, **gh-pages**, **/ (root)**.

The build copies `public/CNAME` so the custom domain is retained. Commit and push source changes separately to save them on the main branch; deployment only publishes the built site.

To check a production build locally, run `npm run build` and then `npm run preview`.

## Project content and screenshots

Project entries live in `src/data/projectsData.js` and share the same detail layout across desktop, tablet and mobile. Optional `sections` add titled paragraphs between Features and Tech Stack.

AeroCapital screenshots belong in `public/assets/images/AeroCapitalProject/`. See that folder's README for the matching `media` entries to add to the project data. The first listed screenshot becomes the thumbnail.
