import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 text-gray-500 ${className}`}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;

