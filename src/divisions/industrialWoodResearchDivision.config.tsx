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
        {/* Vision Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Vision
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              To become a leading centre of excellence in industrial forestry by delivering cutting-edge research, high-quality planting materials, and sustainable wood production technologies that meet the growing demands of wood-based industries while ensuring environmental conservation, climate resilience, and socioeconomic benefits for communities.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Mission
          </h3>
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

        {/* Focus Areas Section */}
        {/* <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Focus Areas of the Division
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Mass Multiplication</h4>
              <p className="text-justify">
                Mass multiplies the commercially important species to meet the supply and demand of seedlings for farmers and department purpose. It takes long time to attain the mature seed so we had to multiply through vegetative propagation method for mass multiplication in a short period. The selected sprigs were collected from the candidate plus trees of known genetic source available in the location and appropriate hormones was applied and placed in the mist chamber and the rooted propagules were kept in the shade net. After 15 to 30 days for rooting, germinated vegetative propagules were transferred to appropriate poly bags. The germinated seedlings were kept for hardening in the hardening chamber and monitored the plants periodically. Clonal seedlings are raised successfully in the nursery within the short period for mass multiplication. Quality seedlings were distributed to the farmers for fulfill their needs.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Introduction Trial</h4>
              <p className="text-justify">
                The economic and environmental benefits obtained from farm forestry will be greatest where the trees being used are well adapted to the sites on which they are planted. It is generally understood that some species will out-perform others in a particular environment, but within a single species there can also be a great deal of genetic variation. There is usually a wide range in the performances of different provenances within a trial or plantation.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Seed Stand</h4>
              <p className="text-justify">
                Trees are generally short-lived. The hard seed coat means that germination occurs over a prolonged period after seed dispersal and that seed can remain viable for long periods in the soil. The flowers are self-fertile, and most seed results from self-pollination. Flowering and fruiting occurs throughout the year as long as moisture permits and fruiting is associated with suppression of vegetative growth. Arboreal cultivars had been selected for lower flowering rate. Fruits ripen in 10-15 weeks. A group of trees that has been identified or set aside specifically as a seed source. They are groups of trees that are established and managed to maximize seed production. Fruits from these trees are harvested exclusively for seed collection. These seeds were stored and distributed to grow new trees for multiple benefits and uses.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Clonal Seed Orchard</h4>
              <p className="text-justify">
                Vegetative propagation like coppice, sprigs, cuttings, layering and tissue culture shall be explored in order to have identical parental characteristic of tree vegetative propagation from coppice shoots can be tried by selecting various CPTs from different provenance and clones collected. The clonal evaluation trial will be converted in to CSO after the evaluation is complete. Good genotypes are preserved. It will maximum genetic gain are obtained. The genetic material and combining ability are known. It's easier to manage for increased growth and flowering control. Pressure to vogue for early seed production are less. Problem with early mating are less. Full progeny trail will eventually be available to verify and early rouging. Improved seed is available before progeny testing is complete.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Seedling Seed Orchard</h4>
              <p className="text-justify">
                Seed orchard raised from seedlings produced from selected parents through natural or controlled pollination for create superior genetic source for collection of superior quality seeds by establishing from various provenance. Study on growth rate and parental character and to compare among species from different zone.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Hedge Stool</h4>
              <p className="text-justify">
                Coppicing is a traditional method of woodland management which exploits the capacity of many species of trees to put out new shoots from their stump or roots if cut down. In a coppiced wood, which is called a copse, young tree stems are repeatedly cut down to near ground level, resulting in a stool. New growth emerges, and after a number of years, the coppiced tree is harvested, and the cycle begins anew. Pollarding is a similar process carried out at a higher level on the tree in order to prevent grazing animals from eating new shoots.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Medicinal Plant Conservation</h4>
              <p className="text-justify">
                The field of plant conservation includes the study of plant decline and its causes, techniques to conserve rare and endangered plants. Medicinal plant conservation can be considered a part of conservation biology, a relatively young field that emphasizes the conservation of medicinal plant biodiversity and whole ecosystems, as opposed to the conservation of individual species.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Demonstration Plot</h4>
              <p className="text-justify">
                A demonstration plot is a field that can be used to teach, experiment, and share ideas about cultural practices.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Bambusetum</h4>
              <p className="text-justify">
                "Bambusetum" means a garden having a collection of bamboo plants. The goal of the project goal is to attach the potentials of bamboo in providing practical and effective use, protect the ecosystem and provide economic activities to the communities. The area covers species of bamboo planted. It will be very useful for future development of Bamboo in laterite soil to Department as well as farmer.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Agroforestry Model</h4>
              <p className="text-justify">
                Agroforestry is a land use system which integrate trees on farmlands and rural landscapes to enhance productivity, profitability, diversity and ecosystem sustainability. Agroforestry also generates significant employment opportunities.
              </p>
            </div>
          </div>
        </div> */}
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

