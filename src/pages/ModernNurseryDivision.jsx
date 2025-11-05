import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, ArrowRight, TreePine, Users, Award, ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, TrendingUp } from 'lucide-react';
import { divisions } from '../data/mockData';

const ModernNurseryDivision = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const modernNurseryDivision = divisions.find(div => div.slug === 'modern-nursery');

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setExpandedProject(null); // Reset accordion when switching centers
    setCarouselIndex(0); // Reset carousel
    setActiveTab('all'); // Reset tabs
    // Initialize expanded categories for center 5
    if (center.id === 5 && center.projects) {
      const categories = [...new Set(center.projects.map(p => p.category || 'Uncategorized'))];
      setExpandedCategories(categories);
    } else {
      setExpandedCategories([]);
    }
  };

  const toggleProjectDetails = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const nextCarousel = () => {
    if (selectedCenter?.projects) {
      setCarouselIndex((prev) => (prev + 1) % selectedCenter.projects.length);
    }
  };

  const prevCarousel = () => {
    if (selectedCenter?.projects) {
      setCarouselIndex((prev) => (prev - 1 + selectedCenter.projects.length) % selectedCenter.projects.length);
    }
  };

  return (
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
                  <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
                    {selectedCenter.name}
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 text-forest-green-600" />
                      <span className="font-medium">{selectedCenter.location}</span>
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
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedCenter.description}
                  </p>
                </div>

                {/* Projects Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
                    <TreePine className="h-6 w-6 mr-3" />
                    Current Projects
                  </h3>
                  
                  {/* Table View for First Center (Thoppur) */}
                  {selectedCenter.id === 1 && selectedCenter.projects && (
                    <div className="space-y-3">
                      {selectedCenter.projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                            {/* Image Placeholder */}
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                              <TreePine className="h-8 w-8 text-gray-400" />
                            </div>
                            {/* Project Name */}
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-forest-green-800">
                                {project.title}
                              </h4>
                            </div>
                            {/* View Details Button */}
                            <button
                              onClick={() => toggleProjectDetails(project.id)}
                              className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                            >
                              View Details
                            </button>
                          </div>
                          {/* Accordion Content */}
                          {expandedProject === project.id && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-gray-700">Authors: </span>
                                  <span className="text-gray-600">{project.authors}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Status: </span>
                                  <span className="text-gray-600">{project.status}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Start Date: </span>
                                  <span className="text-gray-600">{project.startDate}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Description: </span>
                                  <span className="text-gray-600">{project.description}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grid View for Second Center (Harur) */}
                  {selectedCenter.id === 2 && selectedCenter.projects && (
                    <div className="space-y-6">
                      {/* Render projects in rows of 3 */}
                      {Array.from({ length: Math.ceil(selectedCenter.projects.length / 3) }, (_, rowIndex) => {
                        const startIdx = rowIndex * 3;
                        const endIdx = startIdx + 3;
                        const rowProjects = selectedCenter.projects.slice(startIdx, endIdx);
                        const hasExpandedInRow = rowProjects.some(p => expandedProject === p.id);
                        const expandedProjectInRow = rowProjects.find(p => expandedProject === p.id);
                        
                        return (
                          <React.Fragment key={rowIndex}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {rowProjects.map((project) => {
                                const isExpanded = expandedProject === project.id;
                                return (
                                  <div 
                                    key={project.id}
                                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                      isExpanded 
                                        ? 'border-forest-green-500 shadow-lg' 
                                        : 'border-gray-200 hover:shadow-lg'
                                    }`}
                                    onClick={() => toggleProjectDetails(project.id)}
                                  >
                                    {/* Image Placeholder */}
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                      <TreePine className="h-16 w-16 text-gray-400" />
                                    </div>
                                    {/* Project Name */}
                                    <div className="p-4">
                                      <h4 className="text-base font-semibold text-forest-green-800 text-center">
                                        {project.title}
                                      </h4>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Accordion Content - appears right below the row with the expanded project */}
                            {hasExpandedInRow && expandedProjectInRow && (
                              <div className="border border-gray-200 rounded-lg bg-gray-50 p-6">
                                <div className="space-y-3">
                                  <h4 className="text-xl font-bold text-forest-green-800 mb-4">
                                    {expandedProjectInRow.title}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <span className="font-semibold text-gray-700">Authors: </span>
                                      <span className="text-gray-600">{expandedProjectInRow.authors}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-700">Status: </span>
                                      <span className="text-gray-600">{expandedProjectInRow.status}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-700">Start Date: </span>
                                      <span className="text-gray-600">{expandedProjectInRow.startDate}</span>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="font-semibold text-gray-700">Description: </span>
                                      <span className="text-gray-600">{expandedProjectInRow.description}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}

                  {/* Style 3: Card with Side Details (Center 3 - Kalamavoor) */}
                  {selectedCenter.id === 3 && selectedCenter.projects && (
                    <div className="space-y-4">
                      {selectedCenter.projects.map((project) => {
                        const isExpanded = expandedProject === project.id;
                        return (
                          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                            <div className="flex">
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-forest-green-800 mb-2">
                                      {project.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm">{project.description}</p>
                                  </div>
                                  <button
                                    onClick={() => toggleProjectDetails(project.id)}
                                    className="ml-4 bg-forest-green-600 hover:bg-forest-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                                  >
                                    {isExpanded ? 'Hide' : 'View'} Details
                                  </button>
                                </div>
                              </div>
                              {isExpanded && (
                                <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
                                  <div className="space-y-2">
                                    <div><span className="font-semibold text-gray-700">Authors: </span><span className="text-gray-600 text-sm">{project.authors}</span></div>
                                    <div><span className="font-semibold text-gray-700">Status: </span><span className="text-gray-600 text-sm">{project.status}</span></div>
                                    <div><span className="font-semibold text-gray-700">Start Date: </span><span className="text-gray-600 text-sm">{project.startDate}</span></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Style 4: Timeline/Chronological View (Center 4 - Valkaradu) */}
                  {selectedCenter.id === 4 && selectedCenter.projects && (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-8">
                        {selectedCenter.projects.map((project) => {
                          const isExpanded = expandedProject === project.id;
                          return (
                            <div key={project.id} className="relative pl-12">
                              <div className="absolute left-2 top-2 w-4 h-4 bg-forest-green-600 rounded-full border-4 border-white shadow-lg"></div>
                              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm text-gray-500">{project.startDate}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-forest-green-800 mb-2">
                                      {project.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                                  </div>
                                  <button
                                    onClick={() => toggleProjectDetails(project.id)}
                                    className="ml-4 text-forest-green-600 hover:text-forest-green-700 text-sm font-medium"
                                  >
                                    {isExpanded ? 'Less' : 'More'} →
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-2">
                                      <div><span className="font-semibold text-gray-700">Authors: </span><span className="text-gray-600 text-sm">{project.authors}</span></div>
                                      <div><span className="font-semibold text-gray-700">Status: </span><span className="text-gray-600 text-sm">{project.status}</span></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Style 5: Category-Based Grouped View (Center 5 - Alwarmalai) */}
                  {selectedCenter.id === 5 && selectedCenter.projects && (() => {
                    const categories = [...new Set(selectedCenter.projects.map(p => p.category || 'Uncategorized'))];
                    const toggleCategory = (cat) => {
                      setExpandedCategories(prev => 
                        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                      );
                    };
                    return (
                      <div className="space-y-4">
                        {categories.map((category) => {
                          const categoryProjects = selectedCenter.projects.filter(p => (p.category || 'Uncategorized') === category);
                          const isCategoryExpanded = expandedCategories.includes(category);
                          return (
                            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleCategory(category)}
                                className="w-full bg-forest-green-50 hover:bg-forest-green-100 p-4 flex items-center justify-between transition-colors"
                              >
                                <h4 className="text-lg font-semibold text-forest-green-800">
                                  {category} ({categoryProjects.length})
                                </h4>
                                <ChevronDown className={`h-5 w-5 text-forest-green-600 transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              {isCategoryExpanded && (
                                <div className="p-4 space-y-3">
                                  {categoryProjects.map((project) => {
                                    const isExpanded = expandedProject === project.id;
                                    return (
                                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h5 className="font-semibold text-forest-green-800 mb-1">{project.title}</h5>
                                            <p className="text-gray-600 text-sm">{project.description}</p>
                                          </div>
                                          <button
                                            onClick={() => toggleProjectDetails(project.id)}
                                            className="ml-4 text-forest-green-600 hover:text-forest-green-700 text-sm"
                                          >
                                            {isExpanded ? 'Hide' : 'Details'}
                                          </button>
                                        </div>
                                        {isExpanded && (
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="space-y-1 text-sm">
                                              <div><span className="font-semibold">Authors: </span><span className="text-gray-600">{project.authors}</span></div>
                                              <div><span className="font-semibold">Status: </span><span className="text-gray-600">{project.status}</span></div>
                                              <div><span className="font-semibold">Start Date: </span><span className="text-gray-600">{project.startDate}</span></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Style 6: Carousel/Slider View (Center 6 - Edaikkal) */}
                  {selectedCenter.id === 6 && selectedCenter.projects && (
                    <div className="relative">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative h-96">
                          {selectedCenter.projects.map((project, index) => (
                            <div
                              key={project.id}
                              className={`absolute inset-0 transition-opacity duration-500 ${
                                index === carouselIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              }`}
                            >
                              <div className="flex h-full">
                                <div className="w-1/2 bg-gray-200 flex items-center justify-center">
                                  <TreePine className="h-24 w-24 text-gray-400" />
                                </div>
                                <div className="w-1/2 p-8 flex flex-col justify-center">
                                  <h4 className="text-2xl font-bold text-forest-green-800 mb-4">{project.title}</h4>
                                  <p className="text-gray-600 mb-4">{project.description}</p>
                                  <div className="space-y-2">
                                    <div><span className="font-semibold">Authors: </span><span className="text-gray-600">{project.authors}</span></div>
                                    <div><span className="font-semibold">Status: </span><span className="text-gray-600">{project.status}</span></div>
                                    <div><span className="font-semibold">Start Date: </span><span className="text-gray-600">{project.startDate}</span></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {selectedCenter.projects.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCarouselIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === carouselIndex ? 'bg-forest-green-600 w-6' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={prevCarousel}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5 text-forest-green-600" />
                        </button>
                        <button
                          onClick={nextCarousel}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5 text-forest-green-600" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Style 7: Masonry/Pinterest-style Grid (Center 7 - Kathiripuram) */}
                  {selectedCenter.id === 7 && selectedCenter.projects && (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                      {selectedCenter.projects.map((project, index) => {
                        const isExpanded = expandedProject === project.id;
                        const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-68'];
                        return (
                          <div
                            key={project.id}
                            className={`break-inside-avoid mb-6 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${heights[index % heights.length]}`}
                          >
                            <div className="h-32 bg-gray-200 flex items-center justify-center">
                              <TreePine className="h-12 w-12 text-gray-400" />
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-forest-green-800 mb-2">{project.title}</h4>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                              <button
                                onClick={() => toggleProjectDetails(project.id)}
                                className="text-forest-green-600 hover:text-forest-green-700 text-sm font-medium"
                              >
                                {isExpanded ? 'Hide' : 'View'} Details →
                              </button>
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs">
                                  <div><span className="font-semibold">Authors: </span><span className="text-gray-600">{project.authors}</span></div>
                                  <div><span className="font-semibold">Status: </span><span className="text-gray-600">{project.status}</span></div>
                                  <div><span className="font-semibold">Date: </span><span className="text-gray-600">{project.startDate}</span></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Style 8: Tabbed Interface (Center 8 - Melchengam) */}
                  {selectedCenter.id === 8 && selectedCenter.projects && (() => {
                    const years = [...new Set(selectedCenter.projects.map(p => p.year || '2024'))];
                    const filteredProjects = activeTab === 'all' 
                      ? selectedCenter.projects 
                      : selectedCenter.projects.filter(p => (p.year || '2024') === activeTab);
                    return (
                      <div>
                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                          <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 font-medium transition-colors ${
                              activeTab === 'all' 
                                ? 'border-b-2 border-forest-green-600 text-forest-green-600' 
                                : 'text-gray-600 hover:text-forest-green-600'
                            }`}
                          >
                            All
                          </button>
                          {years.map((year) => (
                            <button
                              key={year}
                              onClick={() => setActiveTab(year)}
                              className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === year 
                                  ? 'border-b-2 border-forest-green-600 text-forest-green-600' 
                                  : 'text-gray-600 hover:text-forest-green-600'
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {filteredProjects.map((project) => {
                            const isExpanded = expandedProject === project.id;
                            return (
                              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs bg-forest-green-100 text-forest-green-800 px-2 py-1 rounded">{project.year || '2024'}</span>
                                      <span className="text-xs text-gray-500">{project.startDate}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold text-forest-green-800 mb-2">{project.title}</h4>
                                    <p className="text-gray-600 text-sm">{project.description}</p>
                                  </div>
                                  <button
                                    onClick={() => toggleProjectDetails(project.id)}
                                    className="ml-4 text-forest-green-600 hover:text-forest-green-700 text-sm"
                                  >
                                    {isExpanded ? 'Hide' : 'Details'}
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-semibold">Authors: </span><span className="text-gray-600">{project.authors}</span></div>
                                      <div><span className="font-semibold">Status: </span><span className="text-gray-600">{project.status}</span></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Style 9: Dashboard-style with Metrics (Center 9 - Jamunamarathur) */}
                  {selectedCenter.id === 9 && selectedCenter.projects && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedCenter.projects.map((project) => {
                        const isExpanded = expandedProject === project.id;
                        return (
                          <div
                            key={project.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            onClick={() => toggleProjectDetails(project.id)}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-forest-green-800 mb-2">{project.title}</h4>
                                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                              </div>
                              <TrendingUp className="h-8 w-8 text-forest-green-600 flex-shrink-0" />
                            </div>
                            {project.progress !== undefined && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-semibold text-forest-green-600">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-forest-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{project.startDate}</span>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{project.status}</span>
                            </div>
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-semibold">Authors: </span><span className="text-gray-600">{project.authors}</span></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Style 10: Alternating Stacked Cards (Center 10 - Maragatta) */}
                  {selectedCenter.id === 10 && selectedCenter.projects && (
                    <div className="space-y-6">
                      {selectedCenter.projects.map((project, index) => {
                        const isExpanded = expandedProject === project.id;
                        const isEven = index % 2 === 0;
                        return (
                          <div
                            key={project.id}
                            className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
                              isExpanded ? 'ring-2 ring-forest-green-500' : ''
                            }`}
                          >
                            <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                              {/* Image Placeholder */}
                              <div className="w-full md:w-1/3 bg-gray-200 flex items-center justify-center min-h-[200px]">
                                <TreePine className="h-20 w-20 text-gray-400" />
                              </div>
                              {/* Content */}
                              <div className="w-full md:w-2/3 p-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="text-xl font-bold text-forest-green-800 mb-2">
                                      {project.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                      {project.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{project.startDate}</span>
                                      </div>
                                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                        {project.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleProjectDetails(project.id)}
                                  className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                >
                                  {isExpanded ? 'Hide Details' : 'View Details'}
                                </button>
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-2">
                                      <div>
                                        <span className="font-semibold text-gray-700">Authors: </span>
                                        <span className="text-gray-600">{project.authors}</span>
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700">Status: </span>
                                        <span className="text-gray-600">{project.status}</span>
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700">Start Date: </span>
                                        <span className="text-gray-600">{project.startDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Completed Projects Section */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
                    <Award className="h-6 w-6 mr-3" />
                    Completed Projects
                  </h3>
                  <div className="space-y-4">
                    {selectedCenter.completedProjects?.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-forest-green-800 mb-2">
                              {project.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                              Project Type: Completed
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                              View PDF
                            </button>
                            <button className="border border-forest-green-600 text-forest-green-600 hover:bg-forest-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center Contact Info */}
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
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      Historical Background
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Under the <strong>Tamil Nadu Agricultural Development Programme (T.N.A.D.P)</strong>, two Seed Technology Divisions were established, with headquarters in Trichy and Dharmapuri, along with a Transfer Technology Division based in Trichy. The primary objective of the Seed Technology Division was to enhance the quality and availability of seedlings, facilitate the mass production and distribution of Tamarind grafts, and establish various seed-related facilities, including clonal orchards and designated seed production areas.
                      </p>
                      <p>
                        This initiative aimed to support local farmers by improving access to high-quality planting materials, thereby aiding in betterment of agricultural practices and higher crop yields.
                      </p>
                      <p>
                        Parallelly, the Transfer Technology Division was dedicated to educating farmers about innovative forestry technologies. This involved organizing workshops, field demonstrations, and training sessions to ensure that farmers were well-informed about the latest advancements in tree cultivation.
                      </p>
                    </div>
                  </div>

                  {/* Formation Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      Formation of Modern Nursery Division
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Following the closure of the Tamil Nadu Agricultural Development Programme scheme on <strong>March 30, 1998</strong>, effective <strong>April 1, 1999</strong>, several centers across diverse agro-climatic zones were brought under a new entity known as the <strong>Modern Nursery Division</strong> (for short hereinafter Division), headquartered in Dharmapuri. This was formalized by <strong>G.O.M.S.No.54</strong> issued by the Environment and Forests Department on <strong>February 26, 1999</strong>.
                      </p>
                      <p>
                        Importantly, this restructuring did not create any new positions; instead, personnel were redeployed from existing Divisions and Circles. This ensured continuity in operations while optimizing resource allocation to meet the evolving needs.
                      </p>
                      <p>
                        The formation of the Division marked a significant step towards improving the infrastructure for quality seedling production and distribution in Tamil Nadu. By focusing on modern nursery practices, the Division aims to enhance the quality of planting material available to the stake holders. Furthermore, it marked a significant milestone in the Tamil Nadu Forest Department in the areas of research and production of Biofertilizers. Under a single Division it facilitated a more cohesive approach to research, development, production and technology transfer, ultimately benefiting the forest department, line departments and agricultural community at large.
                      </p>
                    </div>
                  </div>

                  {/* Administrative History Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      Administrative History
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Initially the division was established in 1999 under the supervision of the <strong>Research Circle, Chennai</strong>. In line with <strong>G.O.(Ms) No.149</strong> of the Environment and Forest (FR. Spl.B) Department, dated <strong>November 14, 2011</strong>, the division was brought under the administrative control the <strong>Genetics Circle in Coimbatore</strong>, and later on again brought and continue to function under the control of <strong>Research circle, Chennai</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Mission and Bio-fertilizers Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      Mission and Bio-fertilizers Production
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        The division's primary mission is to produce and supply high-quality vermicompost, <strong>Vesicular Arbuscular Mycorrhizae (VAM)</strong>, and various bio-fertilizers, including <strong>Azospirillum</strong> and <strong>Phosphobacteria</strong>. A significant milestone was reached in <strong>2000</strong> with the inauguration of a state-of-the-art laboratory, which has been crucial for the continuous production and supply of essential nitrogen-fixing bacteria like Azospirillum, phosphate-solubilizing bacteria such as Phosphobacteria, as well as root-rot suppressing agents like <strong>Pseudomonas sp.</strong> and the fungus <strong>Trichoderma viride</strong>.
                      </p>
                    </div>
                  </div>

                  {/* ISO Certification Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      ISO Certification
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        To further our commitment to quality, the Bio-Fertilizers Research and Production Unit received <strong>ISO certification in July 2013</strong>, affirming our adherence to rigorous standards. This certification applies to the laboratory and production facilities for VAM and vermicompost across five Modern Nursery Centres: <strong>Thoppur, Harur, Kalamavoor, Valkaradu, and Alwarmalai</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Forest Tree Seed Centre Section */}
                  <div className="mb-8 border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-semibold text-forest-green-700 mb-4">
                      Forest Tree Seed Centre
                    </h3>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                      <p>
                        Additionally, a <strong>Forest Tree Seed Centre</strong> was established at <strong>M.R.Palayam</strong> to ensure availability of forest tree seeds for current and future needs. This initiative aims to provide high-quality, purified seeds to the Forest Department, as well as to farmers, industries, sister departments, and other stakeholders.
                      </p>
                      <p>
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
  );
};

export default ModernNurseryDivision;
