import React from 'react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  overlay?: boolean;
  className?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  overlay = true,
  className = ''
}) => {
  return (
    <div 
      className={`relative py-20 md:py-24 bg-cover bg-center ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
      }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-green-900/70"></div>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {subtitle && (
          <p className="text-lg font-semibold text-lime-400 mb-2 uppercase tracking-widest">
            {subtitle}
          </p>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageBanner;

