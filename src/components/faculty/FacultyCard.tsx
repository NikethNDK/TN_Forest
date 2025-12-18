import React from 'react';
import type { FacultyMember } from '../../types';

interface FacultyCardProps {
  member: FacultyMember;
}

const FacultyCard: React.FC<FacultyCardProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-green-900 mb-3 leading-tight">
          {member.name}
        </h3>
        {member.position && (
          <p className="text-gray-700 leading-relaxed">
            {member.position}
          </p>
        )}
      </div>
    </div>
  );
};

export default FacultyCard;
