import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'py-12 bg-gray-50 min-h-screen'
    : 'flex items-center justify-center py-12';

  return (
    <div className={fullScreen ? containerClasses : ''}>
      <div className={fullScreen ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8' : ''}>
        <div className={containerClasses}>
          <Loader2 className={`${sizeClasses[size]} animate-spin text-green-600`} />
          {message && (
            <span className="ml-3 text-gray-600">{message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

