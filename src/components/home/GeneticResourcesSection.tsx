import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { GENETIC_RESOURCE_TYPES } from '../../config/geneticResourceTypes';

const GeneticResourcesSection: React.FC = () => {
  return (
    <section id="genetic-resources" className="py-16 px-4 sm:px-6 lg:px-8 bg-background-paper">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="h-6 w-6 text-primary-main" />
          <span className="text-primary-main font-semibold text-sm uppercase tracking-wide">
            Resources
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-content-heading mb-2">
          Genetic Resources
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-primary-main to-accent-light mx-auto mb-6 sm:mb-8" />
        <p className="text-center text-content-secondary text-sm mb-6 sm:mb-8 max-w-2xl mx-auto">
          Explore our diverse genetic resource types for forest conservation and research.
        </p>

        {/* Horizontal scrollable container */}
        <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-6 min-w-max">
            {GENETIC_RESOURCE_TYPES.map((resourceType) => (
              <Link
                key={resourceType.slug}
                to={`/genetic-resources?type=${resourceType.slug}`}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[240px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Placeholder image background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-lightest via-accent-lightest to-primary-lightest flex items-center justify-center">
                  {/* Placeholder icon */}
                  <Sprout className="h-16 w-16 text-primary-main/30" />
                </div>
                
                {/* Text overlay with gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-4 py-4 sm:py-5 pt-8">
                  <h3 className="text-white text-base sm:text-lg font-serif font-semibold leading-tight group-hover:text-accent-light transition-colors">
                    {resourceType.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneticResourcesSection;
