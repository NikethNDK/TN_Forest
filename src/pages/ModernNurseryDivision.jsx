import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, ArrowRight, TreePine, Users, Award, ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, TrendingUp } from 'lucide-react';
import { divisions } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when center changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [map, center, zoom]);
  return null;
}

// Component to handle map clicks and redirect to Google Maps
function MapClickHandler({ destinationLat, destinationLng }) {
  useMapEvents({
    click: () => {
      // Open Google Maps with directions to the destination
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsUrl, '_blank');
    },
  });
  return null;
}

// Import research center images
import ThoppurImage from '../assets/Thoppur.jpeg';
import HarurMNCImage from '../assets/Harur MNC.jpeg';
import KalamavoorImage from '../assets/Kalamavoor.jpeg';
import ValkaraduImage from '../assets/Valkaradu.jpeg';
import AlwarmalaiImage from '../assets/Alwarmalai.jpeg';
import EdaikkalImage from '../assets/Edaikkal.jpeg';
import KathiripuramImage from '../assets/Kathiripuram.jpeg';
import MelchengamImage from '../assets/Melchengam.jpeg';
import JamunamarathurImage from '../assets/Jamunamarathur.jpeg';
import MaragattaImage from '../assets/Maragatta.jpeg';

const ModernNurseryDivision = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const modernNurseryDivision = divisions.find(div => div.slug === 'modern-nursery');

  // Map center names to their images
  const getCenterImage = (centerName) => {
    const imageMap = {
      'Thoppur Modern Nursery Centre': ThoppurImage,
      'Harur Modern Nursery Centre': HarurMNCImage,
      'Kalamavoor Modern Nursery Centre': KalamavoorImage,
      'Valkaradu Modern Nursery Centre': ValkaraduImage,
      'Alwarmalai Modern Nursery Centre': AlwarmalaiImage,
      'Edaikkal Research Centre': EdaikkalImage,
      'Kathiripuram Research Centre': KathiripuramImage,
      'Melchengam Research Centre': MelchengamImage,
      'Jamunamarathur Research Centre': JamunamarathurImage,
      'Maragatta Research Centre': MaragattaImage,
    };
    return imageMap[centerName] || null;
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
  };

  const handleViewPDF = (pdfPath) => {
    window.open(`/${pdfPath}`, '_blank');
  };

  const handleLocationClick = (coordinates) => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <>
      <style>{`
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 2 !important;
        }
        .leaflet-popup {
          z-index: 3 !important;
        }
      `}</style>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Modern Nursery Division
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {modernNurseryDivision?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
                <Leaf className="h-6 w-6 mr-3" />
                Research Centers
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {modernNurseryDivision?.researchCenters?.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => handleCenterSelect(center)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedCenter?.id === center.id
                        ? 'bg-forest-green-100 text-forest-green-800 border-2 border-forest-green-300'
                        : 'bg-gray-50 hover:bg-forest-green-50 text-gray-700 hover:text-forest-green-700'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{center.name}</div>
                    <div className="text-xs text-gray-500">{center.location}</div>
                  </button>
                ))}
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
                    {getCenterImage(selectedCenter.name) && (
                      <div className="flex-shrink-0">
                        <div className="w-full md:w-64 h-48 md:h-64 rounded-lg overflow-hidden shadow-md border border-gray-200">
                          <img
                            src={getCenterImage(selectedCenter.name)}
                            alt={selectedCenter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Center Details */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
                        {selectedCenter.name}
                      </h2>
                      <div className="space-y-3">
                        <div 
                          onClick={() => handleLocationClick(selectedCenter.coordinates)}
                          className={`flex items-center text-gray-600 ${
                            selectedCenter.coordinates ? 'cursor-pointer hover:text-forest-green-700 transition-colors' : ''
                          }`}
                          title={selectedCenter.coordinates ? 'Click to get directions on Google Maps' : ''}
                        >
                          <MapPin className="h-5 w-5 mr-2 text-forest-green-600" />
                          <span className="font-medium">{selectedCenter.location}</span>
                          {selectedCenter.coordinates && (
                            <span className="ml-2 text-xs text-forest-green-600 opacity-70">(Click for directions)</span>
                          )}
                        </div>
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
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedCenter.description}
                  </p>
                </div>

                {/* Experiments Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
                    <TreePine className="h-6 w-6 mr-3" />
                    Experiments
                  </h3>
                  
                  {/* Table View for All Research Centers */}
                  {selectedCenter.experiments && (
                    <div className="space-y-3">
                      {selectedCenter.experiments.map((experiment) => (
                        <div key={experiment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                            {/* Center Image */}
                            {getCenterImage(selectedCenter.name) && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md border border-gray-200 flex-shrink-0 mr-4">
                                <img
                                  src={getCenterImage(selectedCenter.name)}
                                  alt={selectedCenter.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {/* Experiment Info */}
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-forest-green-800 mb-1">
                                {experiment.title}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {experiment.description}
                              </p>
                            </div>
                            {/* View PDF Button */}
                            <button
                              onClick={() => handleViewPDF(experiment.pdfPath)}
                              className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                            >
                              View PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Center Contact Info and Map */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-forest-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-forest-green-800 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-forest-green-600 mr-3" />
                        <span className="text-gray-700">+91 44 1234 5681</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-forest-green-600 mr-3" />
                        <span className="text-gray-700">{selectedCenter.name.toLowerCase().replace(/\s+/g, '')}@tnfrd.gov.in</span>
                      </div>
                    </div>
                  </div>

                  {/* Map Section */}
                  {selectedCenter.coordinates && (
                    <div className="bg-white rounded-lg shadow-lg p-6 relative" style={{ zIndex: 1 }}>
                      <h3 className="text-xl font-semibold text-forest-green-800 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-forest-green-600" />
                        Location on Map
                      </h3>
                      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 relative" style={{ height: '300px', zIndex: 1, cursor: 'pointer' }}>
                        <MapContainer
                          key={`${selectedCenter.coordinates.lat}-${selectedCenter.coordinates.lng}`}
                          center={[selectedCenter.coordinates.lat, selectedCenter.coordinates.lng]}
                          zoom={13}
                          style={{ height: '100%', width: '100%', zIndex: 1, cursor: 'pointer' }}
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
                                <strong className="text-forest-green-800">{selectedCenter.name}</strong>
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
              <div className="space-y-8">
                {/* MODERN NURSERY DIVISION AT A GLANCE */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  {/* <h2 className="text-3xl font-bold text-forest-green-800 mb-6 flex items-center">
                    <Leaf className="h-8 w-8 mr-3" />
                    MODERN NURSERY DIVISION AT A GLANCE
                  </h2> */}

                  {/* Introduction Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      Historical Background
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        Under the <strong>Tamil Nadu Agricultural Development Programme (T.N.A.D.P)</strong>, two Seed Technology Divisions were established, with headquarters in Trichy and Dharmapuri, along with a Transfer Technology Division based in Trichy. The primary objective of the Seed Technology Division was to enhance the quality and availability of seedlings, facilitate the mass production and distribution of Tamarind grafts, and establish various seed-related facilities, including clonal orchards and designated seed production areas.
                      </p>
                      <p className="text-justify">
                        This initiative aimed to support local farmers by improving access to high-quality planting materials, thereby aiding in betterment of agricultural practices and higher crop yields.
                      </p>
                      <p className="text-justify">
                        Parallelly, the Transfer Technology Division was dedicated to educating farmers about innovative forestry technologies. This involved organizing workshops, field demonstrations, and training sessions to ensure that farmers were well-informed about the latest advancements in tree cultivation.
                      </p>
                    </div>
                  </div>

                  {/* Formation Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      Formation of Modern Nursery Division
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        Following the closure of the Tamil Nadu Agricultural Development Programme scheme on <strong>March 30, 1998</strong>, effective <strong>April 1, 1999</strong>, several centers across diverse agro-climatic zones were brought under a new entity known as the <strong>Modern Nursery Division</strong> (for short hereinafter Division), headquartered in Dharmapuri. This was formalized by <strong>G.O.M.S.No.54</strong> issued by the Environment and Forests Department on <strong>February 26, 1999</strong>.
                      </p>
                      <p className="text-justify">
                        Importantly, this restructuring did not create any new positions; instead, personnel were redeployed from existing Divisions and Circles. This ensured continuity in operations while optimizing resource allocation to meet the evolving needs.
                      </p>
                      <p className="text-justify">
                        The formation of the Division marked a significant step towards improving the infrastructure for quality seedling production and distribution in Tamil Nadu. By focusing on modern nursery practices, the Division aims to enhance the quality of planting material available to the stake holders. Furthermore, it marked a significant milestone in the Tamil Nadu Forest Department in the areas of research and production of Biofertilizers. Under a single Division it facilitated a more cohesive approach to research, development, production and technology transfer, ultimately benefiting the forest department, line departments and agricultural community at large.
                      </p>
                    </div>
                  </div>

                  {/* Administrative History Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      Administrative History
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        Initially the division was established in 1999 under the supervision of the <strong>Research Circle, Chennai</strong>. In line with <strong>G.O.(Ms) No.149</strong> of the Environment and Forest (FR. Spl.B) Department, dated <strong>November 14, 2011</strong>, the division was brought under the administrative control the <strong>Genetics Circle in Coimbatore</strong>, and later on again brought and continue to function under the control of <strong>Research circle, Chennai</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Mission and Bio-fertilizers Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      Mission and Bio-fertilizers Production
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        The division's primary mission is to produce and supply high-quality vermicompost, <strong>Vesicular Arbuscular Mycorrhizae (VAM)</strong>, and various bio-fertilizers, including <strong>Azospirillum</strong> and <strong>Phosphobacteria</strong>. A significant milestone was reached in <strong>2000</strong> with the inauguration of a state-of-the-art laboratory, which has been crucial for the continuous production and supply of essential nitrogen-fixing bacteria like Azospirillum, phosphate-solubilizing bacteria such as Phosphobacteria, as well as root-rot suppressing agents like <strong>Pseudomonas sp.</strong> and the fungus <strong>Trichoderma viride</strong>.
                      </p>
                    </div>
                  </div>

                  {/* ISO Certification Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      ISO Certification
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        To further our commitment to quality, the Bio-Fertilizers Research and Production Unit received <strong>ISO certification in July 2013</strong>, affirming our adherence to rigorous standards. This certification applies to the laboratory and production facilities for VAM and vermicompost across five Modern Nursery Centres: <strong>Thoppur, Harur, Kalamavoor, Valkaradu, and Alwarmalai</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Forest Tree Seed Centre Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4 text-center">
                      Forest Tree Seed Centre
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p className="text-justify">
                        Additionally, a <strong>Forest Tree Seed Centre</strong> was established at <strong>M.R.Palayam</strong> to ensure availability of forest tree seeds for current and future needs. This initiative aims to provide high-quality, purified seeds to the Forest Department, as well as to farmers, industries, sister departments, and other stakeholders.
                      </p>
                      <p className="text-justify">
                        The formation of this seed centre was announced by the <strong>Honorable Chief Minister of Tamil Nadu</strong> on <strong>August 11, 2016</strong>, during a session of the Tamil Nadu State Assembly. Following this, <strong>G.O. No. 97</strong> was issued by the Environment and Forests (FRIV) Department on <strong>April 20, 2017</strong>, formalizing the establishment.
                      </p>
                    </div>
                  </div>

                  {/* Quick Access to Research Centers
                  <div className="border-t border-gray-200 pt-8 mt-8">
                    <h3 className="text-xl font-semibold text-forest-green-800 mb-4">
                      Explore Our Research Centers
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Select a research center from the sidebar to view detailed information, current projects, and completed research.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modernNurseryDivision?.researchCenters?.map((center) => (
                        <div key={center.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => handleCenterSelect(center)}>
                          <h4 className="font-semibold text-forest-green-800 mb-2 text-sm">{center.name}</h4>
                          <p className="text-xs text-gray-600 mb-3">{center.location}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCenterSelect(center);
                            }}
                            className="text-forest-green-600 hover:text-forest-green-700 font-medium text-xs flex items-center"
                          >
                            View Details
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Division Statistics */}
        <div className="mt-16 bg-forest-green-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Modern Nursery Division Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">10</div>
              <div className="text-green-100">Research Centers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">15+</div>
              <div className="text-green-100">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">50+</div>
              <div className="text-green-100">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">1000+</div>
              <div className="text-green-100">Saplings Produced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ModernNurseryDivision;
