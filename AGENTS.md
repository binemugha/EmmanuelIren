# AGENTS.md — Emmanuel Iren Portfolio

This document provides essential information for AI coding agents working on this project.

---

## Project Overview

This is a **single-page portfolio website** for Emmanuel Iren, a Nigerian pastor, author, and communicator who leads Celebration Church International (CCI). The site serves as a central hub showcasing his ministry work, media channels, books, and speaking engagements.

### Key Facts
- **Project Type**: Single-page static website (HTML, CSS, vanilla JavaScript)
- **Hosting Platform**: Firebase Hosting
- **Live Domain**: Deployed to Firebase project `pasteyemmanueliren`
- **Primary Purpose**: Portfolio and contact gateway for speaking requests

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla HTML5, CSS3, ES6+ JavaScript |
| Styling | Custom CSS with CSS variables, no frameworks |
| Fonts | Google Fonts (Inter, Playfair Display) |
| Animation | CSS animations + Intersection Observer API |
| Build Tool | None (static files served directly) |
| Hosting | Firebase Hosting |
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
├── scripts/
│   └── set-admin.js       # Script to set admin custom claims
└── public/                # Static site content (deployed to hosting)
    ├── index.html         # Single-page website with all sections
    ├── admin.html         # Admin panel login/dashboard
    ├── css/
    │   ├── main.css       # Shared styles, nav, footer, components
    │   ├── home.css       # Hero and About section styles
    │   ├── books.css      # Books showcase and featured book styles
    │   ├── media.css      # Media hero, video, podcast styles
    │   └── speaking.css   # Speaking topics, events, testimonials, and booking form styles
    └── js/
        ├── main.js        # Shared JS (nav, animations, utilities)
        ├── books.js       # Books section scroll animations
        ├── media.js       # Media section video background and parallax
        ├── speaking.js    # Speaking booking form with Firebase
        ├── contact.js     # Contact form with Firebase
        ├── firebase-init.js      # Firebase SDK initialization
        └── firebase-config.js    # Firebase config (gitignored)
```

### Page Structure

| Section | Anchor | Description |
|---------|--------|-------------|
| Home | `#home` | Hero with background image, promo card, CTA buttons |
| About | `#about` | Bio, ministry pillars, description |
| Books | `#books` | Book showcase grid, featured book highlight |
| Media | `#media` | Video background hero, featured sermon, podcast platforms |
| Speaking | `#speaking` | Speaking topics, event types, testimonials |
| Contact | `#contact` | Booking form for speaking requests |
| Admin | `/admin` | Login dashboard for managing contact requests |

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
- Transform: translateY(-8px)
- Box shadow increase
- Top border accent color reveal
- Icon background/color change

### Image Reveal
Images with `.image-reveal` have a wipe effect:
- Color overlay slides away
- Image scales down from 1.2x to 1x

### Navigation
- Fixed position with scroll-triggered background change
- Backdrop blur when scrolled
- Mobile slide-out menu

### Counter Animation
Stat numbers animate counting up when in view (home page)

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

---

## Firebase Configuration

### Hosting (firebase.json)
- **Public directory**: `public/`
- **Clean URLs**: Enabled (removes `.html` extensions)
- **Cache Headers**: CSS/JS (1 year), Images (7 days)

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
- Buttons (primary, outline, text variants)
- Navigation (fixed, scrolled state, mobile)
- Footer (grid layout, social links)
- Cards (hover effects, icon animations)
- Media cards (image zoom, content layout)
- Animations (fadeUp, reveal, stagger, image reveal)

### Section CSS
Each section has specific styles in its dedicated CSS file:
- Section header variations
- Section-specific layouts
- Grid arrangements
- Form styling

All CSS files are loaded on the single page.

---

## JavaScript Architecture

### Main.js (Shared)
- Navigation scroll effect
- Mobile menu toggle
- Scroll reveal observer
- Stagger children observer
- Image reveal observer
- Dynamic year in footer
- Smooth scroll for anchors
- Button ripple effect

### Section Scripts
All scripts are loaded on the single page and initialize their features only when relevant elements exist in the DOM:
- **books.js**: Books section scroll reveal animations
- **media.js**: Media section video background, parallax, and audio wave effects
- **speaking.js**: Speaking booking form submission to Firestore
- **contact.js**: Contact form submission to Firestore

### Firebase
- **firebase-init.js**: Initializes Firebase App, Auth, Firestore, Storage
- **firebase-config.js**: Config object (gitignored)

---

## External Resources

### Google Fonts
- Inter (400, 500, 600)
- Playfair Display (600, 700)

### External Links
- **CCI Website**: https://joincci.org
- **YouTube**: https://www.youtube.com/@pst_iren
- **Instagram**: https://www.instagram.com/pst_iren/
- **X (Twitter)**: https://x.com/pst_iren
- **Spotify**: https://open.spotify.com/artist/1Ge81wiDXhRxTHVE1pdHyw
- **Bookstore**: https://flutterwave.com/store/emmanuelirenbooks
- **Substack**: https://emmanueliren.substack.com/
- **Email**: hello@emmanueliren.com

---

## Security Considerations

1. **Gitignored Files**:
   - `public/js/firebase-config.js` - Contains API keys
   - `service-account.json` - Admin SDK credentials

2. **External Links**: All use `target="_blank"` with `rel="noreferrer"`

3. **Admin Access**: Protected by Firebase Auth with custom claims

---

*Last updated: 2026-05-09*
