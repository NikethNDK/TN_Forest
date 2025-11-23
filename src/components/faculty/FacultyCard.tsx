import React from 'react';

interface FacultyMember {
  name: string;
  position: string;
}

interface FacultyCardProps {
  member: FacultyMember;
}

const FacultyCard: React.FC<FacultyCardProps> = ({ member }) => {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-300 transition-colors duration-200">
      <div className="flex flex-col h-full">
        {/* Initials */}
        <div className="mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-sm">
              {initials}
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
};

export default FacultyCard;

