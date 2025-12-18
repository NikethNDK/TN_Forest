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

export type StateForestResearchDivisionConfig = {
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

export const stateForestResearchDivisionConfig: StateForestResearchDivisionConfig = {
  divisionSlug: 'state-forest-research',
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
              The <strong>State Forest Research Division</strong> focuses on advancing forestry research, 
              developing innovative conservation strategies, and promoting sustainable forest management practices 
              across Tamil Nadu.
            </p>
            <p className="text-justify">
              Established to bridge the gap between scientific research and practical forest management, 
              this division plays a crucial role in developing evidence-based policies and practices that 
              benefit both the environment and local communities.
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
              Our mission is to conduct cutting-edge research in forest ecology, biodiversity conservation, 
              and sustainable resource management. We collaborate with academic institutions, research organizations, 
              and field practitioners to develop innovative solutions for forest conservation challenges.
            </p>
          </div>
        </div>

        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/placeholder-focus-areas.png"
                alt="State Forest Research Division Focus Areas"
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
              Our research encompasses various domains including forest biodiversity assessment, 
              climate change adaptation strategies, soil conservation techniques, and community-based 
              forest management models.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/placeholder-focus-areas.png',
  stats: [
    { value: '5', label: 'Research Centers' },
    { value: '20+', label: 'Active Studies' },
    { value: '100+', label: 'Published Papers' },
    { value: '500+', label: 'Field Surveys' },
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

