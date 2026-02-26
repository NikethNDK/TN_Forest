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
        {/* Focus Areas Image Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <img
                src="/AFRD.png"
                alt="Agro Forestry Research Division Focus Areas"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Division at Glance Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Division at Glance
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Agro Forestry Research Division was functioning as the Deputy Conservator of Forests with the headquarters of Madurai from 20.06.2006 through G.O. (D). No: 377, E & F, Dept, Dated: 12.06.2006 and control of Research circle, Chennai.
            </p>
            <p className="text-justify">
              As per re-organization - G.O (MS) No. 159 E & F (FR –SPL- B) Dept, Dated: 26.12.2017 this division was renamed in the name of Assistant Conservator of Forests, Agro Forestry Research Division, Madurai.
            </p>
            <p className="text-justify">
              Agro Forestry Research Division has been functioning with Six Research Ranges and including Seven Research centers.
            </p>
            <p className="text-justify">
              The jurisdiction of this division has been extended over Ten Southern Districts viz. Madurai, Theni, Dindigul, Sivagangai, Ramanathapuram, Virudhunagar, Tuticorin, Tirunelveli, Kanyakumari and Tenkasi. The jurisdiction was extends in two Agro climatic zones of Southern zone and High Rainfall zone.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Vision
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              To be a leading centre of excellence in agro forestry research, fostering innovative, climate-resilient, RET conservation and ecologically sustainable land-use systems that strengthen rural livelihoods, enhance biodiversity, and advance environmental stewardship across Southern Tamil Nadu.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Mission
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <ul className="list-disc list-inside space-y-3 text-justify">
              <li>To develop and promote integrated and protective agro forestry models that strengthen ecological resilience, agricultural productivity, and sustainable land management.</li>
              <li>To enhance genetic improvement, species evaluation, and large-scale deployment of superior planting materials through scientific trials and orchard management.</li>
              <li>To innovate propagation technologies for medicinal, economically important, and RET species to ensure their conservation and sustainable utilization.</li>
              <li>To advance afforestation, ecological restoration, and energy plantation initiatives that restore degraded landscapes and improve ecosystem services.</li>
              <li>To document, conserve, and enhance the biodiversity of forest ecosystems through field surveys, arboreta development, and conservation research.</li>
              <li>To foster interdisciplinary and inter-institutional collaborations to promote biodegradable materials, seaweed technologies, and conservation biotechnology.</li>
              <li>To undertake comprehensive soil, environmental, and carbon sequestration studies to contribute to climate-smart forestry and environmental sustainability.</li>
            </ul>
          </div>
        </div>


        {/* Major Focusing Areas Section */}
        {/* <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Major Focusing Areas of the Agro Forestry Research Division
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">1. Integrated Agro forestry Systems</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Advancement of integrated agro forestry models to enhance the productivity and sustainability of major tree and crop combinations.</li>
                <li>Promotion of agro forestry adoption among farming communities to improve farm income, ecological resilience, and environmental quality.</li>
                <li>Establishment of model agro forestry demonstration plots for knowledge dissemination and farmer capacity building.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">2. Protective and Supportive Agro forestry Models</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Development and evaluation of windbreaks, shelterbelts, and barrier plantations to protect agricultural crops from abiotic stressors.</li>
                <li>Research on coastal ecosystem stabilization, including sand dune restoration, shelterbelt systems, and diversification from monoculture to polyculture forestry models.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">3. Species Introduction, Evaluation, and Deployment</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Implementation of on-farm trials of promising species such as <em>Casuarina equisetifolia</em>, <em>C. junghuhniana</em>, <em>Gmelina arborea</em>, <em>Tectona grandis</em>, <em>Ailanthus malabarica</em>, <em>Khaya senegalensis</em>, and bamboo species.</li>
                <li>Introduction and large-scale promotion of <em>Ailanthus malabarica</em> as a sustainable raw material source for the matchwood industry.</li>
                <li>Establishment and management of seed stands (SS), seedling seed orchards (SSO), clonal seed orchards (CSO), and seed production areas (SPA) for genetically superior and economically important timber species.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">4. Propagation and Cultivation Technology Development</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Standardization of propagation protocols and cultivation packages for high-value medicinal species, including <em>Decalepis hamiltonii</em> (Maahali Kizhangu).</li>
                <li>Advancement of propagation technologies for Rare, Endangered and Threatened (RET) medicinal species, with emphasis on <em>Hydnocarpus macrocarpa</em>.</li>
                <li>Development of efficient nursery, cloning, and micropropagation techniques for agroforestry species.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">5. Genetic Improvement and Field Experimental Trials</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Execution of major research trials including clonal evaluation, progeny testing, exploratory trials, and species introduction experiments.</li>
                <li>Assessment of species performance across diverse agro-climatic zones to determine region-specific suitability and productivity potential.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">6. Afforestation, Ecological Restoration, and Energy Plantations</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Implementation of afforestation experiments on degraded, denuded, and marginal lands to improve ecological stability.</li>
                <li>Establishment of model energy plantations on farmers' lands to promote renewable biomass production.</li>
                <li>Restoration and conservation initiatives for RET medicinal plants to support their reproduction and genetic recovery.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">7. Biodiversity Documentation and Conservation Research</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Comprehensive documentation of fern diversity in the Kalakad–Mundanthurai Tiger Reserve (KMTR) to enhance understanding of pteridophyte richness in tropical landscapes.</li>
                <li>Assessment and documentation of island flora in ecologically sensitive marine and coastal ecosystems.</li>
                <li>Establishment of arboreta dedicated to critically endangered and endangered tree species in high-rainfall zones to conserve genetic resources.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">8. Collaborative Research and Technological Innovation</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Collaborative research with research institution to develop biodegradable, eco-friendly bag materials as sustainable alternatives to plastics.</li>
                <li>Joint scientific programmes for native seaweed cultivation technology, with a focus on enhancing livelihood opportunities and improving coastal ecosystem health.</li>
                <li>Studies on the In-vitro Propagation and Conservation of Endangered <em>Syzygium parameswaranii</em> in the Megamalai Wildlife Sanctuary, Theni District, Tamil Nadu, undertaken by the Agroforestry Research Division with Madurai Kamaraj University.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">9. Soil, Environmental Studies, and Carbon Sequestration</h4>
              <ul className="list-disc list-inside space-y-2 text-justify ml-4">
                <li>Research on soil conservation practices, soil nutrient dynamics, and soil-amendment strategies under various agro forestry systems.</li>
                <li>Environmental impact studies emphasizing pollution mitigation, ecosystem service enhancement, and agro forestry-based environmental sustainability.</li>
                <li>Quantitative assessment of carbon sequestration potential of major agro forestry systems to support climate-change mitigation strategies.</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  ),
  focusAreasImageSrc: '/AFRD.png',
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

