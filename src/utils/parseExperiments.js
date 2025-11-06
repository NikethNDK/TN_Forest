// Utility to parse experiments from the public/experiments folder structure
// This will be used to generate experiment data

// Center ID mapping based on folder numbers
const centerMapping = {
  1: 1, // Thoppur Modern Nursery Centre
  2: 2, // Harur Modern Nursery Centre
  3: 3, // Kalamavoor Modern Nursery Centre
  4: 4, // Valkaradu Modern Nursery Centre
  5: 5, // Alwarmalai Modern Nursery Centre
  6: 6, // Edaikkal Research Centre
  7: 7, // Melchengam Research Centre
  8: 8, // Jamunamarathur Research Centre
  9: 9, // Kathiripuram Research Centre
  10: 10, // Maragatta Research Centre
};

/**
 * Parse filename to extract experiment data
 * Format: YYYY-YY-Title (Center Name).pdf
 * Example: 2005-06-Suitable feed (Thoppur MNC).pdf
 */
export function parseExperimentFromFilename(filename, centerId) {
  // Remove .pdf extension
  const nameWithoutExt = filename.replace(/\.pdf$/i, '');
  
  // Extract year range (format: YYYY-YY)
  const yearMatch = nameWithoutExt.match(/^(\d{4}-\d{2})-/);
  const yearRange = yearMatch ? yearMatch[1] : null;
  const startYear = yearRange ? parseInt(yearRange.split('-')[0]) : null;
  
  // Extract title (everything after year- and before (Center Name))
  const titleMatch = nameWithoutExt.match(/^\d{4}-\d{2}-(.+?)\s*\(/);
  let title = titleMatch ? titleMatch[1].trim() : nameWithoutExt;
  
  // Clean up title - remove year prefix if still present
  title = title.replace(/^\d{4}-\d{2}-/, '').trim();
  
  // Generate a short description from title (first 2 lines worth)
  const description = generateDescriptionFromTitle(title);
  
  return {
    title: title || 'Untitled Experiment',
    year: startYear,
    yearRange: yearRange,
    pdfPath: filename,
    description: description,
  };
}

/**
 * Generate a brief description from the title
 */
function generateDescriptionFromTitle(title) {
  // Convert title case to sentence case and add context
  const words = title.split(' ');
  if (words.length <= 3) {
    return `Research study on ${title.toLowerCase()}.`;
  }
  return `Research experiment focusing on ${title.toLowerCase()}.`;
}

/**
 * Get all experiments for a center
 * This will be populated with actual data from the folder structure
 */
export function getExperimentsForCenter(centerId) {
  // This will be replaced with actual file system reading or static data
  // For now, return empty array - data will be loaded from mockData.js
  return [];
}

