import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import { fetchAllGeneticResources, type DivisionCenterResources } from '../services/firebase/geneticResourceService';
import {
  getTypeBySlug,
  isValidTypeSlug,
  resourceMatchesType
} from '../config/geneticResourceTypes';
import { colors } from '../config/colors';

/** Filter aggregated data to divisions/centers/resources matching the given type slug */
function filterByType(
  data: DivisionCenterResources[],
  typeSlug: string
): DivisionCenterResources[] {
  return data
    .map((div) => ({
      ...div,
      centers: div.centers
        .map((center) => ({
          ...center,
          resources: center.resources.filter((r) => resourceMatchesType(r.name, typeSlug))
        }))
        .filter((center) => center.resources.length > 0)
    }))
    .filter((div) => div.centers.length > 0);
}

const GeneticResourcesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'sso';
  const typeSlug = isValidTypeSlug(typeParam) ? typeParam : 'sso';
  const typeInfo = getTypeBySlug(typeSlug);

  const [data, setData] = useState<DivisionCenterResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDivisions, setExpandedDivisions] = useState<Set<number>>(new Set([0]));

  const filtered = useMemo(() => filterByType(data, typeSlug), [data, typeSlug]);
  const useAccordion = filtered.length > 3;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchAllGeneticResources();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading genetic resources:', err);
          setError('Failed to load genetic resources. Please try again later.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (filtered.length <= 3) {
      setExpandedDivisions(new Set(filtered.map((_, i) => i)));
    } else {
      setExpandedDivisions(new Set([0]));
    }
  }, [filtered.length]);

  const toggleDivision = (index: number) => {
    if (!useAccordion) return;
    setExpandedDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-content-secondary">Loading genetic resources...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-background-paper rounded-lg shadow-lg">
            <p className="text-status-error-main">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-content-primary mb-1">
            Genetic Resources
          </h1>
          <p className="text-content-secondary">
            {typeInfo ? typeInfo.label : 'Seedling Seed Orchard (SSO)'}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-background-paper rounded-lg shadow p-8 text-center">
            <p className="text-content-secondary">No genetic resources found for this type.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((division, divIndex) => {
              const isExpanded = expandedDivisions.has(divIndex);
              const showAccordion = useAccordion;

              return (
                <div
                  key={division.divisionId}
                  className="bg-background-paper rounded-lg shadow overflow-hidden"
                >
                  {showAccordion ? (
                    <button
                      type="button"
                      onClick={() => toggleDivision(divIndex)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left font-medium transition-colors hover:bg-black/5"
                      style={{ color: colors.text.heading }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span>{division.divisionName}</span>
                    </button>
                  ) : (
                    <div
                      className="w-full flex items-center gap-2 px-4 py-3 text-left font-medium"
                      style={{ color: colors.text.heading }}
                    >
                      <span>{division.divisionName}</span>
                    </div>
                  )}
                  {(!showAccordion || isExpanded) && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                      <ul className="space-y-2 pt-3">
                        {division.centers.map((center) => (
                          <li key={center.centerId} className="space-y-1">
                            {center.resources.length === 1 ? (
                              <a
                                href={center.resources[0].pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-content-primary hover:underline"
                                style={{ color: colors.text.link }}
                              >
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <span>{center.centerName}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <div className="space-y-1">
                                <span className="font-medium text-content-secondary block">
                                  {center.centerName}
                                </span>
                                {center.resources.map((resource) => (
                                  <a
                                    key={resource.id || resource.pdfUrl}
                                    href={resource.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 pl-4 text-content-primary hover:underline"
                                    style={{ color: colors.text.link }}
                                  >
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                    <span>{resource.name || 'PDF'}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneticResourcesPage;
