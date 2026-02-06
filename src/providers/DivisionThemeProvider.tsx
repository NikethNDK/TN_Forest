import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { divisions } from '../data/mockData';
import { getDivisionTheme, type DivisionTheme } from '../config/divisionThemes';

interface DivisionThemeContextType {
  currentDivision: string | null;
  theme: DivisionTheme;
}

const DivisionThemeContext = createContext<DivisionThemeContextType | undefined>(undefined);

export const DivisionThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const { currentDivision, theme } = useMemo(() => {
    // Check if we're on a division page
    // Matches routes like /divisions/forest-genetics or /divisions/forest-genetics/gallery
    const divisionSlug = location.pathname.match(/\/divisions\/([^/]+)/)?.[1];
    
    if (divisionSlug) {
      // Verify it's a valid division
      const division = divisions.find(d => d.slug === divisionSlug);
      if (division) {
        return {
          currentDivision: divisionSlug,
          theme: getDivisionTheme(divisionSlug),
        };
      }
    }
    
    // Default theme for home page and other routes
    return {
      currentDivision: null,
      theme: getDivisionTheme(null),
    };
  }, [location.pathname]);

  return (
    <DivisionThemeContext.Provider value={{ currentDivision, theme }}>
      {children}
    </DivisionThemeContext.Provider>
  );
};

export const useDivisionTheme = (): DivisionThemeContextType => {
  const context = useContext(DivisionThemeContext);
  if (context === undefined) {
    throw new Error('useDivisionTheme must be used within a DivisionThemeProvider');
  }
  return context;
};
