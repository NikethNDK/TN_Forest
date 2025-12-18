import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry,
  fullScreen = false 
}) => {
  const containerClasses = fullScreen 
    ? 'py-12 bg-gray-50 min-h-screen'
    : 'text-center py-12';

  return (
    <div className={fullScreen ? containerClasses : ''}>
      <div className={fullScreen ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8' : ''}>
        <div className={containerClasses}>
          <p className="text-red-600 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

