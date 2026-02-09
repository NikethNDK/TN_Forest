/**
 * Script to test fetching seedling/seed orchard data (genetic resources)
 * for all research centers across all divisions from Firestore.
 *
 * Run from project root: node scripts/fetchAllSeedOrchardData.js
 * Requires .env with VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase config. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID in .env');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DIVISIONS = 'divisions';
const RESEARCH_CENTERS = 'researchCenters';
const GENETIC_RESOURCES = 'geneticResources';

async function fetchAllSeedOrchardData() {
  console.log('Fetching divisions...');
  const divisionsSnap = await getDocs(collection(db, DIVISIONS));
  const divisions = [];
  divisionsSnap.forEach((d) => {
    const data = d.data();
    divisions.push({ id: d.id, name: data.name || '', slug: data.slug || '' });
  });
  console.log(`Found ${divisions.length} division(s).\n`);

  const result = [];
  for (const division of divisions) {
    const centersRef = collection(db, DIVISIONS, division.id, RESEARCH_CENTERS);
    let centersSnap;
    try {
      const q = query(centersRef, orderBy('createdAt', 'desc'));
      centersSnap = await getDocs(q);
    } catch (e) {
      centersSnap = await getDocs(centersRef);
    }
    const centers = [];
    centersSnap.forEach((c) => {
      const data = c.data();
      centers.push({ id: c.id, name: data.name || '' });
    });

    for (const center of centers) {
      const resourcesRef = collection(
        db,
        DIVISIONS,
        division.id,
        RESEARCH_CENTERS,
        center.id,
        GENETIC_RESOURCES
      );
      let resourcesSnap;
      try {
        const q = query(resourcesRef, orderBy('createdAt', 'desc'));
        resourcesSnap = await getDocs(q);
      } catch (e) {
        resourcesSnap = await getDocs(resourcesRef);
      }
      const resources = [];
      resourcesSnap.forEach((r) => {
        const data = r.data();
        resources.push({ id: r.id, name: data.name || '', pdfUrl: data.pdfUrl || '' });
      });

      result.push({
        divisionName: division.name,
        divisionSlug: division.slug,
        centerName: center.name,
        centerId: center.id,
        geneticResources: resources
      });
    }
  }

  return result;
}

fetchAllSeedOrchardData()
  .then((data) => {
    console.log('--- Seed orchard / genetic resources by research center ---\n');
    let totalCenters = 0;
    let totalResources = 0;
    data.forEach(({ divisionName, centerName, geneticResources }) => {
      totalCenters += 1;
      totalResources += geneticResources.length;
      console.log(`Division: ${divisionName}`);
      console.log(`  Center: ${centerName} (${geneticResources.length} genetic resource(s))`);
      geneticResources.forEach((r) => console.log(`    - ${r.name || '(no name)'}`));
      console.log('');
    });
    console.log('--- Summary ---');
    console.log(`Total research centers: ${totalCenters}`);
    console.log(`Total genetic resources (seed orchard / seedling-related docs): ${totalResources}`);
    console.log('\n✅ Fetch is feasible. Data can be aggregated for a navbar page.');
  })
  .catch((err) => {
    console.error('❌ Fetch failed:', err.message);
    process.exit(1);
  });
