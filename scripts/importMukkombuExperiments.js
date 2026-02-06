import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to import CSV experiment data for Mukkombu Research Centre
 * into Firestore database
 */

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../public/TempExperiments/Industrial Wood Research Division-Exp - Sheet1.csv');
const DIVISION_SLUG = 'industrial-wood'; // Division slug from config
const RESEARCH_CENTER_NAME = 'Mukkombu Research Centre';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase configuration. Please check your .env file.');
  console.error('Required variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Parse CSV file and convert to experiments array
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const experiments = [];
  
  // Skip header row and process data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handling commas in quoted fields)
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Add last value
    
    // Map values to headers
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Extract data
    const name = row['Name'] || '';
    const description = row['Description'] || '';
    const yearStr = row['Year'] || '';
    const year = yearStr ? parseInt(yearStr) : null;
    
    if (!name) continue; // Skip rows without a name
    
    experiments.push({
      title: name,
      year: year, // null if empty
      description: description || undefined, // undefined if empty (not empty string)
    });
  }
  
  return experiments;
}

/**
 * Get division ID from slug
 */
async function getDivisionId(db, divisionSlug) {
  const divisionsRef = collection(db, 'divisions');
  const q = query(divisionsRef, where('slug', '==', divisionSlug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error(`Division with slug "${divisionSlug}" not found`);
  }
  
  return querySnapshot.docs[0].id;
}

/**
 * Get research center ID by name
 */
async function getCenterId(db, divisionId, centerName) {
  const centersRef = collection(db, 'divisions', divisionId, 'researchCenters');
  const q = query(centersRef, where('name', '==', centerName));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error(`Research center "${centerName}" not found in division "${divisionId}"`);
  }
  
  return querySnapshot.docs[0].id;
}

/**
 * Authenticate with Firebase
 */
async function authenticate() {
  const adminEmail = process.env.FIREBASE_ADMIN_EMAIL;
  const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    console.error('❌ Missing Firebase admin credentials.');
    console.error('Please set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD in your .env file.');
    console.error('\nAlternatively, you can use Firebase Admin SDK with a service account JSON file.');
    process.exit(1);
  }
  
  try {
    console.log('🔐 Authenticating with Firebase...');
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('✅ Authentication successful\n');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting import process...\n');
    
    // Authenticate first
    await authenticate();
    
    // Read CSV file
    console.log(`📖 Reading CSV file: ${CSV_FILE_PATH}`);
    if (!fs.existsSync(CSV_FILE_PATH)) {
      throw new Error(`CSV file not found: ${CSV_FILE_PATH}`);
    }
    const csvContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    
    // Parse CSV
    console.log('📝 Parsing CSV data...');
    const experiments = parseCSV(csvContent);
    console.log(`✅ Parsed ${experiments.length} experiments\n`);
    
    if (experiments.length === 0) {
      console.log('⚠️  No experiments found in CSV file.');
      return;
    }
    
    // Get division and center IDs
    console.log(`🔍 Finding division and research center...`);
    const divisionId = await getDivisionId(db, DIVISION_SLUG);
    console.log(`   Division ID: ${divisionId}`);
    
    const centerId = await getCenterId(db, divisionId, RESEARCH_CENTER_NAME);
    console.log(`   Center ID: ${centerId}\n`);
    
    // Import experiments to Firestore
    console.log('💾 Importing experiments to Firestore...\n');
    const experimentsRef = collection(
      db,
      'divisions',
      divisionId,
      'researchCenters',
      centerId,
      'experiments'
    );
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < experiments.length; i++) {
      const exp = experiments[i];
      try {
        // Build document data, omitting undefined fields
        const docData = {
          title: exp.title.trim(),
          year: exp.year, // null if empty
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        // Only add description if it exists (not undefined)
        if (exp.description !== undefined) {
          docData.description = exp.description;
        }
        
        const docRef = await addDoc(experimentsRef, docData);
        
        const yearDisplay = exp.year ? exp.year : 'null';
        console.log(`   ✅ [${i + 1}/${experiments.length}] "${exp.title}" (Year: ${yearDisplay}, ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`   ❌ [${i + 1}/${experiments.length}] Failed to import "${exp.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Successfully imported: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${experiments.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All experiments imported successfully!');
    } else {
      console.log('\n⚠️  Some experiments failed to import. Please check the errors above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Error during import:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();
