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

export type AgroForestryResearchDivisionConfig = {
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

export const agroForestryResearchDivisionConfig: AgroForestryResearchDivisionConfig = {
  divisionSlug: 'agro-forestry',
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
              The <strong>Agro Forestry Research Division</strong> promotes integrated land-use 
              systems that combine trees with crops and/or livestock, enhancing agricultural 
              productivity while providing environmental and economic benefits in Tamil Nadu.
            </p>
            <p className="text-justify">
              Our division develops and promotes agroforestry models that improve soil health, 
              increase farm income, provide ecosystem services, and contribute to climate 
              resilience in agricultural landscapes.
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
              Our mission is to develop and promote sustainable agroforestry systems that integrate 
              trees with agricultural crops and livestock. We conduct research on tree-crop interactions, 
              develop suitable species combinations, and provide extension services to farmers for 
              adoption of agroforestry practices.
            </p>
          </div>
        </div>

        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/placeholder-focus-areas.png"
                alt="Agro Forestry Research Division Focus Areas"
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
              Our research focuses on tree-crop interactions, agroforestry system design, 
              species selection for different agro-climatic zones, soil fertility management, 
              and economic analysis of agroforestry systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/placeholder-focus-areas.png',
  stats: [
    { value: '7', label: 'Research Centers' },
    { value: '40+', label: 'Agroforestry Models' },
    { value: '200+', label: 'Farmer Demonstrations' },
    { value: '10000+', label: 'Farmers Trained' },
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

