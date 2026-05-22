<!-- From: /Users/benjamin/Documents/Software Projects/Website Projects/EmmanuelIren/AGENTS.md -->
# AGENTS.md — Emmanuel Iren Portfolio

This document provides essential information for AI coding agents working on this project.

---

## Project Overview

This is a **multi-page portfolio website** for Apostle Emmanuel Iren, a Nigerian pastor, author, and communicator who leads Celebration Church International (CCI). The site serves as a central hub showcasing his ministry work, media channels, media resources, and speaking engagements.

### Key Facts
- **Project Type**: Multi-page static website (HTML, CSS, vanilla JavaScript)
- **Hosting Platform**: Firebase Hosting
- **Live Domain**: emmanueliren.com
- **Primary Purpose**: Portfolio, store, and contact gateway for speaking requests

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla HTML5, CSS3, ES6+ JavaScript |
| Styling | Custom CSS with CSS variables, no frameworks |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans) |
| Animation | CSS animations + Intersection Observer API |
| Build Tool | None (static files served directly) |
| Hosting | Firebase Hosting |
| Image CDN | Cloudinary (responsive images, auto WebP/AVIF) |
| Backend | Firebase (Authentication, Firestore, Storage, Analytics) |
| Dev Dependencies | `firebase-tools`, `cross-env`, `firebase-admin` |

---

## Project Structure

```
EmmanuelIren/
├── firebase.json          # Firebase Hosting configuration
├── .firebaserc            # Firebase project aliases
├── package.json           # Node.js dependencies and npm scripts
├── .gitignore             # Git ignore rules (includes firebase-config.js)
├── PROJECT_BRIEF.md       # Full brand brief and copy document
├── scripts/
│   └── set-admin.js       # Script to set admin custom claims
└── public/                # Static site content (deployed to hosting)
    ├── index.html         # Home page
    ├── about.html         # About / Biography
    ├── ministry.html      # Ministry / CCI
    ├── media.html         # Media (sermons, music, film, press)
    ├── speaking.html      # Speaking / Booking
    ├── store.html         # Store / Products
    ├── connect.html       # Connect / Social / Church finder
    ├── admin.html         # Admin panel login/dashboard
    ├── css/
    │   ├── main.css       # Design system, shared styles, nav, footer
    │   ├── home.css       # Home page styles
    │   ├── about.css      # About page styles
    │   ├── ministry.css   # Ministry page styles
    │   ├── media.css      # Media page styles
    │   ├── speaking.css   # Speaking page styles
    │   ├── store.css      # Store page styles
    │   ├── connect.css    # Connect page styles
    │   └── admin.css      # Admin panel styles
    ├── js/
    │   ├── main.js        # Shared JS (nav, animations, utilities)
    │   ├── media-tabs.js  # Media page tab switching
    │   ├── speaking.js    # Speaking booking form with Firebase
    │   ├── contact.js     # Contact form with Firebase
    │   ├── admin.js       # Admin dashboard logic
    │   ├── firebase-init.js      # Firebase SDK initialization
    │   └── firebase-config.js    # Firebase config (gitignored)
    └── images/            # Photography and assets
```

### Page Structure

| Page | File | Description |
|------|------|-------------|
| Home | index.html | Hero, stats, scripture, four pillars, sermon section |
| About | about.html | Bio, family strip, honours |
| Ministry | ministry.html | CCI intro, discipleship platforms |
| Media | media.html | Sermons, music, film, press tabs |
| Speaking | speaking.html | Topics, past events, booking form |
| Store | store.html | Product grid with badges |
| Connect | connect.html | Social platforms, church finder |
| Admin | admin.html | Login dashboard for managing contact requests |

---

## Design System

### Colour Palette
| Name | Hex | Role |
|------|-----|------|
| Black | #080810 | Primary background |
| Deep Navy | #0D0D1A | Card surfaces, nav, stats bar |
| Gold | #C4973A | Primary accent — π logo, headings, CTAs, borders |
| Cream | #F2EDE4 | Primary text colour |
| Muted Grey | #8A8A9A | Secondary text, captions |
| Red | #C0392B | Signal only — live badges, new badges |

### Typography
| Role | Font | Weight |
|------|------|--------|
| Display / Headings | Cormorant Garamond | 300, 400, Italic |
| Body / UI | DM Sans | 300, 400, 500 |

### CSS Variables
```css
--black: #080810
--navy: #0D0D1A
--navy2: #111122
--gold: #C4973A
--gold-lt: #E2B96A
--red: #C0392B
--cream: #F2EDE4
--muted: #8A8A9A
--serif: 'Cormorant Garamond', Georgia, serif
--sans: 'DM Sans', sans-serif
```

### Design Principles
- Gold dominates. It is the only brand accent. Red is functional only.
- π on every page. In the nav logo (small, gold) and as watermark in hero.
- Dark background only. No light mode.
- Mobile-first.
- One primary CTA per page.

---

## Animations & Interactions

### Scroll Reveal
Elements with class `.reveal` animate in when scrolling into view:
- Opacity fade + translate Y
- Smooth easing with Intersection Observer

