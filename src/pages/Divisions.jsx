import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Leaf, Users, Award, Globe, ArrowRight } from 'lucide-react';
import { divisions } from '../data/mockData';

const Divisions = () => {
  const divisionIcons = {
    'state-forest-research': <TreePine className="h-12 w-12 text-forest-green-600" />,
    'modern-nursery': <Leaf className="h-12 w-12 text-forest-green-600" />,
    'forest-genetics': <Users className="h-12 w-12 text-forest-green-600" />,
    'industrial-wood': <Award className="h-12 w-12 text-forest-green-600" />,
    'agro-forestry': <Globe className="h-12 w-12 text-forest-green-600" />
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Research Divisions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our research is organized into specialized divisions, each focusing on specific 
            aspects of forest science, conservation, and sustainable development.
          </p>
        </div>

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {divisions.map((division) => (
            <div key={division.id} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-forest-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {divisionIcons[division.slug] || <TreePine className="h-12 w-12 text-forest-green-600" />}
                </div>
                <h3 className="text-2xl font-bold text-forest-green-800 mb-3">
                  {division.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {division.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Research Centers</span>
                  <span className="font-semibold text-forest-green-600">
                    {division.researchCenters ? division.researchCenters.length : 'Multiple'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Active Projects</span>
                  <span className="font-semibold text-forest-green-600">10+</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Publications</span>
                  <span className="font-semibold text-forest-green-600">25+</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to={`/divisions/${division.slug}`}
                  className="w-full bg-forest-green-600 hover:bg-forest-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                >
                  Explore Division
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Research Statistics */}
        <div className="bg-forest-green-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Division Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">5</div>
              <div className="text-green-100">Research Divisions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">25+</div>
              <div className="text-green-100">Research Centers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">100+</div>
              <div className="text-green-100">Research Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">50+</div>
              <div className="text-green-100">Scientists</div>
            </div>
          </div>
        </div>

        {/* Research Focus Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-8 text-center">
            Research Focus Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Forest Ecology</h3>
              <p className="text-gray-600 text-sm">
                Study of forest ecosystems, biodiversity, and ecological processes 
                to understand forest dynamics and health.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Conservation Biology</h3>
              <p className="text-gray-600 text-sm">
                Research on species conservation, habitat protection, and 
                restoration of degraded forest ecosystems.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Forest Genetics</h3>
              <p className="text-gray-600 text-sm">
                Genetic research on forest trees, breeding programs, and 
                development of improved varieties.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Sustainable Management</h3>
              <p className="text-gray-600 text-sm">
                Development of sustainable forest management practices and 
                community-based conservation approaches.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Climate Change</h3>
              <p className="text-gray-600 text-sm">
                Research on climate change impacts on forests and development 
                of adaptation strategies.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-forest-green-800 mb-3">Technology Innovation</h3>
              <p className="text-gray-600 text-sm">
                Application of modern technology in forest monitoring, 
                research, and conservation efforts.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
            Collaborate With Us
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our research efforts and contribute to forest conservation 
            and sustainable development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              View Research Opportunities
            </button>
            <button className="border-2 border-forest-green-600 text-forest-green-600 hover:bg-forest-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Contact Research Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Divisions;
