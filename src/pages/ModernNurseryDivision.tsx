import React from 'react';
import DivisionPage from '../components/divisions/DivisionPage';
import { modernNurseryDivisionConfig } from '../divisions/modernNurseryDivision.config';

/**
 * Thin wrapper component for Modern Nursery Division page.
 * This wrapper exists for routing purposes and delegates all rendering
 * to the generic DivisionPage component with division-specific config.
 */
const ModernNurseryDivision: React.FC = () => {
  return <DivisionPage config={modernNurseryDivisionConfig} />;
};

export default ModernNurseryDivision;