### Stagger Children
Containers with `.stagger-children` animate child elements sequentially:
- 100ms delay between each child
- Fade up animation

### Card Hover Effects
- Transform: translateY(-6px)
- Box shadow increase
- Top border accent color reveal (gold)

### Navigation
- Fixed position with scroll-triggered background change
- Backdrop blur when scrolled
- Mobile slide-out menu

### Live Dot
`.live-dot` pulses with CSS animation for live indicators.

---

## Build and Development Commands

All commands are run from the project root.

### Local Development
```bash
npm run dev
```
Starts Firebase Hosting emulator for local testing.

### Deployment
```bash
npm run deploy
```
Deploys the `public/` directory to Firebase Hosting production.

### Set Admin User
```bash
npm run set-admin user@email.com
```
Sets a Firebase Auth user as admin (requires service-account.json).

### Upload Images to Cloudinary
```bash
# Preview
npm run upload-images -- --dry-run

# Upload all images
npm run upload-images

# Upload + update HTML/CSS with your cloud name
npm run upload-images -- --update-html
```
Uploads `public/images/` to Cloudinary CDN. See `CLOUDINARY_SETUP.md` for credentials setup.

---

## Firebase Configuration

### Hosting (firebase.json)
- **Public directory**: `public/`
- **Clean URLs**: Enabled (removes `.html` extensions)
- **Trailing Slash**: Disabled
- **Cache Headers**: CSS/JS (1 year), Images (7 days)

### Image CDN (Cloudinary)
All photos and artwork are served via Cloudinary with:
- **Automatic format selection** (`f_auto`) — WebP/AVIF for modern browsers
- **Automatic quality** (`q_auto`) — optimized file size
- **Responsive `srcset`** — browser downloads only the needed resolution
- **Folder structure**: `emmanueliren/` with subfolders `books/` and `media/`
- **Setup**: See `CLOUDINARY_SETUP.md` for upload instructions

The `logo.svg` remains local in `public/images/` (SVGs don't benefit from image CDN optimization).

### Firestore Collections
- `contactRequests` - General contact form submissions
- `speakingRequests` - Speaking invitation requests

### Security Rules Required
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactRequests/{request} {
      allow create: if true;
      allow read, update: if request.auth != null && 
        request.auth.token.admin == true;
    }
    match /speakingRequests/{request} {
      allow create: if true;
      allow read, update: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

## CSS Architecture

### Main.css (Shared)
- CSS custom properties (colors, fonts, shadows, transitions)
- Reset and base styles
- Typography (eyebrow, headings)
- Utilities (container, sr-only)
- Buttons (primary, ghost, red, text variants)
- Navigation (fixed, scrolled state, mobile)
- Footer (grid layout, social links)
- Cards (hover effects)
- Product cards (image, badge, price)
- Forms (inputs, labels, select, textarea)
- Animations (fadeUp, reveal, stagger, page enter)
- Scripture strip
- Stats bar

### Page CSS
Each page has specific styles in its dedicated CSS file:
- Page header variations
- Page-specific layouts and grids
- Tab panels (media page)
- Tables (speaking page)

All CSS files use the shared variables from main.css.

---

## JavaScript Architecture

### Main.js (Shared)
- Navigation scroll effect
- Mobile menu toggle
- Scroll reveal observer
- Stagger children observer
- Dynamic year in footer
- Smooth scroll for anchors (same page only)

### Page Scripts
- **media-tabs.js**: Media page tab switching (Sermons | Music | Film | Press)
- **speaking.js**: Speaking booking form submission to Firestore
- **contact.js**: Contact form submission to Firestore
- **admin.js**: Admin dashboard authentication and data loading

### Firebase
- **firebase-init.js**: Initializes Firebase App, Auth, Firestore, Storage
- **firebase-config.js**: Config object (gitignored)

---

## External Resources

### Cloudinary (Image CDN)
- Preconnect added in `<head>` for faster image loading
- All image URLs use `f_auto,q_auto,w_WIDTH` transformations
- Responsive `srcset` with `sizes` attributes on all content images
- Configuration helper in `public/js/cloudinary-config.js`

### Google Fonts
- Cormorant Garamond (300, 400, Italic)
- DM Sans (300, 400, 500)

### External Links
- **CCI Website**: https://joincci.org
- **YouTube**: https://www.youtube.com/@pst_iren
- **Instagram**: https://www.instagram.com/pst_iren/
- **X (Twitter)**: https://x.com/pst_iren
- **Spotify**: https://open.spotify.com/artist/1Ge81wiDXhRxTHVE1pdHyw
- **Substack**: https://emmanueliren.substack.com/
- **Film**: https://whataboutusmovie.com
- **Email**: hello@emmanueliren.com

---

## Security Considerations

1. **Gitignored Files**:
   - `public/js/firebase-config.js` - Contains API keys
   - `service-account.json` - Admin SDK credentials

2. **External Links**: All use `target="_blank"` with `rel="noreferrer"`

3. **Admin Access**: Protected by Firebase Auth with custom claims

---

*Last updated: 2026-05-18*
