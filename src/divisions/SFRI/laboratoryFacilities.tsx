import React from 'react';

export const LaboratoryFacilities: React.FC = () => {
  return (
    <div className="space-y-8">

      {/* Microbiology Laboratory */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Microbiology Laboratory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/microbiology-1.jpg"
              alt="Microbiology Laboratory"
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/SFRI/microbiology-2.jpg"
              alt="Microbiology Laboratory"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Molecular Laboratory */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Molecular Laboratory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
            src="/SFRI/molecular-1.jpg"
            alt="Molecular Laboratory"
            className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* phyto chemistry laboratory */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Phyto Chemistry Laboratory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src="/SFRI/phytochemistry-1.jpg"
            alt="Phyto Chemistry Laboratory"
            className="w-full h-auto"
          />
          </div>
        </div>
      </div>

      {/* tissue culture laboratory */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-green-600">Tissue Culture Laboratory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
            src="/SFRI/tissueculture-1.jpg"
            alt="Tissue Culture Laboratory"
            className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
            src="/SFRI/tissueculture-2.jpg"
            alt="Tissue Culture Laboratory"
            className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
