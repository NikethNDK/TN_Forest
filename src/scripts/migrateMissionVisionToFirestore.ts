/**
 * Migration Script: Mission & Vision to Firestore
 * 
 * This script migrates existing mission and vision content from in-memory storage
 * to Firestore database.
 * 
 * Run with: npx tsx src/scripts/migrateMissionVisionToFirestore.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY as string,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.VITE_FIREBASE_APP_ID as string,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Missing Firebase configuration in environment variables.');
  console.error('   Please ensure your .env file contains:');
  console.error('   - VITE_FIREBASE_API_KEY');
  console.error('   - VITE_FIREBASE_PROJECT_ID');
  console.error('   - VITE_FIREBASE_AUTH_DOMAIN');
  console.error('   - VITE_FIREBASE_STORAGE_BUCKET');
  console.error('   - VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.error('   - VITE_FIREBASE_APP_ID');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Existing mission and vision data from adminDataService
const existingMission = "To embrace the drive for innovation in soil health by developing and scaling biofertilizer solutions that improve soil fertility, ecosystem resilience, and biodiversity and producing high-quality, climate-resilient tree seedlings to support reforestation and land restoration efforts and sustainable agroforestry.";
const existingVision = "To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production and research, developing advanced microbial inoculants to enhance soil fertility and ecosystem productivity and biodiversity improvement.";

const ABOUT_COLLECTION = 'about';
const MISSION_VISION_DOC_ID = 'missionVision';

/**
 * Check if mission/vision document already exists
 */
async function checkExistingData(): Promise<boolean> {
  try {
    const docRef = doc(db, ABOUT_COLLECTION, MISSION_VISION_DOC_ID);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking existing data:', error);
    return false;
  }
}

/**
 * Migrate mission and vision to Firestore
 */
async function migrateMissionVision() {
  try {
    console.log('Starting mission & vision migration to Firestore...\n');

    // Check if data already exists
    const hasExistingData = await checkExistingData();
    if (hasExistingData) {
      console.log('⚠️  Warning: Mission/Vision document already exists.');
      console.log('   This script will overwrite existing data.\n');
    }

    const docRef = doc(db, ABOUT_COLLECTION, MISSION_VISION_DOC_ID);
    const now = Timestamp.now();

    const missionVisionData = {
      mission: existingMission,
      vision: existingVision,
      updatedAt: now
    };

    await setDoc(docRef, missionVisionData, { merge: true });

    console.log('✓ Mission migrated successfully');
    console.log('✓ Vision migrated successfully');

    console.log('\n' + '='.repeat(50));
    console.log('Migration Summary:');
    console.log('  Mission: Migrated');
    console.log('  Vision: Migrated');
    console.log('='.repeat(50));

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateMissionVision()
  .then(() => {
    console.log('\nMigration script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

