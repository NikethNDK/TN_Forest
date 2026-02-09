import React, { useEffect, useState, useMemo } from 'react';
import { Leaf, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, TreePine, ExternalLink, FileText } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import type { ResearchCenter, Experiment, GeneticResource, Coordinates, Division } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImageCarousel from '../home/ImageCarousel';
import ContentModal from './ContentModal';
import { subscribeToDivision } from '../../services/firebase/divisionService';
import { subscribeToResearchCenters } from '../../services/firebase/researchCenterService';
import { subscribeToExperiments } from '../../services/firebase/experimentService';
import { subscribeToGeneticResources } from '../../services/firebase/geneticResourceService';
import { useDivisionTheme } from '../../providers/DivisionThemeProvider';

export type DivisionStatItem = {
  value: string;
  label: string;
};

export type FacilityCategory = {
  id: string;
  title: string;
  content: React.ComponentType;
};

export type DivisionPageConfig = {
  divisionSlug: string;
  overview: React.ReactNode;
  focusAreasImageSrc: string;
  stats: DivisionStatItem[];
  centerImageFallbacks: Record<string, string>;
  tollFreeFallback: {
    display: string;
    tel: string;
  };
  contactFallbacks: {
    phone: string;
    emailDomain: string;
  };
  facilityCategories?: FacilityCategory[];
};

interface DivisionPageProps {
  config: DivisionPageConfig;
}

// Fix for default marker icon in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when center changes
interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [map, center, zoom]);
  return null;
}

// Component to handle map clicks and redirect to Google Maps
interface MapClickHandlerProps {
  destinationLat: number;
  destinationLng: number;
}

function MapClickHandler({ destinationLat, destinationLng }: MapClickHandlerProps) {
  useMapEvents({
    click: () => {
      // Open Google Maps with directions to the destination
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsUrl, '_blank');
    },
  });
  return null;
}

// Component to inject facility category cards into overview
interface OverviewWithFacilitiesProps {
  overview: React.ReactNode;
  facilityCategories?: FacilityCategory[];
  onCategoryClick: (categoryId: string) => void;
  contentPalette?: import('../../config/divisionThemes').DivisionContentPalette;
}

const OverviewWithFacilities: React.FC<OverviewWithFacilitiesProps> = ({
  overview,
  facilityCategories,
  onCategoryClick,
  contentPalette: cp,
}) => {
  const processedOverview = useMemo(() => {
    if (!facilityCategories || facilityCategories.length === 0) {
      return overview;
    }

    const facilityCards = (
      <div key="facility-categories" className="mb-8 border-t border-border-light pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilityCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="bg-background-paper rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 text-left border-2 border-border-light hover:border-primary-light group"
              style={cp ? { backgroundColor: cp.bgPaper, borderColor: cp.border } : undefined}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-primary-main group-hover:text-content-headingSecondary" style={cp ? { color: cp.primary } : undefined}>
                  {category.title}
                </h3>
                <ExternalLink className="h-5 w-5 text-content-muted group-hover:text-primary-main transition-colors" style={cp ? { color: cp.textTertiary } : undefined} />
              </div>
              <p className="text-sm text-content-secondary mt-2" style={cp ? { color: cp.textSecondary } : undefined}>Click to view details</p>
            </button>
          ))}
        </div>
      </div>
    );

    // Try to inject into overview by processing React elements
    const processElement = (element: any): any => {
      if (!React.isValidElement(element)) {
        return element;
      }

      // Check if this element has the placeholder
      if (element.props?.id === 'facility-categories-placeholder') {
        return facilityCards;
      }

      // Process children recursively
      if (element.props?.children) {
        const processedChildren = React.Children.map(element.props.children, (child: any) => {
          return processElement(child);
        });

        return React.cloneElement(element, {
          children: processedChildren,
        });
      }

      return element;
    };

    return processElement(overview);
  }, [overview, facilityCategories, onCategoryClick, cp]);

  return <>{processedOverview}</>;
};

