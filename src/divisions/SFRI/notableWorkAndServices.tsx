import React from 'react';

export const NotableWorkAndServices: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Free Internship Programme for Students */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Free Internship Programme for Students</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Hands-on training in microbiology, tissue culture, molecular biology, phytochemistry, and soil science.</li>
            <li>Access to all major laboratory facilities at SFRI.</li>
            <li>Guided field visits to understand forestry practices and ecosystem management.</li>
            <li>Exposure to both research techniques and practical field applications.</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/intern-1.png"
              alt="Internship Programme"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/intern-2.png"
              alt="Internship Programme"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Educational Visits for College and School Students */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Educational Visits for College and School Students</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <p className="text-justify">
            College and school students are actively encouraged to visit the tree park, medicinal plant garden, nursery, and research plots, as well as key production units such as the vermicomposting unit, wood seasoning unit, and bamboo splitting machinery. 
            These educational visits provide students with an opportunity to learn about forestry practices, silvicultural techniques, and the medicinal value of local and indigenous plants. They also gain exposure to ongoing research experiments, sustainable resource management methods, and the wide array of facilities and field-based activities available in and around SFRI. Such experiential learning fosters curiosity, environmental awareness, and a deeper appreciation for forest ecosystems and conservation science.
          </p>
        </div>
      </div>

      {/* Research on Bamboo */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Research on Bamboo</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>A significant innovation carried out by SFRI is the use of bamboo as a reinforcement material, partially replacing steel by up to 50% in construction applications. Using this technique, structural slabs were successfully developed and tested.</li>
            <li>Demonstrating its practical utility, a bamboo hut and a bamboo-reinforced bus shelter at the Anna Nagar Stop in Kolapakkam were constructed using this technology.</li>
            <li>The bamboo hut is fully furnished, with all essential household furniture items made entirely from bamboo, showcasing its strength, versatility, and sustainability as an eco-friendly construction material.</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/bamboo-1.png"
              alt="Research on Bamboo"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/bamboo-2.png"
              alt="Research on Bamboo"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
