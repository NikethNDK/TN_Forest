import React from 'react';
import DivisionPage from '../components/divisions/DivisionPage';
import { agroForestryResearchDivisionConfig } from '../divisions/agroForestryResearchDivision.config';

/**
 * Thin wrapper component for Agro Forestry Research Division page.
 * This wrapper exists for routing purposes and delegates all rendering
 * to the generic DivisionPage component with division-specific config.
 */
const AgroForestryResearchDivision: React.FC = () => {
  return <DivisionPage config={agroForestryResearchDivisionConfig} />;
};

export default AgroForestryResearchDivision;

