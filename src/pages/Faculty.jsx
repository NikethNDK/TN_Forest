import React from 'react';

const Faculty = () => {
  const facultyMembers = [
    {
      name: "Thiru R.S.Rajakannappan",
      position: "Hon'ble Minister for Forests"
    },
    {
      name: "Tmt. Supriya Sahu, IAS",
      position: "Additional Chief Secretary to Government, Environment, Climate Change and Forests Department"
    },
    {
      name: "Thiru.Srinivas R. Reddy, IFS",
      position: "Principal Chief Conservator of Forests (HoFF) & CEO, CAMPA (FAC)"
    },
    {
      name: "Thiru Rakesh Kumar Dogra, IFS",
      position: "Principal Chief Conservator of Forests and Chief Wildlife Warden & Principal Chief Conservator of Forests (Project Tiger) (FAC)"
    },
    {
      name: "Thiru I Anwardeen, IFS",
      position: "Principal Chief Conservator of Forests (Research and Education) Chennai"
    }
  ];

  // Helper component for the faculty card
  const FacultyCard = ({ member, index }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-300 transition-colors duration-200">
      <div className="flex flex-col h-full">
        {/* Initials */}
        <div className="mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-sm">
              {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {member.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {member.position}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">
            Leadership & Governance
          </h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            The distinguished leadership team of the Tamil Nadu Forest Department.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facultyMembers.map((member, index) => (
            <FacultyCard key={index} member={member} index={index} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Faculty;