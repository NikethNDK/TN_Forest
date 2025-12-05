import React from 'react';
import FacultyCard from '../components/faculty/FacultyCard';
import { getFacultyContent } from '../services/admin/adminDataService';

const Faculty: React.FC = () => {
  const facultyContent = getFacultyContent();
  const facultyMembers = facultyContent.members;

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

