# NarutoDex 3D

A 3D character encyclopedia for the Naruto universe, built with React, TypeScript and Three.js. Browse the shinobi as cards, then open any of them to explore a 3D model.

Live: https://fchapoulliep.github.io/narutodex3d/

## Features

- 53 characters and forms in a horizontal card carousel, with navigation arrows and keyboard control
- Search by name, case and accent insensitive
- Filter by village: Konohagakure, Sunagakure, Kirigakure, Iwagakure, Kumogakure, Amegakure, or Unknown
- Tilt cards with a glare effect, styled after the character's village, with clan and title badges (Uchiha, Akatsuki, Seventh Hokage and more)
- A page per character with its name, description, badges and a background matching its village
- Interactive 3D viewer: drag to orbit, scroll to zoom, auto-rotation. Each character holds an iconic pose from the anime and breathes in it (an 8 s idle loop: the breath, the head, a slight knee bend with the feet planted flat, the arms a little), shown at its real size: the model is scaled on its standing height, so a crouching character looks crouched and a raised arm does not shrink the body (unless it would reach above the frame). The camera matches BleachDex: close up and slightly from above
- Previous and next arrows to step through the characters
- A guide on the first visit: the page darkens around the centred card, then around the model on the first character page, and a dialogue box says to click the card, then to drag and zoom (remembered by the browser, once per dex)
- Sharingan loading animation and a navigation bar with a live clock on the character page

## Tech Stack

- React 18
- TypeScript 5.6
- Vite 6
- Three.js 0.171
- React Three Fiber 8 and Drei 9
- Swiper 11
- React Router 7 (`BrowserRouter`)
- react-parallax-tilt
- ESLint 9
- gh-pages

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL. The app is served under the `/narutodex3d/` base path, set in `vite.config.ts`.

Other scripts:

```bash
npm run build     # type-check with tsc, then build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

### Deploy to GitHub Pages

```bash
npm run build
npm run deploy
```

`deploy` publishes the existing `dist/` folder to the `gh-pages` branch. It does not build first, so run `build` before it.

## Project Structure

```
public/
  models/<Name>/<Name>.glb     3D models, one folder per character
  sprites/<Name>.png           card images, rendered from each model in its pose
  type_icons/                  clan and title badge icons
  backgrounds/                 character page backgrounds, one per village
src/
  components/                  dex page, cards, character page and 3D viewer
  css/                         stylesheets
  data/narutocharacters.json   character list (id, name, village, clans and titles, description)
  assets/                      logo, font, card art, arrows, icons
```

## Notes

- A character's `name` in `src/data/narutocharacters.json` is also the file name of its model and sprite. Adding a character means adding the JSON entry, `public/models/<Name>/<Name>.glb` and `public/sprites/<Name>.png`.
- The models are glTF binary files exported from Blender, loaded with Drei's `useGLTF`. They ship with the repository (about 256 MB), so the first clone takes a while.
- Each pose is baked into the model as its rest pose, and an `Idle` clip of 8 s breathes around it; a hand that touches something (the other hand, a hip, the face) follows what it touches, and the feet never move. The scene carries two heights as glTF extras, `standHeight` (the character standing, before posing) and `poseHeight` (the posed model), both measured in Blender; the viewer scales its own bounding box by their ratio. A model without them falls back to fitting its bounding box. The viewer plays the clip whose name contains `idle` or `wait`.
- Characters live at real paths (`/narutodex3d/12`). GitHub Pages has no fallback for a single-page app, so the build (a small plugin in `vite.config.ts`) writes one HTML file per character, with its own title, description, share image and canonical URL, plus a `404.html` that loads the app on any other path and a `sitemap.xml` generated from the character data. Old `#/12` links are redirected.
- Fan project, not affiliated with or endorsed by the owners of Naruto. Characters and related assets belong to their respective owners.
