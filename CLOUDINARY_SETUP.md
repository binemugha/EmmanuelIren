# Cloudinary Image CDN Setup Guide

This project uses **Cloudinary** as its image CDN for automatic optimization, format conversion (WebP/AVIF), and responsive delivery.

---

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Your **cloud name** will be shown on the dashboard (e.g., `emmanueliren`)

---

## 2. Upload Your Images (Automatic)

This project includes a bulk upload script that handles everything.

### A) Set up credentials

Create `cloudinary-credentials.json` in the project root (it's gitignored):

```json
{
  "cloud_name": "your-cloud-name",
  "api_key": "your-api-key",
  "api_secret": "your-api-secret"
}
```

Find these in your [Cloudinary Dashboard](https://console.cloudinary.com/console).

### B) Run the upload script

```bash
# Preview what will be uploaded (no actual upload)
npm run upload-images -- --dry-run

# Upload all images
npm run upload-images

# Upload + automatically replace YOUR_CLOUD_NAME in all HTML/CSS files
npm run upload-images -- --update-html
```

The script will:
- Walk `public/images/` recursively
- Upload each image to the `emmanueliren/` folder in Cloudinary
- Maintain subfolder structure (`books/`, `media/`)
- Skip `logo.svg` (kept local) and hidden files

### C) Manual upload (alternative)

If you prefer, upload via the Cloudinary Media Library maintaining this structure:

```
emmanueliren/
├── hero-emmanuel.jpg
├── about-emmanuel.webp
├── books/
│   ├── love-code.jpg
│   ├── leading-seeks-you.jpg
│   ├── pray-book.jpg
│   ├── am-i-being-fooled.jpg
│   ├── saving-grace.jpg
│   └── purposefully.jpg
└── media/
    ├── spiritual-album.jpg
    └── apostolos-album.jpg
```

> **Note:** The `logo.svg` remains local in `public/images/` — SVGs are already tiny and don't benefit from image CDN optimization.

---

## 3. Replace the Placeholder (if not using --update-html)

If you didn't use `--update-html`, manually replace `YOUR_CLOUD_NAME`:

```bash
# macOS/Linux
sed -i '' 's/YOUR_CLOUD_NAME/your-actual-cloud-name/g' public/index.html public/media.html public/css/media.css public/js/cloudinary-config.js
```

---

## 4. Test Everything

1. Run `npm run dev` to start the local server
2. Open DevTools → Network tab
3. Check that images load from `res.cloudinary.com`
4. Verify `Content-Type` is `image/webp` or `image/avif` in modern browsers
5. Check that `srcset` is working: resize the browser and watch different image sizes load

---

## 5. Deploy

Once confirmed working locally:

```bash
npm run deploy
```

You can then optionally remove the local copies from `public/images/` (except `logo.svg`) to reduce repo size, though keeping them as a backup is fine.

---

## How It Works

### URL Transformations

Every image URL includes these automatic optimizations:

| Parameter | Meaning |
|-----------|---------|
| `f_auto` | Automatically serves WebP, AVIF, or JPEG based on browser support |
| `q_auto` | Automatically adjusts quality for best file-size-to-quality ratio |
| `w_NNN` | Resizes image to NNN pixels wide |

Example:
```
https://res.cloudinary.com/emmanueliren/image/upload/f_auto,q_auto,w_800/emmanueliren/hero-emmanuel.jpg
```

### Responsive `srcset`

Each image includes multiple sizes so the browser downloads only what it needs:

```html
<img
  src=".../w_1920/..."
  srcset=".../w_400/... 400w,
          .../w_800/... 800w,
          .../w_1200/... 1200w,
          .../w_1920/... 1920w"
  sizes="100vw"
  alt="...">
```

The `sizes` attribute tells the browser the display width of the image, so it can pick the optimal source from `srcset`.

---

## Free Tier Limits

Cloudinary's free tier includes:
- **25 GB** storage
- **25 GB** monthly bandwidth
- **Unlimited** image transformations

For this site's traffic level (~5 MB of images), this is more than enough.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Images not loading | Check that your cloud name is correct and images are uploaded to the right folder |
| Images loading slowly | Verify `<link rel="preconnect" href="https://res.cloudinary.com">` is in the `<head>` |
| Layout shift | Ensure `width` and `height` attributes are present or CSS aspect-ratio is set |
| Old format served | `f_auto` needs the image to exist in Cloudinary; check the Media Library |
