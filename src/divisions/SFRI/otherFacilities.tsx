import React from 'react';

export const OtherFacilities: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Mist Chamber */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Mist Chamber</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provides a controlled high-humidity environment ideal for rooting cuttings and raising delicate seedlings.</li>
            <li>Reduces transpiration stress, improves survival rates, and ensures uniform rooting—making it highly beneficial for large-scale forestry propagation.</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src="/SFRI/mistchamber.jpg"
            alt="Mist Chamber"
            className="w-full h-auto"
          />
        </div>
        </div>
      </div>

      {/* Wood Seasoning Unit */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Wood Seasoning Unit</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src="/SFRI/woodseason.png"
            alt="Wood Seasoning Unit"
            className="w-full h-auto"
          />
        </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Two products of seasoned wood:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="/SFRI/woodseason-1.png"
                alt="Seasoned Wood Product 1"
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="/SFRI/woodseason-2.png"
                alt="Seasoned Wood Product 2"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mechanized Tree Transplanting */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Mechanized Tree Transplanting</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>The Bobcat machine is now made available to the public on a rental basis at Rs.5000 per day.</li>
            <li>The service is provided upon signing a formal rental agreement outlining the machine details, rental duration, terms of use, and liabilities. A refundable security deposit of Rs. 50,000 is collected prior to issuance, and a late fee of Rs.10, 000 per day is applicable for any delay in returning the machine beyond the agreed period.</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/treetransplant-1.png"
              alt="Mechanized Tree Transplanting"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/treetransplant-2.png"
              alt="Mechanized Tree Transplanting"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Library */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Library</h4>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-2">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>The State Forest Research Institute (SFRI) houses one of the most valuable and historically rich forestry libraries in Tamil Nadu, serving as an essential knowledge hub for researchers, scholars, forest officers, and students. The library maintains a comprehensive collection of more than 4108 books, supplemented by departmental publications, project reports, proceedings and summaries of seminars and conferences, monitoring and documentation records, and miscellaneous publications.</li>
            <li>This extensive repository reflects more than a century of documentation on forestry, silviculture, botany, ecology, and forest administration, making it an indispensable institutional resource for forest science in Tamil Nadu.</li>
            <li>The SFRI library holds several rare, antique, and out-of-print volumes of exceptional scholarly value, many of which date back to the 19th and early 20th centuries.</li>
          </ul>
        </div>
        <div className="rounded-lg overflow-hidden shadow-md max-w-2xl">
          <img
            src="/SFRI/library.png"
            alt="SFRI Library"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};
