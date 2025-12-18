import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`mb-12 text-center ${className}`}>
      <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

