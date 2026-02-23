/**
 * Genetic resource type mapping for navbar and filtering.
 * Resource names in Firestore may have typos/variants; we match case-insensitively.
 */

export const GENETIC_RESOURCE_TYPES = [
  { slug: 'spa', label: 'SPA (Seed Production Area)', matchNames: ['seed production area'] },
  { slug: 'ss', label: 'SS (Seed Stand)', matchNames: ['seed stand'] },
  { slug: 'sso', label: 'SSO (Seedling Seed Orchard)', matchNames: ['seedling seed orchard'] },
  { slug: 'cso', label: 'CSO (Clonal Seed Orchard)', matchNames: ['clonal seed orchard'] },
  { slug: 'pt', label: 'PT (Progeny Trial)', matchNames: ['progeny trial', 'porgeny trial'] },
  { slug: 'gb', label: 'GB (Germplasm Bank)', matchNames: ['germplasm bank'] },
  { slug: 'cb', label: 'CB (Clonal Bank)', matchNames: ['clonal bank'] },
] as const;

export type GeneticResourceTypeSlug = (typeof GENETIC_RESOURCE_TYPES)[number]['slug'];

const VALID_SLUGS: GeneticResourceTypeSlug[] = ['spa', 'ss', 'sso', 'cso', 'pt', 'gb', 'cb'];

export function getTypeBySlug(slug: string): (typeof GENETIC_RESOURCE_TYPES)[number] | undefined {
  return GENETIC_RESOURCE_TYPES.find((t) => t.slug === slug);
}

export function isValidTypeSlug(slug: string): slug is GeneticResourceTypeSlug {
  return VALID_SLUGS.includes(slug as GeneticResourceTypeSlug);
}

/** Normalize resource name for matching (lowercase, trim) */
function normalizedName(name: string): string {
  return (name || '').trim().toLowerCase();
}

/** Check if a genetic resource's name matches the given type slug */
export function resourceMatchesType(resourceName: string, typeSlug: string): boolean {
  const type = getTypeBySlug(typeSlug);
  if (!type) return false;
  const norm = normalizedName(resourceName);
  return type.matchNames.some((m) => norm === m.trim().toLowerCase() || norm.includes(m.trim().toLowerCase()));
}
