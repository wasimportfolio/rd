# RD Photography — Cinematic Website

A cinematic, camera-themed photography portfolio site. Static HTML/CSS/JS —
no build step required.

## Project structure

```
rd-photography/
  index.html
  css/
    style.css        design tokens + layout + component styles
    responsive.css    tablet/mobile breakpoints
  js/
    cursor.js         custom cursor
    camera.js          Three.js camera hero + "Enter the Camera" sequence
    animations.js      GSAP scroll-triggered reveals & parallax
    gallery.js         portfolio filter, lightbox, testimonials, video modal
    main.js            Lenis smooth scroll, mobile menu, misc UX
  assets/
    images/            hero.webp, about.webp, film.webp, portfolio/, instagram/
    videos/            showreel.mp4
    models/            camera.glb (optional real 3D model)
    audio/             shutter.mp3
```

## Run it locally

Browsers block ES module-style asset loading and some video/canvas features
from `file://`, so serve the folder instead of double-clicking `index.html`:

```bash
cd rd-photography
python3 -m http.server 8080
# then open http://localhost:8080
```

(Any static server works — `npx serve`, VS Code's Live Server, etc.)

## Where things stand right now

There are no real photos, video, 3D model, or sound yet — the site uses:

- **Photos** → elegant dark gradient placeholder blocks (`.ph-image`), each
  marked with an HTML comment showing exactly what to replace it with.
- **Camera** → the intro uses a real photo (`assets/images/camera-intro.jpg`)
  once you add one — until then it shows a dark gradient placeholder. Pick a
  brand-neutral shot (no visible logo/brand name on the body — a tight angle
  on the lens, or a matte-black body, works best) so there's no trademark
  issue with using an actual Sony/Canon/Nikon/etc. camera image.
- **Showreel / shutter sound** → referenced but optional; the site works
  fully if these files are absent.

## 1. Adding real RD Photography images

Drop files into `assets/images/` using these exact names (or update the
paths in `index.html` / `gallery.js` if you rename them):

- `hero.webp` — hero background (used via CSS at the `.ph-hero` block)
- `about.webp` — photographer/editorial photo
- `film.webp` — poster image for the films section
- `portfolio/wedding-01.webp`, `wedding-02.webp`, `prewedding-01.webp`,
  `prewedding-02.webp`, `portrait-01.webp`, `events-01.webp`,
  `fashion-01.webp`
- `instagram/instagram-01.webp` through `instagram-08.webp`

Each placeholder in `index.html` has a comment like
`<!-- Replace with RD Photography's real wedding photo -->` directly above
it — search for `ph-image` and `Replace with` to find every spot.

To actually show the image instead of the gradient, add a background image
rule, e.g.:

```css
.ph-hero { background-image: url('../assets/images/hero.webp'); background-size: cover; background-position: center; }
```

## 2. Adding the real camera photo

Place a photo at `assets/images/camera-intro.jpg` — this is what fills the
whole intro screen and gets pushed into / zoomed on "Enter the Camera".

Tips for picking the shot:
- **No visible brand name/logo** on the body — crop tight on the lens
  barrel, or use an angle where the logo isn't legible, so there's no
  trademark issue with using a real manufacturer's camera.
- Dark or black-bodied cameras blend best with the site's palette; a bit of
  gold/warm rim light in the photo matches the champagne-gold accent.
- A free-license source (Unsplash, Pexels, Pixabay) works well and is safe
  to use commercially — just confirm the specific photo's license terms.

The image is applied via CSS in `css/style.css` under `.intro-camera-photo`
— nothing else needs to change once the file is in place. (The
`assets/models/` folder is left in the project structure in case you want to
add a real `.glb` 3D camera model later instead — that would need a
Three.js + GLTFLoader setup added back in, which isn't wired up right now.)

## 3. Adding the shutter sound

Place `shutter.mp3` at `assets/audio/shutter.mp3`. It's already wired up in
`camera.js` and only plays after the visitor clicks **Enter the Camera**
(autoplay-safe). If the file is missing, the animation just runs silently —
nothing breaks.

## 4. Adding the showreel video

Place `showreel.mp4` at `assets/videos/showreel.mp4`. It's used as a
background loop in the Films section and in the fullscreen play modal. If
it's missing, the poster image (`film.webp`) shows instead.

## 5. Replacing placeholder images generally

Every placeholder is the `.ph-image` div — a styled gradient block, not a
broken `<img>`, so the site never shows broken-image icons. Once you add
real photography, either:

- add `background-image` rules per class (see example above), or
- swap the approach to `<img>` tags with `loading="lazy"` and `alt` text for
  better SEO/accessibility once real photos exist.

## 6. Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "RD Photography site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: main branch, root** — save,
and the site publishes at `https://<username>.github.io/<repo>/`.

## 7. Deploying to Vercel or Netlify

**Vercel:**
```bash
npm i -g vercel
vercel
```
Accept the defaults — it's a static site, no build command needed.

**Netlify:**
- Drag the `rd-photography` folder into the Netlify dashboard's deploy area, or
- `netlify deploy` via the Netlify CLI, with the publish directory set to
  the project root (`.`).

No environment variables, build step, or server are required either way.
