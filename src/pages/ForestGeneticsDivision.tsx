import React from 'react';
import DivisionPage from '../components/divisions/DivisionPage';
import { forestGeneticsDivisionConfig } from '../divisions/forestGeneticsDivision.config';

/**
 * Thin wrapper component for Forest Genetics Division page.
 * This wrapper exists for routing purposes and delegates all rendering
 * to the generic DivisionPage component with division-specific config.
 */
const ForestGeneticsDivision: React.FC = () => {
  return <DivisionPage config={forestGeneticsDivisionConfig} />;
};

export default ForestGeneticsDivision;

