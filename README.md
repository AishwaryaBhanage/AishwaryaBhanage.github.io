# aishwaryabhanage.github.io

Personal portfolio of Aishwarya Bhanage — ML engineer, AI engineer, dancer.
Live at **https://aishwaryabhanage.github.io/**

Built with React 19, Vite and Tailwind CSS v4.

## Branches

| Branch      | Holds                                              |
| ----------- | -------------------------------------------------- |
| `main`      | the source (this code)                              |
| `gh-pages`  | the built site, which is what GitHub Pages serves   |

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

## Publishing a change

```bash
git add -A && git commit -m "..." && git push   # source to main
npm run deploy                                   # build to gh-pages, goes live
```

`npm run deploy` builds, adds `.nojekyll`, and force-pushes `dist/` to
`gh-pages`. GitHub Pages picks it up within a minute or so.

## Layout

```
src/
  data/content.js      every word, role, project and skill on the site
  components/          the gate, the crossword name, navigation, editorial system
  pages/               one route per section, technical side plus /creative
public/
  images/              portrait and the creative gallery
  resume/              downloadable PDFs
```

`src/data/content.js` is the single source of truth — change the content there
and every page follows.

## Routing

The site uses client-side routing. `npm run build` copies `index.html` to
`404.html` so a deep link such as `/projects` is served by the app rather than
by a GitHub 404 page.
