#!/usr/bin/env node
/**
 * Bulk upload images from public/images/ to Cloudinary
 *
 * Prerequisites:
 *   npm install
 *
 * Setup credentials (pick one):
 *   A) Environment variables:
 *      CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=yyy CLOUDINARY_API_SECRET=zzz npm run upload-images
 *
 *   B) Create cloudinary-credentials.json in project root:
 *      {
 *        "cloud_name": "your-cloud-name",
 *        "api_key": "your-api-key",
 *        "api_secret": "your-api-secret"
 *      }
 *
 *   C) Command line arguments:
 *      npm run upload-images -- --cloud-name xxx --api-key yyy --api-secret zzz
 *
 * Usage:
 *   npm run upload-images                  # Upload all images
 *   npm run upload-images -- --dry-run     # Preview without uploading
 *   npm run upload-images -- --update-html # Upload + replace YOUR_CLOUD_NAME in HTML/CSS
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const CREDENTIALS_PATH = path.join(__dirname, '..', 'cloudinary-credentials.json');
const CLOUD_FOLDER = 'emmanueliren';

const SKIP_FILES = new Set(['.ds_store', 'logo.svg', 'thumbs.db']);
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

// ─── Parse CLI args ──────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    dryRun: args.includes('--dry-run'),
    updateHtml: args.includes('--update-html'),
    cloudName: getFlagValue(args, '--cloud-name'),
    apiKey: getFlagValue(args, '--api-key'),
    apiSecret: getFlagValue(args, '--api-secret'),
  };
  return flags;
}

function getFlagValue(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

// ─── Load credentials ────────────────────────────────────────────────────────
function loadCredentials(flags) {
  // Priority: CLI args > env vars > credentials file
  const fromEnv = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  const fromFile = (() => {
    try {
      return require(CREDENTIALS_PATH);
    } catch {
      return {};
    }
  })();

  const credentials = {
    cloud_name: flags.cloudName || fromEnv.cloud_name || fromFile.cloud_name,
    api_key: flags.apiKey || fromEnv.api_key || fromFile.api_key,
    api_secret: flags.apiSecret || fromEnv.api_secret || fromFile.api_secret,
  };

  const missing = Object.entries(credentials)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.error('❌ Missing Cloudinary credentials:', missing.join(', '));
    console.error('\nSet them using one of these methods:\n');
    console.error('1. Environment variables:');
    console.error('   CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=yyy CLOUDINARY_API_SECRET=zzz npm run upload-images\n');
    console.error('2. Credentials file (cloudinary-credentials.json):');
    console.error('   { "cloud_name": "xxx", "api_key": "yyy", "api_secret": "zzz" }\n');
    console.error('3. Command line flags:');
    console.error('   npm run upload-images -- --cloud-name xxx --api-key yyy --api-secret zzz\n');
    process.exit(1);
  }

  return credentials;
}

// ─── Walk images directory ───────────────────────────────────────────────────
function* walkImages(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkImages(fullPath, relativePath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const lowerName = entry.name.toLowerCase();

    if (SKIP_FILES.has(lowerName)) continue;
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    // Compute Cloudinary public_id: emmanueliren/...path without extension
    const pathWithoutExt = relativePath.slice(0, -ext.length);
    const publicId = `${CLOUD_FOLDER}/${pathWithoutExt.replace(/\\/g, '/')}`;

    yield {
      localPath: fullPath,
      relativePath: relativePath.replace(/\\/g, '/'),
      publicId,
      filename: entry.name,
    };
  }
}

// ─── Upload to Cloudinary ────────────────────────────────────────────────────
async function uploadImage(cloudinary, file) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.localPath,
      {
        public_id: file.publicId,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

// ─── Update HTML/CSS files ───────────────────────────────────────────────────
function updateHtmlFiles(cloudName) {
  const publicDir = path.join(__dirname, '..', 'public');
  const filesToUpdate = [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(html|css|js)$/.test(entry.name)) {
        filesToUpdate.push(fullPath);
      }
    }
  }

  scanDir(publicDir);

  let totalReplaced = 0;

  for (const filePath of filesToUpdate) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('YOUR_CLOUD_NAME')) continue;

    const updated = content.replace(/YOUR_CLOUD_NAME/g, cloudName);
    fs.writeFileSync(filePath, updated, 'utf-8');

    const count = (content.match(/YOUR_CLOUD_NAME/g) || []).length;
    totalReplaced += count;
    console.log(`   ✏️  ${path.relative(process.cwd(), filePath)} (${count} replacements)`);
  }

  return totalReplaced;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const flags = parseArgs();
  const credentials = loadCredentials(flags);

  console.log(`☁️  Cloudinary bulk upload`);
  console.log(`   Cloud: ${credentials.cloud_name}`);
  console.log(`   Source: ${path.relative(process.cwd(), IMAGES_DIR)}`);
  console.log(`   Target folder: ${CLOUD_FOLDER}/`);
  if (flags.dryRun) console.log('   Mode: DRY RUN (no uploads)\n');
  else console.log('');

  // Lazy-require cloudinary only when needed
  const cloudinary = require('cloudinary').v2;
  cloudinary.config(credentials);

  const images = Array.from(walkImages(IMAGES_DIR));

  if (images.length === 0) {
    console.log('No images found to upload.');
    process.exit(0);
  }

  console.log(`Found ${images.length} image(s):\n`);

  let successCount = 0;
  let failCount = 0;
  const failed = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const prefix = `[${i + 1}/${images.length}]`;

    if (flags.dryRun) {
      console.log(`${prefix} ${file.relativePath} → ${file.publicId}`);
      continue;
    }

    process.stdout.write(`${prefix} Uploading ${file.filename} ... `);

    try {
      const result = await uploadImage(cloudinary, file);
      console.log(`✅ ${result.bytes} bytes`);
      successCount++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failCount++;
      failed.push(file.relativePath);
    }
  }

  console.log('');
  console.log('─'.repeat(50));
  console.log(`Upload complete: ${successCount} succeeded, ${failCount} failed`);

  if (failed.length > 0) {
    console.log('\nFailed uploads:');
    failed.forEach(f => console.log(`   - ${f}`));
  }

  // Update HTML files if requested
  if (flags.updateHtml && !flags.dryRun) {
    console.log('\n📝 Updating HTML/CSS files...');
    const replaced = updateHtmlFiles(credentials.cloud_name);
    console.log(`   Replaced YOUR_CLOUD_NAME in ${replaced} place(s)`);
  }

  // Print next steps
  if (!flags.dryRun && successCount > 0) {
    console.log('\n✨ Next steps:');
    console.log('   1. Test locally: npm run dev');
    console.log('   2. Check images load from res.cloudinary.com');
    console.log('   3. Deploy: npm run deploy');

    if (!flags.updateHtml) {
      console.log('\n   💡 Tip: Run with --update-html to auto-replace YOUR_CLOUD_NAME');
      console.log(`      npm run upload-images -- --update-html`);
    }
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
