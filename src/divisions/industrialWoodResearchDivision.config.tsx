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

export type IndustrialWoodResearchDivisionConfig = {
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

export const industrialWoodResearchDivisionConfig: IndustrialWoodResearchDivisionConfig = {
  divisionSlug: 'industrial-wood',
  overview: (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Background Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Background
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The <strong>Industrial Wood Research Division</strong> focuses on research and 
              development of fast-growing tree species suitable for industrial applications, 
              wood quality improvement, and sustainable timber production in Tamil Nadu.
            </p>
            <p className="text-justify">
              Our division works to meet the growing demand for industrial wood while ensuring 
              sustainable forest management practices and supporting the wood-based industries 
              in the region.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Mission & Objectives
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Our mission is to develop high-yielding industrial wood species, improve wood 
              quality through research, and establish sustainable plantation models. We work 
              closely with industries to understand market requirements and develop appropriate 
              tree species and management practices.
            </p>
          </div>
        </div>

        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/placeholder-focus-areas.png"
                alt="Industrial Wood Research Division Focus Areas"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Research Areas Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Key Research Areas
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Our research encompasses wood properties analysis, growth optimization techniques, 
              species selection for industrial use, plantation management systems, and value-added 
              wood product development.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/placeholder-focus-areas.png',
  stats: [
    { value: '4', label: 'Research Centers' },
    { value: '30+', label: 'Active Projects' },
    { value: '80+', label: 'Species Studied' },
    { value: '5000+', label: 'Hectares Planted' },
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

