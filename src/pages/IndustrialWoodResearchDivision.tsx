import React from 'react';
import DivisionPage from '../components/divisions/DivisionPage';
import { industrialWoodResearchDivisionConfig } from '../divisions/industrialWoodResearchDivision.config';

/**
 * Thin wrapper component for Industrial Wood Research Division page.
 * This wrapper exists for routing purposes and delegates all rendering
 * to the generic DivisionPage component with division-specific config.
 */
const IndustrialWoodResearchDivision: React.FC = () => {
  return <DivisionPage config={industrialWoodResearchDivisionConfig} />;
};

export default IndustrialWoodResearchDivision;

