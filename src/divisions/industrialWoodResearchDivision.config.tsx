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
  {/* Focus Areas Image Section */}
  <div className="mb-8 border-t border-gray-200 pt-8">
    <div className="flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <img
          src="/IWRD.png"
          alt="Industrial Wood Research Division Focus Areas"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  </div>
        {/* AT A GLANCE Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            1. Industrial Wood Research Division AT A GLANCE
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Industrial Wood [Research] Division was initially formed with Assistant Conservator of Forests, Intensive Wattle Research unit, during 1963 with its headquarters at Coonoor as per G.O.Ms.No.1007 Food and Agriculture Department dated 22.5.61. Then the Headquarters was shifted to Coimbatore for effective supervision of all experiments from a center.
            </p>
            <p className="text-justify">
              The Chemist and Lab attender, along with Research Laboratory, established as per G.O.Ms.No.2174 Agriculture Department dated 14.7.69, functioning under the control of Assistant Conservator of Forests, Intensive Wattle Research unit at Udhagamandalam, was also shifted to Coimbatore.
            </p>
            <p className="text-justify">
              The post of the Assistant Conservator of Forests of this unit had been upgraded as "Deputy Conservator of Forests" in G.O.Ms.No.1971 Forests and Fisheries Department dated 04.10.1985 to facilitate and to integrate it with the institute 'TREE'. The name of the division office was also changed as "The office of the "Deputy Conservator of Forests, Industrial Wood [Research] Division". And initially functioning with four Ranges viz., Kodaikanal, Madurai, Sivagangai and Nazareth. Consequent to winding up of Tamil Nadu Agricultural Development Project, the Seed Technology and Transfer Technology Divisions which were functioning with headquarters at Trichy, were merged with Industrial Wood Research Division on 01.10.1998 and the Head Quarters of Industrial Wood Research Division was shifted to Mukkombu on 19.02.1999 as per G.O.Ms.No.15 Forest and Fisheries dated 19.01.1999
            </p>
            <p className="text-justify">
              From 19.2.1999 this division is functioning at Mukkombu with 6 Ranges viz., Trichy (Mukkombu), Kodaikanal, Madurai, Pudukottai, Jeyankondam (erstwhile Kumbakonam) and Nazareth. The jurisdiction comprises over fourteen southern district viz. Trichy, Perambalur, Nagappattinam, Thanjavur, Pudukottai, Sivagangai, Ramanathapuram, Virudhunagar, Tuticorin, Dindigul, Madurai, Tirunelveli and Kanyakumari. From 1.2.05 Theni Range is functioning as 7th Range. From 19.9.06 onwards Nazareth, Madurai, Theni Range were transferred to Madurai Agro Forestry Research Division.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-justify">
                <strong>a)</strong> This division was formed mainly for enhancement of the yield of Industrial Raw materials, tree improvement works by selecting candidate trees from species like Eucalyptus, Alnus, Populars, Casuarina Holoptelia integrifolia, Ferronia elephantum, Ailanthus excels, Swietinea chloroxyline and match wood industrial species.
              </p>
              <p className="text-justify">
                <strong>b)</strong> Conducting various bio-chemical tests in the Industrial wood division laboratory to assess the properties of various woods, tannin content in various species and santalol in sandal oil.
              </p>
              <p className="text-justify">
                <strong>c)</strong> Analysis of oil content in various tree born oil seeds.
              </p>
              <p className="text-justify">
                <strong>d)</strong> Development of Nursery protocols for raising various industrially important species.
              </p>
              <p className="text-justify">
                <strong>e)</strong> Research on Dye yielding trees, Veneer and match wood species and Energy plantations.
              </p>
              <p className="text-justify">
                <strong>f)</strong> Conducting various Industrial allied experiments in 4 agro climatic zone. viz. High rainfall zone, Southern zone, High altitude and hilly zone, Cauvery delta zone.
              </p>
              <p className="text-justify">
                <strong>g)</strong> In this division we have carried out experiments under TAP Phase II, Part II, Coastal afforestation WGDP, Jatropha and Bamboo scheme.
              </p>
              <p className="text-justify">
                <strong>h)</strong> We are implementing the coastal experiment under NMBA scheme at Kodiyampalayam RF of Nagapattinam District.
              </p>
              <p className="text-justify">
                <strong>i)</strong> Now in division we have carried out experiments under J.A. Research, TBGP, and CAMPA Schemes.
              </p>
            </div>
            <p className="text-justify mt-4">
              As per G.O.Ms.No. 228 E&F (FRI) Dept. Dt.26.09.2012.
            </p>
            <div className="space-y-2 ml-4">
              <p className="text-justify">
                <strong>1)</strong> The post of Deputy Conservator Forests, Industrial Wood Research Division, Mukkombu, and Trichy be redeployed to Tamil Nadu Forest Academy Coimbatore as Deputy Director.
              </p>
              <p className="text-justify">
                <strong>2)</strong> The post of Assistant Conservator of Forests utilized in Tamil Nadu Forest Academy, Coimbatore be redeployed as Assistant Conservator of Forests, Industrial Wood Research Division, Mukkombu, Trichy.
              </p>
            </div>
            <p className="text-justify mt-4">
              As per G.O.Ms.No. 159 E&F (FR Spl.B) Dept. Dated.26.10.2017.
            </p>
            <div className="space-y-2 ml-4">
              <p className="text-justify">
                <strong>3)</strong> The post of Assistant Conservator Forests, Industrial Wood Research Division, Mukkombu, Trichy was re-organized to under the Control of District Forest Officer, Dharmapuri.
              </p>
              <p className="text-justify">
                <strong>4)</strong> The post of Deputy Conservator of Forests utilized in Agro Forestry Research Division, Madurai was re-organized as Deputy Conservator of Forests, Industrial Wood Research Division, Mukkombu, Trichy.
              </p>
            </div>
            <p className="text-justify mt-4">
              Presently this division is functioning at Mukkombu with 4 Ranges viz., Trichy (Mukkombu), Kodaikanal, Pudukkottai & Jeyankondam. The jurisdiction comprises over nine southern district viz. Trichy, Preambular, Nagapattinam, Thanjavur, Pudukkottai, Ariyalur,Thiruvarur, Karur & Namakkal.
            </p>
          </div>
        </div>

        {/* Administrative Set Up Section - Placeholder */}
        {/* <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            2. Administrative Set Up
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-center text-gray-500 italic">
              [Administrative set up content placeholder]
            </p>
          </div>
        </div> */}

        {/* Vision Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            2. Vision and Mission of the Division
          </h3>
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-green-600 mb-4 text-center">Vision</h4>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p className="text-justify">
                To become a leading centre of excellence in industrial forestry by delivering cutting-edge research, high-quality planting materials, and sustainable wood production technologies that meet the growing demands of wood-based industries while ensuring environmental conservation, climate resilience, and socioeconomic benefits for communities.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-green-600 mb-4 text-center">Mission</h4>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">1. Genetic Improvement and Resource Development</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To identify, select, and conserve elite genetic resources of priority industrial wood species.</li>
                <li>To establish seed orchards, clonal repositories, and provenance trials for long-term genetic enhancement.</li>
                <li>To ensure continuous supply of superior-quality seeds and planting stock to forestry sectors and industries.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">2. Research on Propagation and Silviculture</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To develop, refine, and standardize nursery, propagation, and vegetative multiplication techniques for industrially important tree species.</li>
                <li>To design and implement improved silvicultural practices, spacing trials, and nutrient management protocols for maximizing wood yield and quality.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">3. Industrial Application and Product Support</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To study wood properties, fiber characteristics, growth behaviour, and suitability for matchwood, plywood, paper, biomass, construction, and other industrial uses.</li>
                <li>To promote species diversification and support industries in identifying alternative raw materials to reduce pressure on natural forests.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">4. Sustainable Plantation Management</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To encourage environmentally responsible and climate-resilient plantation models.</li>
                <li>To integrate soil health, water management, biodiversity conservation, and carbon sequestration principles into industrial forestry.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">5. Technology Transfer and Capacity Building</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To facilitate dissemination of research findings through demonstrations, field trials, training programmes, and stakeholder workshops.</li>
                <li>To strengthen collaborations with forest departments, research institutions, industries, farmers, and community groups for large-scale adoption of improved technologies.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">6. Innovation and Future Readiness</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>To promote the use of biotechnology, GIS, remote sensing, and digital tools in plantation management and resource monitoring.</li>
                <li>To anticipate industry needs and align research priorities with emerging market trends and environmental challenges.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  ),
  focusAreasImageSrc: '/IWRD.png',
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

