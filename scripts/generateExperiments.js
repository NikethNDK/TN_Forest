import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const experiments = {};
const expDir = path.join(__dirname, '../public/experiments');

// Get all center directories
const dirs = fs.readdirSync(expDir).filter(d => d.includes('Website'));

dirs.forEach(dir => {
  const match = dir.match(/^(\d+)\./);
  if (match) {
    const centerNum = parseInt(match[1]);
    const expPath = path.join(expDir, dir, '2. Experiments');
    
    if (fs.existsSync(expPath)) {
      const years = fs.readdirSync(expPath);
      const exps = [];
      
      years.forEach(year => {
        const yearPath = path.join(expPath, year);
        if (fs.statSync(yearPath).isDirectory()) {
          const pdfs = fs.readdirSync(yearPath).filter(f => f.endsWith('.pdf'));
          
          pdfs.forEach((pdf, index) => {
            const name = pdf.replace(/\.pdf$/i, '');
            
            // Extract year
            const yearMatch = name.match(/^(\d{4})-(\d{2})/);
            const startYear = yearMatch ? parseInt(yearMatch[1]) : null;
            
            // Extract title - handle different formats
            let title = name;
            
            // Format 1: YYYY-YY-Title (Center Name).pdf
            const titleMatch1 = name.match(/^\d{4}-\d{2}-(.+?)\s*\(/);
            if (titleMatch1) {
              title = titleMatch1[1].trim();
            } else {
              // Format 2: Number YYYY-YY - Title - Center.pdf
              const titleMatch2 = name.match(/^\d+\s+\d{4}-\d{2}\s+-\s+(.+?)\s+-\s+/);
              if (titleMatch2) {
                title = titleMatch2[1].trim();
              } else {
                // Format 3: Just remove year prefix and center name
                title = name.replace(/^\d+\s*\d{4}-\d{2}\s*-?\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').replace(/\s*-\s*[^-]+$/, '').trim();
              }
            }
            
            // Generate relative path
            const relPath = path.join('experiments', dir, '2. Experiments', year, pdf).replace(/\\/g, '/');
            
            // Generate description
            const description = `Research study on ${title.toLowerCase()}.`;
            
            exps.push({
              id: exps.length + 1,
              title: title || 'Untitled Experiment',
              year: startYear,
              pdfPath: relPath,
              description: description,
            });
          });
        }
      });
      
      // Sort by year (newest first)
      exps.sort((a, b) => (b.year || 0) - (a.year || 0));
      experiments[centerNum] = exps;
    }
  }
});

// Write to a JSON file
const outputPath = path.join(__dirname, '../src/data/experimentsData.json');
fs.writeFileSync(outputPath, JSON.stringify(experiments, null, 2));
console.log(`Generated experiments data for ${Object.keys(experiments).length} centers`);
console.log(`Output written to: ${outputPath}`);

