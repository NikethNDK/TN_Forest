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

export type FacilityCategory = {
  id: string;
  title: string;
  content: React.ComponentType;
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
  facilityCategories?: FacilityCategory[];
};

export const stateForestResearchDivisionConfig: StateForestResearchDivisionConfig = {
  divisionSlug: 'state-forest-research',
  overview: (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
    {/* Focus Areas Image Section */}
    <div className="mb-8 border-t border-gray-200 pt-8">
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <img
            src="/SFRI_Home.png"
            alt="State Forest Research Institute Focus Areas"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
        {/* Background Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Background
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The <strong>State Forestry Research Institute (SFRI) Division</strong> was established on <strong>09.05.1992</strong>, through the redeployment of the erstwhile Energy Wood Division, Trichy, as per <strong>G.O. Ms. No. 648</strong> of the Environment & Forests Department, dated <strong>06.11.1991</strong>. Since its inception, the Division has functioned as the primary scientific research wing of the Tamil Nadu Forest Department, strengthening evidence-based forestry practices through a combination of laboratory investigations, nursery studies, and extensive field trials.
            </p>
          </div>
        </div>

        {/* Jurisdiction Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Jurisdiction
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The jurisdiction of the SFRI Division spans nine northern districts of Tamil Nadu: <strong>Chennai, Chengalpattu, Kancheepuram, Thiruvallur, Cuddalore, Vellore, Ranipet, Thirupathur, and Villupuram</strong>. The diversity of forest types, rainfall patterns, and soil conditions within this region provides an ideal landscape for undertaking long-term scientific experimentation on a wide range of tree species.
            </p>
          </div>
        </div>

        {/* Research Activities Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Research Activities
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              Over the years, the Division has established and maintained hundreds of scientific trials and experimental plots, covering multiple themes essential for improving plantation productivity, enhancing genetic quality, and identifying climate-resilient species. The primary categories of research undertaken include: <strong>introduction trials, clonal evaluation trials, progeny trials, seed orchard development, seed production areas (SPAs), spacing, silvicultural & fertilizer response trials, species suitability & long-term performance trials, nursery technology & biopriming studies, eco-friendly product development</strong>, to name a few.
            </p>
          </div>
        </div>

        {/* Research Centres Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Research Centres
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              There are <strong>nine Research Centres</strong> functioning under <strong>six Research Ranges</strong> within the State Forestry Research Institute Division. Together, these centres support and coordinate all major scientific investigations. The primary goals of the Division are to conduct advanced studies and research on:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Conservation and sustainable management of forests, biodiversity, and ecosystem services;</li>
              <li>Enhancement of productivity in natural forests, plantations, and trees outside forests to meet the needs of local communities and wood-based industries;</li>
              <li>Efficient and value-added utilisation of forest resources, including bio-based materials and eco-friendly products;</li>
              <li>Climate change mitigation and adaptation, with focus on resilient species, carbon sequestration, and sustainable land-use strategies.</li>
            </ul>
          </div>
        </div>


        {/* Forest Genetic Resources Tree Park Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Forest Genetic Resources Tree Park
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The Tree Park, established in <strong>2018</strong>, harbors nearly <strong>300 rare, endangered, and threatened tree species</strong> from the Eastern and Western Ghats, making it a significant repository of regional biodiversity. Each tree is accompanied by an information board detailing its scientific and vernacular names, classification, distribution, and medicinal properties. The park also includes a diverse collection of medicinal plants, a bamboo setum, a ficatorium, and a palmatum, further enhancing its appeal and supporting eco-tourism.
            </p>
          </div>
        </div>

        {/* Location & Approach Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Location & Approach
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              The Park is located near State Forest Research Institute, Kolapakkam on the Vandalur-Kelambakkam Highway. Its proximity to key transport points is as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>40 km from Central Railway station</li>
              <li>17 km from the Airport</li>
              <li>38 km from Egmore Railway station</li>
              <li>10 km from Tambaram</li>
              <li>1 km from Arignar Anna Zoological Park</li>
              <li>0.5 km from Kolapakkam Bus stop</li>
            </ul>
          </div>
        </div>

        {/* Park Details Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Details of the Park
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Open Hours:</strong> 9:00 a.m. to 5:30 p.m. (Tuesday - weekly holiday)</li>
              <li><strong>Entry fee:</strong> Rs. 20 per person</li>
              <li><strong>Special walking hours</strong> (Saturdays & Sundays):
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Morning: 6:00 a.m. to 8:00 a.m.</li>
                  <li>Evening: 4:00 p.m. to 6:00 p.m.</li>
                </ul>
              </li>
              <li>Newly introduced battery-operated buggy cart service (11-seater)</li>
            </ul>
          </div>
        </div>

        {/* Other Attractions and Facilities Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Other Attractions and Facilities of the Tree Park
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Water cascade and water fountain</li>
              <li>Stone benches placed across the park</li>
              <li>Visitor sheds and gazebos</li>
              <li>Assemblage of tree species from the Western and Eastern Ghats</li>
              <li>Bamboosetum and ficatorium collections</li>
              <li>Walking paths and nature trails</li>
              <li>Information boards and interpretive signage</li>
              <li>Children&apos;s play area with swings, merry-go-rounds, and other play items</li>
              <li>RO drinking water facility</li>
              <li>Check dam within the park area</li>
              <li>Interpretation centre for visitors</li>
              <li>Floral and Butterfly Garden</li>
            </ul>
          </div>
        </div>

        {/* Laboratory Facilities — full section on main page */}
        <div className="mb-12 border-t-4 border-green-600 pt-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Laboratory Facilities at SFRD</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              SFRI is equipped with state-of-the-art laboratories supporting microbiology, molecular biology, phytochemistry, and tissue culture—enabling cutting-edge research and quality assurance for forestry science.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Microbiology Laboratory</h3>
              <p className="text-gray-700 mb-4">
                Supports isolation, identification, and characterisation of forest microbes; soil and plant microbiology; and production of bio-inoculants for nursery and field applications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/microbiology-1.jpg" alt="Microbiology Laboratory" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/microbiology-2.jpg" alt="Microbiology Laboratory" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Molecular Laboratory</h3>
              <p className="text-gray-700 mb-4">
                Enables DNA fingerprinting, genetic diversity studies, and molecular markers for tree improvement and conservation of forest genetic resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/molecular-1.jpg" alt="Molecular Laboratory" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Phyto Chemistry Laboratory</h3>
              <p className="text-gray-700 mb-4">
                Focuses on extraction, characterisation, and standardisation of bioactive compounds from forest plants for medicinal and industrial applications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/phytochemistry-1.jpg" alt="Phyto Chemistry Laboratory" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Tissue Culture Laboratory</h3>
              <p className="text-gray-700 mb-4">
                Supports micropropagation of rare and high-value species, germplasm conservation, and production of quality planting material for research and afforestation programmes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/tissueculture-1.jpg" alt="Tissue Culture Laboratory" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/tissueculture-2.jpg" alt="Tissue Culture Laboratory" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Facilities — full section on main page */}
        <div className="mb-12 border-t-4 border-green-600 pt-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Other Facilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Beyond laboratories, SFRI offers mist chambers, wood seasoning, mechanised tree transplanting, and a heritage forestry library—supporting both research and public services.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Mist Chamber</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-2">
                <li>Provides a controlled high-humidity environment ideal for rooting cuttings and raising delicate seedlings.</li>
                <li>Reduces transpiration stress, improves survival rates, and ensures uniform rooting—making it highly beneficial for large-scale forestry propagation.</li>
              </ul>
              <div className="max-w-xl">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/mistchamber.jpg" alt="Mist Chamber" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Wood Seasoning Unit</h3>
              <p className="text-gray-700 mb-4">Seasoned wood products for construction and carpentry, reducing warping and improving durability.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/woodseason.png" alt="Wood Seasoning Unit" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/woodseason-1.png" alt="Seasoned Wood Product 1" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/woodseason-2.png" alt="Seasoned Wood Product 2" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Mechanized Tree Transplanting</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-2">
                <li>The Bobcat machine is available to the public on a rental basis at <strong>Rs. 5,000 per day</strong>.</li>
                <li>Service is provided upon signing a formal rental agreement. A refundable security deposit of <strong>Rs. 50,000</strong> is collected; a late fee of <strong>Rs. 10,000 per day</strong> applies for delay in return.</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/treetransplant-1.png" alt="Mechanized Tree Transplanting" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/treetransplant-2.png" alt="Mechanized Tree Transplanting" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 shadow-md border border-amber-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">SFRI Library</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-2">
                <li>One of the most valuable and historically rich forestry libraries in Tamil Nadu—a knowledge hub for researchers, scholars, forest officers, and students.</li>
                <li>Comprehensive collection of <strong>4,108+ books</strong>, plus departmental publications, project reports, seminar proceedings, and monitoring records.</li>
                <li>Rare, antique, and out-of-print volumes from the <strong>19th and early 20th centuries</strong>—an indispensable resource for forest science in the state.</li>
              </ul>
              <div className="max-w-2xl">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/library.png" alt="SFRI Library" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notable Work and Services — full section on main page */}
        <div className="mb-12 border-t-4 border-green-600 pt-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Notable Work &amp; Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              SFRI extends its expertise through internships, educational visits, and applied research—including pioneering bamboo-reinforced construction—creating real-world impact and building the next generation of forest scientists.
            </p>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Free Internship Programme for Students</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-2">
                <li>Hands-on training in microbiology, tissue culture, molecular biology, phytochemistry, and soil science.</li>
                <li>Access to all major laboratory facilities at SFRI.</li>
                <li>Guided field visits to understand forestry practices and ecosystem management.</li>
                <li>Exposure to both research techniques and practical field applications.</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/intern-1.png" alt="Internship Programme" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/intern-2.png" alt="Internship Programme" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Educational Visits for College and School Students</h3>
              <p className="text-gray-700 text-justify leading-relaxed">
                College and school students are actively encouraged to visit the tree park, medicinal plant garden, nursery, and research plots, as well as key production units such as the vermicomposting unit, wood seasoning unit, and bamboo splitting machinery.
                These educational visits provide students with an opportunity to learn about forestry practices, silvicultural techniques, and the medicinal value of local and indigenous plants. They also gain exposure to ongoing research experiments, sustainable resource management methods, and the wide array of facilities and field-based activities available in and around SFRI. Such experiential learning fosters curiosity, environmental awareness, and a deeper appreciation for forest ecosystems and conservation science.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Research on Bamboo</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-2">
                <li>SFRI has pioneered the use of <strong>bamboo as reinforcement material</strong>, partially replacing steel by up to <strong>50%</strong> in construction. Structural slabs were successfully developed and tested.</li>
                <li>A bamboo hut and a bamboo-reinforced bus shelter at Anna Nagar Stop, Kolapakkam, were constructed using this technology.</li>
                <li>The bamboo hut is fully furnished with household furniture made entirely from bamboo—showcasing strength, versatility, and sustainability as an eco-friendly construction material.</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/bamboo-1.png" alt="Research on Bamboo" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img src="/SFRI/bamboo-2.png" alt="Research on Bamboo" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Vision
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              To serve as a nodal centre of research in order to provide scientific support to the state and its people on matters related to forestry and climate change with particular emphasis on conservation, productivity, sustainable utilization and scientific management of natural resources while becoming a self-sustaining center of prominence and repute in the region.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">
            Mission
          </h3>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-justify">
              To focus on various applied research programs, evaluation of implementation of various schemes, policies, and up-gradation of skills of the personnel of the forest department in order to realize the vision of State Forestry Research Institute Division and Sustainable Development Goals (SDGs) of the sector.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  focusAreasImageSrc: '/SFRI_Home.png',
  stats: [
    { value: '9', label: 'Research Centres' },
    { value: '6', label: 'Research Ranges' },
    { value: '300+', label: 'Tree Species in Park' },
    { value: '100+', label: 'Scientific Trials' },
  ],
  centerImageFallbacks: {
    // Add center name to image mappings here as needed
    // Example: 'Research Center Name': '/path/to/image.jpg',
  },
  tollFreeFallback: {
    display: '1800-425-2313',
    tel: '18004252313',
  },
  contactFallbacks: {
    phone: '+91 44 1234 5681',
    emailDomain: 'tnfrd.gov.in',
  },
};
