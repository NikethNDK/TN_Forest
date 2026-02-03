import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Leaf, Users, Award, Globe, ArrowRight } from 'lucide-react';
import { divisions } from '../data/mockData';
import type { Division } from '../types';
import PageHeader from '../components/common/PageHeader';

const Divisions: React.FC = () => {
  const divisionIcons: Record<string, React.ReactNode> = {
    'state-forest-research': <TreePine className="h-12 w-12 text-primary-main" />,
    'modern-nursery': <Leaf className="h-12 w-12 text-primary-main" />,
    'forest-genetics': <Users className="h-12 w-12 text-primary-main" />,
    'industrial-wood': <Award className="h-12 w-12 text-primary-main" />,
    'agro-forestry': <Globe className="h-12 w-12 text-primary-main" />
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Research Divisions"
          description="Our research is organized into specialized divisions, each focusing on specific aspects of forest science, conservation, and sustainable development."
        />

        {/* Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {divisions.map((division: Division) => (
            <div key={division.id} className="bg-background-paper rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                  {divisionIcons[division.slug] || <TreePine className="h-12 w-12 text-primary-main" />}
                </div>
                <h3 className="text-2xl font-bold text-content-headingSecondary mb-3">
                  {division.name}
                </h3>
                {division.description && (
                  <p className="text-content-secondary leading-relaxed mb-6">
                    {division.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-content-tertiary">
                  <span>Research Centers</span>
                  <span className="font-semibold text-primary-main">
                    {division.researchCenters ? division.researchCenters.length : 'Multiple'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-content-tertiary">
                  <span>Active Projects</span>
                  <span className="font-semibold text-primary-main">10+</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-content-tertiary">
                  <span>Publications</span>
                  <span className="font-semibold text-primary-main">25+</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border-light">
                <Link
                  to={`/divisions/${division.slug}`}
                  className="w-full bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                >
                  Explore Division
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Research Statistics */}
        <div className="bg-primary-dark rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-content-inverse mb-8 text-center">
            Division Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-light mb-2">5</div>
              <div className="text-content-inverseSecondary">Research Divisions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-light mb-2">25+</div>
              <div className="text-content-inverseSecondary">Research Centers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-light mb-2">100+</div>
              <div className="text-content-inverseSecondary">Research Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-light mb-2">50+</div>
              <div className="text-content-inverseSecondary">Scientists</div>
            </div>
          </div>
        </div>

        {/* Research Focus Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-content-headingSecondary mb-8 text-center">
            Research Focus Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Forest Ecology</h3>
              <p className="text-content-secondary text-sm">
                Study of forest ecosystems, biodiversity, and ecological processes 
                to understand forest dynamics and health.
              </p>
            </div>
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Conservation Biology</h3>
              <p className="text-content-secondary text-sm">
                Research on species conservation, habitat protection, and 
                restoration of degraded forest ecosystems.
              </p>
            </div>
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Forest Genetics</h3>
              <p className="text-content-secondary text-sm">
                Genetic research on forest trees, breeding programs, and 
                development of improved varieties.
              </p>
            </div>
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Sustainable Management</h3>
              <p className="text-content-secondary text-sm">
                Development of sustainable forest management practices and 
                community-based conservation approaches.
              </p>
            </div>
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Climate Change</h3>
              <p className="text-content-secondary text-sm">
                Research on climate change impacts on forests and development 
                of adaptation strategies.
              </p>
            </div>
            <div className="bg-background-paper rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-content-headingSecondary mb-3">Technology Innovation</h3>
              <p className="text-content-secondary text-sm">
                Application of modern technology in forest monitoring, 
                research, and conservation efforts.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-content-headingSecondary mb-4">
            Collaborate With Us
          </h2>
          <p className="text-xl text-content-secondary mb-8 max-w-2xl mx-auto">
            Join our research efforts and contribute to forest conservation 
            and sustainable development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-interactive-primaryDefault hover:bg-interactive-primaryHover text-interactive-primaryText px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              View Research Opportunities
            </button>
            <button className="border-2 border-border-primary text-content-link hover:bg-interactive-primaryDefault hover:text-interactive-primaryText px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Contact Research Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Divisions;

