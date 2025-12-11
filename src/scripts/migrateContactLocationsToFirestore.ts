/**
 * Migration Script: Contact Locations to Firestore
 * 
 * This script migrates existing contact locations from in-memory storage
 * to Firestore database.
 * 
 * Run with: npx tsx src/scripts/migrateContactLocationsToFirestore.ts
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

// Existing contact location data (from ContactUs.tsx and adminDataService.ts)
const existingLocations = [
  {
    name: "Main Office Location",
    location: "Forest Department Complex Chennai, Tamil Nadu 600006, India",
    phone: "0442-27514565",
    email: "research@tnfrd.gov.in",
    showInFooter: true  // First location with showInFooter will be set
  },
  {
    name: "State Forest Research Division",
    location: "State Forest Research Institute Campus, Anna Nagar, Vandalur (via), Kolapakkam, Chennai - 600127",
    phone: "0442-275297",
    email: "dcfsfri@gmail.com",
    showInFooter: false
  },
  {
    name: "Modern Nursery Division",
    location: "Modern Nursery Division, Behind Collectorate, Dharmapuri - 636705",
    phone: "0434-2231100",
    email: "dfomndpi@gmail.com",
    showInFooter: false
  },
  {
    name: "Forest Genetics Division",
    location: "Forest Genetics Division, Bharathi Park Road, Marutham (via), Coimbatore - 600043",
    phone: "0422-2434791",
    email: "cfgeneticscbe@yahoo.in",
    showInFooter: false
  },
  {
    name: "Industrial Wood Research Division",
    location: "Industrial Wood Research Division, Kodiyalam Post Mukkombu, Trichy - 639115",
    phone: "0431-2614723",
    email: "dvfiwrdmukkombu@gmail.com",
    showInFooter: false
  },
  {
    name: "Agro Forestry Research Division",
    location: "Agro Forestry Research Division, No.2 Race Course Road, Madurai - 625002",
    phone: "0452-2531148",
    email: "afrmdu@gmail.com",
    showInFooter: false
  }
];

async function migrateContactLocations() {
  try {
    console.log('🚀 Starting contact locations migration to Firestore...\n');

    // Check if locations already exist
    const locationsRef = collection(db, 'contactLocations');
    const existingDocs = await getDocs(locationsRef);
    
    if (!existingDocs.empty) {
      console.log(`⚠️  Warning: Found ${existingDocs.size} existing contact location(s) in Firestore.`);
      console.log('   Migration will add new locations. Duplicates may be created if names match.\n');
    }

    let addedCount = 0;
    let skippedCount = 0;
    let footerLocationSet = false;

    for (let i = 0; i < existingLocations.length; i++) {
      const location = existingLocations[i];
      
      // Check if location with same name already exists
      const nameExists = existingDocs.docs.some(
        doc => doc.data().name === location.name
      );

      if (nameExists) {
        console.log(`⏭️  Skipping "${location.name}" - already exists in Firestore`);
        skippedCount++;
        continue;
      }

      // Only set the first location with showInFooter = true as footer location
      // Others will be set to false even if they had showInFooter = true
      const shouldShowInFooter = location.showInFooter && !footerLocationSet;
      if (shouldShowInFooter) {
        footerLocationSet = true;
      }

      const locationData = {
        name: location.name,
        location: location.location,
        phone: location.phone || '',
        email: location.email || '',
        showInFooter: shouldShowInFooter,
        order: i,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(locationsRef, locationData);
      console.log(`✅ Added "${location.name}"${shouldShowInFooter ? ' (set as footer location)' : ''}`);
      addedCount++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Added: ${addedCount} location(s)`);
    console.log(`   ⏭️  Skipped: ${skippedCount} location(s)`);
    console.log(`   📍 Footer location: ${footerLocationSet ? 'Set' : 'Not set'}`);
    console.log('\n✨ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    throw error;
  }
}

// Run migration
migrateContactLocations()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

