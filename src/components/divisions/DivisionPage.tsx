import React, { useEffect, useState } from 'react';
import { Leaf, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, TreePine } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import type { ResearchCenter, Experiment, Coordinates, Division } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImageCarousel from '../home/ImageCarousel';
import { subscribeToDivision } from '../../services/firebase/divisionService';
import { subscribeToResearchCenters } from '../../services/firebase/researchCenterService';
import { subscribeToExperiments } from '../../services/firebase/experimentService';

export type DivisionStatItem = {
  value: string;
  label: string;
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

const DivisionPage: React.FC<DivisionPageProps> = ({ config }) => {
  const [selectedCenter, setSelectedCenter] = useState<ResearchCenter | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [division, setDivision] = useState<Division | null>(null);
  const [researchCenters, setResearchCenters] = useState<ResearchCenter[]>([]);
  const [centerExperiments, setCenterExperiments] = useState<Map<string, Experiment[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  
  const EXPERIMENTS_PER_PAGE = 8;

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

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            {division?.name || 'Modern Nursery Division'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {division?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-3" />
                Research Centers
              </h2>
              {selectedCenter && (
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-full mb-4 px-3 py-2 bg-gray-100 hover:bg-green-600 text-gray-700 hover:text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear Selection
                </button>
              )}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading centers...</div>
                ) : researchCenters.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No research centers available</div>
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
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">{center.name}</div>
                        <div className="text-xs text-gray-500">{center.location}</div>
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
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Center Image Box */}
                    {getCenterImage(selectedCenter) && (
                      <div className="flex-shrink-0">
                        <div className="w-full md:w-64 h-48 md:h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
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
                      <h2 className="text-3xl font-bold text-green-800 mb-4">
                        {selectedCenter.name}
                      </h2>
                      <div className="space-y-3">
                        <div 
                          onClick={() => handleLocationClick(selectedCenter.coordinates)}
                          className={`flex items-center text-gray-600 ${
                            selectedCenter.coordinates ? 'cursor-pointer hover:text-green-700 transition-colors' : ''
                          }`}
                          title={selectedCenter.coordinates ? 'Click to get directions on Google Maps' : ''}
                        >
                          <MapPin className="h-5 w-5 mr-2 text-green-600" />
                          <span className="font-medium">{selectedCenter.location}</span>
                          {selectedCenter.coordinates && (
                            <span className="ml-2 text-xs text-green-600 opacity-70">(Click for directions)</span>
                          )}
                        </div>
                        {/* Display all custom fields dynamically */}
                        {selectedCenter.customFields && selectedCenter.customFields.length > 0 ? (
                          selectedCenter.customFields.map((field) => (
                            field.label.trim() && field.value.trim() && (
                              <div key={field.id} className="flex items-center text-gray-600">
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
                              <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">Area:</span>
                                <span>{selectedCenter.area} hectares</span>
                              </div>
                            )}
                            {selectedCenter.district && (
                              <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">District:</span>
                                <span>{selectedCenter.district}</span>
                              </div>
                            )}
                            {selectedCenter.range && (
                              <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">Range:</span>
                                <span>{selectedCenter.range}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedCenter.description}
                  </p>
                </div>

                {/* Experiments Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                    <TreePine className="h-6 w-6 mr-3" />
                    Experiments
                  </h3>
                  
                  {/* Table View for All Research Centers */}
                  {selectedCenter.experiments && selectedCenter.experiments.length > 0 ? (
                    <>
                      {/* Pagination Logic */}
                      {(() => {
                        const totalPages = Math.ceil(selectedCenter.experiments.length / EXPERIMENTS_PER_PAGE);
                        const startIndex = (currentPage - 1) * EXPERIMENTS_PER_PAGE;
                        const endIndex = startIndex + EXPERIMENTS_PER_PAGE;
                        const paginatedExperiments = selectedCenter.experiments.slice(startIndex, endIndex);
                        const startItem = startIndex + 1;
                        const endItem = Math.min(endIndex, selectedCenter.experiments.length);

                        return (
                          <>
                            {/* Pagination Info */}
                            <div className="mb-4 text-sm text-gray-600">
                              Showing {startItem}-{endItem} of {selectedCenter.experiments.length} experiments
                            </div>

                            {/* Experiments List */}
                            <div className="space-y-3">
                              {paginatedExperiments.map((experiment) => (
                                <div key={experiment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                  <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                                    {/* Experiment Image or Center Image */}
                                    {getExperimentImage(experiment, selectedCenter) && (
                                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md border border-gray-200 flex-shrink-0 mr-4">
                                        <img
                                          src={getExperimentImage(experiment, selectedCenter) || ''}
                                          alt={experiment.imageUrl || experiment.imagePath ? experiment.title : selectedCenter.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    {/* Experiment Info */}
                                    <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-green-800 mb-1">
                                        {experiment.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 line-clamp-2">
                                        {experiment.description}
                                      </p>
                                    </div>
                                    {/* View PDF Button */}
                                    {(experiment.pdfUrl || experiment.pdfPath) && (
                                      <button
                                        onClick={() => handleViewPDF(experiment.pdfUrl, experiment.pdfPath)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                                      >
                                        View PDF
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                              {/* Page Info */}
                              <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                              </div>

                              {/* Pagination Buttons */}
                              <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                    currentPage === 1
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                  Previous
                                </button>

                                {/* Page Number Buttons */}
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                    // Show first page, last page, current page, and pages around current
                                    const showPage = 
                                      pageNum === 1 ||
                                      pageNum === totalPages ||
                                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                                    
                                    if (!showPage) {
                                      // Show ellipsis
                                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                      }
                                      return null;
                                    }

                                    return (
                                      <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                          currentPage === pageNum
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                      >
                                        {pageNum}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Next Button */}
                                <button
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPage === totalPages}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                    currentPage === totalPages
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
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
                    <div className="text-center py-8 text-gray-500">
                      No experiments available for this research center.
                    </div>
                  )}
                </div>

                {/* Center Contact Info and Map */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCenter.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-gray-700">{selectedCenter.phone}</span>
                        </div>
                      )}
                      {!selectedCenter.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-gray-700">{config.contactFallbacks.phone}</span>
                        </div>
                      )}
                      {selectedCenter.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-gray-700">{selectedCenter.email}</span>
                        </div>
                      )}
                      {!selectedCenter.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-green-600 mr-3" />
                          <span className="text-gray-700">
                            {selectedCenter.name.toLowerCase().replace(/\s+/g, '')}@{config.contactFallbacks.emailDomain}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map Section */}
                  {selectedCenter.coordinates && (
                    <div className="bg-white rounded-lg shadow-lg p-6 relative z-[1]">
                      <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-green-600" />
                        Location on Map
                      </h3>
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 relative h-[300px] z-[1] cursor-pointer">
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
                                <strong className="text-green-800">{selectedCenter.name}</strong>
                                <br />
                                <span className="text-sm text-gray-600">{selectedCenter.location}</span>
                                <br />
                                <span className="text-xs text-gray-500 mt-1 block">Click anywhere on the map to get directions</span>
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 text-center italic">
                        💡 Click anywhere on the map to open Google Maps with directions to this location
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              config.overview
            )}
          </div>
        </div>

        {/* Image Gallery Carousel */}
        <div className="mt-16">
          <ImageCarousel />
        </div>

        {/* Toll Free Number Box */}
        <div className="mt-16 bg-gray-100 rounded-lg shadow-lg p-8 border-2 border-gray-300">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Phone className="h-8 w-8 text-green-700" />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Toll Free Number</h3>
              <a 
                href={`tel:${division?.tollFreeNumber?.replace(/-/g, '') || config.tollFreeFallback.tel}`}
                className="text-3xl md:text-4xl font-bold text-green-700 hover:text-green-800 transition-colors"
              >
                {division?.tollFreeNumber || config.tollFreeFallback.display}
              </a>
            </div>
          </div>
        </div>

        {/* Division Statistics */}
        <div className="mt-8 bg-green-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {division?.name || 'Modern Nursery Division'} Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {config.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionPage;


