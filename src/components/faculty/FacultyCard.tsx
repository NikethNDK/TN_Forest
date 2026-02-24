import React from 'react';
import { User } from 'lucide-react';
import type { FacultyMember } from '../../types';

interface FacultyCardProps {
  member: FacultyMember;
}

const FacultyCard: React.FC<FacultyCardProps> = ({ member }) => {
  return (
    <div className="group relative bg-background-paper rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border-lightest">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-main to-accent-dark" />
      
      {/* Horizontal layout: Image + Content side by side */}
      <div className="flex items-center p-3">
        {/* Image section - circular frame */}
        <div className="relative w-28 h-28 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-lightest via-accent-lightest to-primary-lightest flex items-center justify-center overflow-hidden">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
          <div className="w-12 h-12 rounded-full bg-background-paper/60 flex items-center justify-center shadow-sm">
            <User className="w-6 h-6 text-primary-light" />
          </div>
          )}
        </div>
        
        {/* Content section */}
        <div className="flex-1 pl-4 flex flex-col justify-center">
          <h3 className="text-base font-semibold text-content-primary mb-1 leading-snug group-hover:text-primary-main transition-colors">
            {member.name}
          </h3>
          {member.position && (
            <p className="text-content-tertiary text-sm font-medium leading-relaxed">
              {member.position}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
