import React from 'react';

export type DivisionStatItem = {
  value: string;
  label: string;
};

export type DivisionContactFallbacks = {
  phone: string;
  /**
   * Used to generate a fallback email when a center doesn't have an email set.
   * Current behavior: `${center.name.toLowerCase().replace(/\s+/g, '')}@${emailDomain}`
   */
  emailDomain: string;
};

export type ForestGeneticsDivisionConfig = {
  divisionSlug: string;
  overview: React.ReactNode;
  focusAreasImageSrc: string;
  stats: DivisionStatItem[];
  centerImageFallbacks: Record<string, string>;
  tollFreeFallback: {
    display: string;
    tel: string;
  };
  contactFallbacks: DivisionContactFallbacks;
};

export const forestGeneticsDivisionConfig: ForestGeneticsDivisionConfig = {
  divisionSlug: 'forest-genetics',
  overview: (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Background Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Background
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The <strong>Forest Genetics Division</strong> specializes in genetic research, 
              tree breeding programs, and conservation of genetic diversity in forest species 
              across Tamil Nadu.
            </p>
            <p className="text-justify">
              Our division works to identify, preserve, and enhance genetic resources of native 
              and economically important tree species, contributing to sustainable forest management 
              and biodiversity conservation.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Mission & Objectives
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Our mission is to advance forest genetics research, develop superior tree varieties 
              through selective breeding, and establish gene banks for conservation of genetic 
              resources. We collaborate with research institutions to enhance tree productivity 
              and resilience.
            </p>
          </div>
        </div>

        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/placeholder-focus-areas.png"
                alt="Forest Genetics Division Focus Areas"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Research Areas Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            Key Research Areas
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Our research focuses on genetic diversity assessment, molecular marker development, 
              tree breeding and selection programs, seed source identification, and conservation 
              genetics for endangered forest species.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/placeholder-focus-areas.png',
  stats: [
    { value: '6', label: 'Research Centers' },
    { value: '25+', label: 'Breeding Programs' },
    { value: '150+', label: 'Genetic Studies' },
    { value: '2000+', label: 'Tree Varieties' },
  ],
  centerImageFallbacks: {
    // Add center name to image mappings here as needed
    // Example: 'Research Center Name': '/path/to/image.jpg',
  },
  tollFreeFallback: {
    display: '1800-XXX-XXXX',
    tel: '1800XXXXXXXX',
  },
  contactFallbacks: {
    phone: '+91 44 XXXX XXXX',
    emailDomain: 'tnfrd.gov.in',
  },
};

