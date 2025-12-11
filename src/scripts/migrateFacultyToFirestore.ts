/**
 * Migration Script: Faculty Members to Firestore
 * 
 * This script migrates existing faculty members from in-memory storage
 * to Firestore database.
 * 
 * Run with: npx tsx src/scripts/migrateFacultyToFirestore.ts
 * Or: node --loader ts-node/esm src/scripts/migrateFacultyToFirestore.ts
 * 
 * Make sure your .env file is in the TN_Forest directory with Firebase config
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
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

// Existing faculty data from adminDataService
const existingFaculty = [
  {
    name: "Thiru R.S.Rajakannappan",
    position: "Hon'ble Minister for Forests"
  },
  {
    name: "Tmt. Supriya Sahu, IAS",
    position: "Additional Chief Secretary to Government, Environment, Climate Change and Forests Department"
  },
  {
    name: "Thiru.Srinivas R. Reddy, IFS",
    position: "Principal Chief Conservator of Forests (HoFF) & CEO, CAMPA (FAC)"
  },
  {
    name: "Thiru Rakesh Kumar Dogra, IFS",
    position: "Principal Chief Conservator of Forests and Chief Wildlife Warden & Principal Chief Conservator of Forests (Project Tiger) (FAC)"
  },
  {
    name: "Thiru I Anwardeen, IFS",
    position: "Principal Chief Conservator of Forests (Research and Education) Chennai"
  },
  {
    name: "K.Geethanjali, IFS",
    position: "Chief Conservator of Forests (Research), Chennai"
  }
];

const FACULTY_COLLECTION = 'faculty';

/**
 * Check if faculty collection already has data
 */
async function checkExistingData(): Promise<boolean> {
  try {
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const snapshot = await getDocs(facultyRef);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking existing data:', error);
    return false;
  }
}

/**
 * Migrate faculty members to Firestore
 */
async function migrateFaculty() {
  try {
    console.log('Starting faculty migration to Firestore...\n');

    // Check if data already exists
    const hasExistingData = await checkExistingData();
    if (hasExistingData) {
      console.log('⚠️  Warning: Faculty collection already contains data.');
      console.log('   This script will add duplicate entries if run again.');
      console.log('   If you want to start fresh, please clear the collection first.\n');
    }

    const facultyRef = collection(db, FACULTY_COLLECTION);
    const now = Timestamp.now();
    let successCount = 0;
    let errorCount = 0;

    console.log(`Migrating ${existingFaculty.length} faculty members...\n`);

    for (let i = 0; i < existingFaculty.length; i++) {
      const member = existingFaculty[i];
      
      try {
        const memberData = {
          name: member.name.trim(),
          position: member.position.trim(),
          order: i, // Start from 0, increment by 1
          createdAt: now,
          updatedAt: now
        };

        await addDoc(facultyRef, memberData);
        successCount++;
        console.log(`✓ [${i + 1}/${existingFaculty.length}] Added: ${member.name}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ [${i + 1}/${existingFaculty.length}] Failed to add: ${member.name}`, error);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Migration Summary:');
    console.log(`  Total: ${existingFaculty.length}`);
    console.log(`  Success: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log('='.repeat(50));

    if (errorCount === 0) {
      console.log('\n✅ Migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the output above.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateFaculty()
  .then(() => {
    console.log('\nMigration script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

