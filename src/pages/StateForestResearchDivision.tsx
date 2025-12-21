import React from 'react';
import DivisionPage from '../components/divisions/DivisionPage';
import { stateForestResearchDivisionConfig } from '../divisions/stateForestResearchDivision.config';

/**
 * Thin wrapper component for State Forestry Research Institute Division page.
 * This wrapper exists for routing purposes and delegates all rendering
 * to the generic DivisionPage component with division-specific config.
 */
const StateForestResearchDivision: React.FC = () => {
  return <DivisionPage config={stateForestResearchDivisionConfig} />;
};

export default StateForestResearchDivision;