const DivisionPage: React.FC<DivisionPageProps> = ({ config }) => {
  const { theme } = useDivisionTheme();
  const cp = theme.contentPalette;
  const [selectedCenter, setSelectedCenter] = useState<ResearchCenter | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [division, setDivision] = useState<Division | null>(null);
  const [researchCenters, setResearchCenters] = useState<ResearchCenter[]>([]);
  const [centerExperiments, setCenterExperiments] = useState<Map<string, Experiment[]>>(new Map());
  const [centerGeneticResources, setCenterGeneticResources] = useState<Map<string, GeneticResource[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  
  const EXPERIMENTS_PER_PAGE = 8;

  // Get the currently open category
  const openCategory = useMemo(() => {
    if (!openCategoryId || !config.facilityCategories) return null;
    return config.facilityCategories.find(cat => cat.id === openCategoryId) || null;
  }, [openCategoryId, config.facilityCategories]);

  // Subscribe to division data
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToDivision(
      config.divisionSlug,
      (divisionData) => {
        setDivision(divisionData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading division:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [config.divisionSlug]);

  // Subscribe to research centers
  useEffect(() => {
    if (!division?.id) return;

    const divisionId = division.id.toString();
    const unsubscribe = subscribeToResearchCenters(
      divisionId,
      (centers) => {
        setResearchCenters(centers);
      },
      (error) => {
        console.error('Error loading research centers:', error);
      }
    );

    return () => unsubscribe();
  }, [division?.id]);

  // Subscribe to experiments for each center
  useEffect(() => {
    if (!division?.id || researchCenters.length === 0) return;

    const divisionId = division.id.toString();
    const unsubscribes: Array<() => void> = [];

    researchCenters.forEach((center) => {
      if (!center.id) return;
      const centerId = center.id.toString();
      
      const unsubscribe = subscribeToExperiments(
        divisionId,
        centerId,
        (experiments) => {
          setCenterExperiments(prev => {
            const newMap = new Map(prev);
            newMap.set(centerId, experiments);
            return newMap;
          });
        },
        (error) => {
          console.error(`Error loading experiments for center ${centerId}:`, error);
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [division?.id, researchCenters]);

  // Subscribe to genetic resources for each center
  useEffect(() => {
    if (!division?.id || researchCenters.length === 0) return;

    const divisionId = division.id.toString();
    const unsubscribes: Array<() => void> = [];

    researchCenters.forEach((center) => {
      if (!center.id) return;
      const centerId = center.id.toString();

      const unsubscribe = subscribeToGeneticResources(
        divisionId,
        centerId,
        (resources) => {
          setCenterGeneticResources(prev => {
            const newMap = new Map(prev);
            newMap.set(centerId, resources);
            return newMap;
          });
        },
        (error) => {
          console.error(`Error loading genetic resources for center ${centerId}:`, error);
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [division?.id, researchCenters]);

  // Update selected center with experiments when centerExperiments changes
  useEffect(() => {
    if (selectedCenter && selectedCenter.id) {
      const centerId = selectedCenter.id.toString();
      const experiments = centerExperiments.get(centerId) || [];
      const currentExperiments = selectedCenter.experiments || [];
      // Only update if experiments actually changed (compare length and IDs)
      const experimentsChanged = 
        experiments.length !== currentExperiments.length ||
        experiments.some((exp, idx) => exp.id !== currentExperiments[idx]?.id);
      
      if (experimentsChanged) {
        setSelectedCenter({ ...selectedCenter, experiments });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerExperiments]);

  // Reset to page 1 when selected center changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCenter]);

  // Map center names to their images (fallback for centers without imageUrl)
  const getCenterImage = (center: ResearchCenter): string | null => {
    // First try imageUrl from Firebase
    if (center.imageUrl) {
      return center.imageUrl;
    }
    
    // Fallback to local images
    return config.centerImageFallbacks[center.name] || null;
  };

  // Get experiment image with fallback to center image
  const getExperimentImage = (experiment: Experiment, center: ResearchCenter): string | null => {
    // If experiment has its own image, use it
    if (experiment.imageUrl) {
      return experiment.imageUrl;
    }
    // Legacy support for imagePath
    if (experiment.imagePath) {
      try {
        return new URL(experiment.imagePath, import.meta.url).href;
      } catch (error) {
        console.warn(`Failed to load experiment image: ${experiment.imagePath}`, error);
      }
    }
    // Otherwise, fall back to center image
    return getCenterImage(center);
  };

  const handleCenterSelect = (center: ResearchCenter): void => {
    setSelectedCenter(center);
  };

  const handleViewPDF = (pdfUrl?: string, pdfPath?: string): void => {
    const url = pdfUrl || pdfPath;
    if (url) {
      // If it's already a full URL, use it directly; otherwise treat as relative path
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank');
      } else {
        window.open(`/${url}`, '_blank');
      }
    }
  };

  const handleLocationClick = (coordinates?: Coordinates): void => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const wrapperStyle = cp ? {
    ['--cp-primary' as string]: cp.primary,
    ['--cp-primary-hover' as string]: cp.primaryHover,
    ['--cp-primary-light' as string]: cp.primaryLight,
    ['--cp-primary-lightest' as string]: cp.primaryLightest,
    ['--cp-heading' as string]: cp.heading,
    ['--cp-heading-secondary' as string]: cp.headingSecondary,
    ['--cp-text' as string]: cp.text,
    ['--cp-text-secondary' as string]: cp.textSecondary,
    ['--cp-text-tertiary' as string]: cp.textTertiary,
    ['--cp-border' as string]: cp.border,
    ['--cp-bg-paper' as string]: cp.bgPaper,
    ['--cp-bg-page' as string]: cp.bgPage,
    ['--cp-bg-muted' as string]: cp.bgMuted,
    ['--cp-button-bg' as string]: cp.buttonBg,
    ['--cp-button-text' as string]: cp.buttonText,
  } as React.CSSProperties : undefined;

  return (
    <div className="py-12" style={cp ? { backgroundColor: cp.bgPage } : undefined} data-division-content-palette={cp ? '1' : undefined}>
      {cp && (
        <style>{`
          [data-division-content-palette="1"] .text-content-headingSecondary,
          [data-division-content-palette="1"] .text-content-heading { color: var(--cp-heading) !important; }
          [data-division-content-palette="1"] .text-content-primary { color: var(--cp-text) !important; }
          [data-division-content-palette="1"] .text-content-secondary { color: var(--cp-text-secondary) !important; }
          [data-division-content-palette="1"] .text-content-tertiary,
          [data-division-content-palette="1"] .text-content-muted { color: var(--cp-text-tertiary) !important; }
          [data-division-content-palette="1"] .text-primary-main { color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .text-primary-dark { color: var(--cp-primary-hover) !important; }
          [data-division-content-palette="1"] .bg-primary-lighter { background-color: var(--cp-primary-light) !important; }
          [data-division-content-palette="1"] .bg-primary-lightest { background-color: var(--cp-primary-lightest) !important; }
          [data-division-content-palette="1"] .bg-background-paper { background-color: var(--cp-bg-paper) !important; }
          [data-division-content-palette="1"] .bg-background-page { background-color: var(--cp-bg-page) !important; }
          [data-division-content-palette="1"] .bg-background-muted { background-color: var(--cp-bg-muted) !important; }
          [data-division-content-palette="1"] .border-primary-light,
          [data-division-content-palette="1"] .border-border-light,
          [data-division-content-palette="1"] .border-border-default { border-color: var(--cp-border) !important; }
          [data-division-content-palette="1"] .hover\\:border-primary-light:hover,
          [data-division-content-palette="1"] .hover\\:border-primary-light:focus { border-color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .hover\\:bg-primary-lightest:hover { background-color: var(--cp-primary-lightest) !important; }
          [data-division-content-palette="1"] .hover\\:text-primary-main:hover { color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .hover\\:bg-interactive-primaryDefault:hover,
          [data-division-content-palette="1"] .bg-interactive-primaryDefault { background-color: var(--cp-button-bg) !important; }
          [data-division-content-palette="1"] .hover\\:text-interactive-primaryText:hover,
          [data-division-content-palette="1"] .text-interactive-primaryText { color: var(--cp-button-text) !important; }
          [data-division-content-palette="1"] .text-forest-olive { color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .border-primary-main { border-color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .hover\:bg-primary-main:hover { background-color: var(--cp-primary) !important; }
          [data-division-content-palette="1"] .focus\:ring-primary-main:focus { --tw-ring-color: var(--cp-primary) !important; }
        `}</style>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={wrapperStyle}>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-content-headingSecondary mb-6">
            {division?.name || 'Modern Nursery Division'}
          </h1>
          <p className="text-xl text-content-secondary max-w-3xl mx-auto leading-relaxed">
            {division?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background-paper rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-content-headingSecondary mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-3" />
                Research Centers
              </h2>
              {selectedCenter && (
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-full mb-4 px-3 py-2 bg-background-muted hover:bg-interactive-primaryDefault text-content-primary hover:text-interactive-primaryText rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear Selection
                </button>
              )}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="text-center py-4 text-content-tertiary">Loading centers...</div>
                ) : researchCenters.length === 0 ? (
                  <div className="text-center py-4 text-content-tertiary">No research centers available</div>
                ) : (
                  researchCenters.map((center) => {
                    // Add experiments to center if available
                    const centerWithExperiments = center.id 
                      ? { ...center, experiments: centerExperiments.get(center.id.toString()) || [] }
                      : center;
                    
                    return (
                      <button
                        key={center.id}
                        onClick={() => handleCenterSelect(centerWithExperiments)}
                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                          selectedCenter?.id === center.id
                            ? 'bg-primary-lighter text-content-headingSecondary border-2 border-primary-light'
                            : 'bg-background-page hover:bg-primary-lightest text-content-primary hover:text-primary-main'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">{center.name}</div>
                        <div className="text-xs text-content-tertiary">{center.location || '—'}</div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCenter ? (
              <div className="space-y-8">
                {/* Center Header */}
                <div className="bg-background-paper rounded-lg shadow-lg p-8">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Center Image Box */}
                    {getCenterImage(selectedCenter) && (
                      <div className="flex-shrink-0">
                        <div className="w-full md:w-64 h-48 md:h-64 rounded-lg overflow-hidden shadow-md border border-border-light">
                          <img
                            src={getCenterImage(selectedCenter) || ''}
                            alt={selectedCenter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Center Details */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-content-headingSecondary mb-4">
                        {selectedCenter.name}
                      </h2>
                      <div className="space-y-3">
                        {(selectedCenter.location || selectedCenter.coordinates) && (
                        <div 
                          onClick={() => handleLocationClick(selectedCenter.coordinates)}
                          className={`flex items-center text-content-secondary ${
                            selectedCenter.coordinates ? 'cursor-pointer hover:text-primary-main transition-colors' : ''
                          }`}
                          title={selectedCenter.coordinates ? 'Click to get directions on Google Maps' : ''}
                        >
                          <MapPin className="h-5 w-5 mr-2 text-primary-main" />
                          <span className="font-medium">{selectedCenter.location || 'Location not specified'}</span>
                          {selectedCenter.coordinates && (
                            <span className="ml-2 text-xs text-primary-main opacity-70">(Click for directions)</span>
                          )}
                        </div>
                        )}
                        {/* Display all custom fields dynamically */}
                        {selectedCenter.customFields && selectedCenter.customFields.length > 0 ? (
                          selectedCenter.customFields.map((field) => (
                            field.label.trim() && field.value.trim() && (
                              <div key={field.id} className="flex items-center text-content-secondary">
                                <span className="font-medium mr-2">{field.label}:</span>
                                <span>
                                  {field.label.toLowerCase() === 'area' 
                                    ? `${field.value} hectares` 
                                    : field.value}
                                </span>
                              </div>
                            )
                          ))
                        ) : (
                          // Fallback to legacy fields for backward compatibility
                          <>
                            {selectedCenter.area && (
                              <div className="flex items-center text-content-secondary">
                                <span className="font-medium mr-2">Area:</span>
                                <span>{selectedCenter.area} hectares</span>
                              </div>
                            )}
                            {selectedCenter.district && (
                              <div className="flex items-center text-content-secondary">
                                <span className="font-medium mr-2">District:</span>
                                <span>{selectedCenter.district}</span>
                              </div>
                            )}
                            {selectedCenter.range && (
                              <div className="flex items-center text-content-secondary">
                                <span className="font-medium mr-2">Range:</span>
                                <span>{selectedCenter.range}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-content-primary leading-relaxed">
                    {selectedCenter.description}
                  </p>
                </div>

                {/* Genetic Resources Section */}
                <div className="bg-background-paper rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-content-headingSecondary mb-6 flex items-center">
                    <FileText className="h-6 w-6 mr-3" />
                    Genetic Resources
                  </h3>
                  {(() => {
                    const resources = selectedCenter.id
                      ? centerGeneticResources.get(selectedCenter.id.toString()) || []
                      : [];
                    return resources.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.pdfUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={resource.pdfUrl ? 'Open PDF in new tab' : undefined}
                            className={`block border border-border-light rounded-lg p-4 transition-colors ${
                              resource.pdfUrl
                                ? 'hover:bg-background-page hover:border-primary-light cursor-pointer'
                                : 'opacity-75 cursor-not-allowed pointer-events-none'
                            }`}
                          >
                            <h4 className="text-lg font-semibold text-content-headingSecondary mb-2">
                              {resource.name}
                            </h4>
                            {resource.pdfUrl && (
                              <span className="inline-flex items-center gap-2 text-primary-main group-hover:text-primary-dark font-medium text-sm">
                                <FileText className="h-4 w-4" />
                                View PDF
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-content-tertiary text-center py-6">
                        No genetic resources for this center.
                      </p>
                    );
                  })()}
                </div>

                {/* Experiments Section - Temporarily Commented Out */}
                {/* <div className="bg-background-paper rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-content-headingSecondary mb-6 flex items-center">
                    <TreePine className="h-6 w-6 mr-3" />
                    Experiments
                  </h3>
                  
                  {/* Table View for All Research Centers */}
                  {/* {selectedCenter.experiments && selectedCenter.experiments.length > 0 ? (
                    <>
                      {/* Pagination Logic */}
                      {/* {(() => {
                        const totalPages = Math.ceil(selectedCenter.experiments.length / EXPERIMENTS_PER_PAGE);
                        const startIndex = (currentPage - 1) * EXPERIMENTS_PER_PAGE;
                        const endIndex = startIndex + EXPERIMENTS_PER_PAGE;
                        const paginatedExperiments = selectedCenter.experiments.slice(startIndex, endIndex);
                        const startItem = startIndex + 1;
                        const endItem = Math.min(endIndex, selectedCenter.experiments.length);

                        return (
                          <>
                            {/* Pagination Info */}
                            {/* <div className="mb-4 text-sm text-content-secondary">
                              Showing {startItem}-{endItem} of {selectedCenter.experiments.length} experiments
                            </div>

                            {/* Experiments List */}
                            {/* <div className="space-y-3">
                              {paginatedExperiments.map((experiment) => (
                                <div key={experiment.id} className="border border-border-light rounded-lg overflow-hidden">
                                  <div className="flex items-center p-4 hover:bg-background-page transition-colors">
                                    {/* Experiment Image or Center Image */}
                                    {/* {getExperimentImage(experiment, selectedCenter) && (
                                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md border border-border-light flex-shrink-0 mr-4">
                                        <img
                                          src={getExperimentImage(experiment, selectedCenter) || ''}
                                          alt={experiment.imageUrl || experiment.imagePath ? experiment.title : selectedCenter.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    {/* Experiment Info */}
                                    {/* <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-content-headingSecondary mb-1">
                                        {experiment.title}
                                      </h4>
                                      <p className="text-sm text-content-secondary line-clamp-2">
                                        {experiment.description}
                                      </p>
                                    </div>
                                    {/* View PDF Button */}
                                    {/* {(experiment.pdfUrl || experiment.pdfPath) && (
                                      <button
                                        onClick={() => handleViewPDF(experiment.pdfUrl, experiment.pdfPath)}
                                        className="bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                                      >
                                        View PDF
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Pagination Controls */}
                            {/* <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                              {/* Page Info */}
                              {/* <div className="text-sm text-content-secondary">
                                Page {currentPage} of {totalPages}
                              </div>

                              {/* Pagination Buttons */}
                              {/* <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                {/* <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                    currentPage === 1
                                      ? 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
                                      : 'bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText'
                                  }`}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                  Previous
                                </button>

                                {/* Page Number Buttons */}
                                {/* <div className="flex items-center gap-1">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                    // Show first page, last page, current page, and pages around current
                                    const showPage = 
                                      pageNum === 1 ||
                                      pageNum === totalPages ||
                                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                                    
                                    if (!showPage) {
                                      // Show ellipsis
                                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="px-2 text-content-muted">...</span>;
                                      }
                                      return null;
                                    }

                                    return (
                                      <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                          currentPage === pageNum
                                            ? 'bg-interactive-primaryDefault text-interactive-primaryText'
                                            : 'bg-background-muted hover:bg-border-light text-content-primary'
                                        }`}
                                      >
                                        {pageNum}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Next Button */}
                                {/* <button
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPage === totalPages}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                    currentPage === totalPages
                                      ? 'bg-interactive-disabled text-interactive-disabledText cursor-not-allowed'
                                      : 'bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText'
                                  }`}
                                >
                                  Next
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="text-center py-8 text-content-tertiary">
                      No experiments available for this research center.
                    </div>
                  )}
                </div> */}

                {/* Center Contact Info and Map */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-primary-lightest rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-content-headingSecondary mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCenter.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-primary-main mr-3" />
                          <span className="text-content-primary">{selectedCenter.phone}</span>
                        </div>
                      )}
                      {!selectedCenter.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-primary-main mr-3" />
                          <span className="text-content-primary">{config.contactFallbacks.phone}</span>
                        </div>
                      )}
                      {selectedCenter.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-primary-main mr-3" />
                          <span className="text-content-primary">{selectedCenter.email}</span>
                        </div>
                      )}
                      {!selectedCenter.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-primary-main mr-3" />
                          <span className="text-content-primary">
                            {selectedCenter.name.toLowerCase().replace(/\s+/g, '')}@{config.contactFallbacks.emailDomain}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map Section */}
                  {selectedCenter.coordinates && (
                    <div className="bg-background-paper rounded-lg shadow-lg p-6 relative z-[1]">
                      <h3 className="text-xl font-semibold text-content-headingSecondary mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary-main" />
                        Location on Map
                      </h3>
                      <div className="rounded-lg overflow-hidden shadow-md border border-border-light relative h-[300px] z-[1] cursor-pointer">
                        <MapContainer
                          key={`${selectedCenter.coordinates.lat}-${selectedCenter.coordinates.lng}`}
                          center={[selectedCenter.coordinates.lat, selectedCenter.coordinates.lng]}
                          zoom={13}
                          className="h-full w-full z-[1] cursor-pointer"
                          scrollWheelZoom={true}
                        >
                          <MapUpdater center={[selectedCenter.coordinates.lat, selectedCenter.coordinates.lng]} zoom={13} />
                          <MapClickHandler 
                            destinationLat={selectedCenter.coordinates.lat} 
                            destinationLng={selectedCenter.coordinates.lng} 
                          />
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[selectedCenter.coordinates.lat, selectedCenter.coordinates.lng]}>
                            <Popup>
                              <div className="text-center">
                                <strong className="text-content-headingSecondary">{selectedCenter.name}</strong>
                                <br />
                                <span className="text-sm text-content-secondary">{selectedCenter.location || '—'}</span>
                                <br />
                                <span className="text-xs text-content-tertiary mt-1 block">Click anywhere on the map to get directions</span>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                      <p className="text-sm text-content-secondary mt-3 text-center italic">
                        💡 Click anywhere on the map to open Google Maps with directions to this location
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <OverviewWithFacilities
                overview={config.overview}
                facilityCategories={config.facilityCategories}
                onCategoryClick={setOpenCategoryId}
                contentPalette={cp}
              />
            )}
          </div>
        </div>

        {/* Facility Category Modal */}
        {openCategory && (
          <ContentModal
            isOpen={openCategoryId !== null}
            onClose={() => setOpenCategoryId(null)}
            title={openCategory.title}
          >
            {React.createElement(openCategory.content)}
          </ContentModal>
        )}

        {/* Image Gallery Carousel */}
        <div className="mt-16">
          <ImageCarousel scope="division" divisionSlug={config.divisionSlug} />
        </div>

        {/* Toll Free Number Box */}
        <div className="mt-16 bg-background-muted rounded-lg shadow-lg p-8 border-2 border-border-default">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Phone className="h-8 w-8 text-primary-main" />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-content-primary mb-2">Toll Free Number</h3>
              <a 
                href={`tel:${division?.tollFreeNumber?.replace(/-/g, '') || config.tollFreeFallback.tel}`}
                className="text-3xl md:text-4xl font-bold text-primary-main hover:text-content-headingSecondary transition-colors"
              >
                {division?.tollFreeNumber || config.tollFreeFallback.display}
              </a>
            </div>
          </div>
        </div>

        {/* Division Statistics */}
        {/* <div className="mt-8 bg-primary-dark rounded-lg p-8">
          <h2 className="text-3xl font-bold text-content-inverse mb-8 text-center">
            {division?.name || 'Modern Nursery Division'} Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {config.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-light mb-2">{stat.value}</div>
                <div className="text-primary-lighter">{stat.label}</div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DivisionPage;


