import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, ArrowRight, TreePine, Users, Award } from 'lucide-react';
import { divisions } from '../data/mockData';

const ModernNurseryDivision = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const modernNurseryDivision = divisions.find(div => div.slug === 'modern-nursery');

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
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
              <div className="space-y-3">
                {modernNurseryDivision?.researchCenters?.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => handleCenterSelect(center)}
                    className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                      selectedCenter?.id === center.id
                        ? 'bg-forest-green-100 text-forest-green-800 border-2 border-forest-green-300'
                        : 'bg-gray-50 hover:bg-forest-green-50 text-gray-700 hover:text-forest-green-700'
                    }`}
                  >
                    <div className="font-semibold mb-1">{center.name}</div>
                    <div className="text-sm text-gray-500">{center.location}</div>
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
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    {selectedCenter.location}
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
                  <div className="space-y-4">
                    {selectedCenter.projects?.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-forest-green-800 mb-2">
                              {project.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                              Project Type: {project.type === 'current' ? 'Ongoing' : 'Completed'}
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
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Leaf className="h-16 w-16 text-forest-green-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-forest-green-800 mb-4">
                  Select a Research Center
                </h2>
                <p className="text-gray-600 mb-8">
                  Choose a research center from the sidebar to view detailed information, 
                  current projects, and completed research.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {modernNurseryDivision?.researchCenters?.map((center) => (
                    <div key={center.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <h3 className="font-semibold text-forest-green-800 mb-2">{center.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{center.location}</p>
                      <button
                        onClick={() => handleCenterSelect(center)}
                        className="text-forest-green-600 hover:text-forest-green-700 font-medium text-sm flex items-center"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  ))}
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
              <div className="text-4xl font-bold text-green-300 mb-2">5</div>
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
