import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  description,
  className = ''
}) => {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      {badge && (
        <p className="text-lg font-semibold text-lime-600 mb-2 uppercase tracking-widest">
          {badge}
        </p>
      )}
      {subtitle && (
        <p className="text-lg font-semibold text-lime-600 mb-2 uppercase tracking-widest">
          {subtitle}
        </p>
      )}
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold md:font-extrabold text-green-800 md:text-green-900 mb-4 md:mb-6">
        {title}
      </h1>
      {description && (
        <p className="text-sm md:text-xl text-gray-500 md:text-gray-600 max-w-xl md:max-w-4xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;

