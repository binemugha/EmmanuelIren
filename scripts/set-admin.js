#!/usr/bin/env node
/**
 * Script to set admin custom claim for a Firebase Auth user
 * 
 * Usage:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key" and download the JSON file
 * 3. Save it as `service-account.json` in the project root (it's gitignored)
 * 4. Run: node scripts/set-admin.js pastey@admin.com
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

async function setAdminClaim(email) {
  try {
    // Initialize admin SDK
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Successfully set admin claim for: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Custom claims:`, await admin.auth().getUser(user.uid).then(u => u.customClaims));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error(`\nUser "${email}" not found. You need to:`);
      console.error('1. Go to Firebase Console → Authentication');
      console.error('2. Click "Add user" and create the user with email/password');
      console.error('3. Then run this script again');
    }
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\nService account key not found. You need to:');
      console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.error('2. Click "Generate new private key" and download the JSON file');
      console.error('3. Save it as "service-account.json" in the project root');
    }
    
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <email>');
  console.error('Example: node scripts/set-admin.js pastey@admin.com');
  process.exit(1);
}

setAdminClaim(email);
