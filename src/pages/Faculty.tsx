import React from 'react';
import FacultyCard from '../components/faculty/FacultyCard';

interface FacultyMember {
  name: string;
  position: string;
}

const Faculty: React.FC = () => {
  const facultyMembers: FacultyMember[] = [
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
            <FacultyCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faculty;

