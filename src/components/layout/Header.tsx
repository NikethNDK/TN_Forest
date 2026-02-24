import React from 'react';
import { colors } from '../../config/colors';
import { useDivisionTheme } from '../../providers/DivisionThemeProvider';

const Header: React.FC = () => {
  const { theme } = useDivisionTheme();
  const headerBg = theme.headerBg;
  const headerText = theme.headerText;
  const subtitleColor = headerText === colors.text.inverse ? 'rgba(255,255,255,0.9)' : colors.text.secondary;

  return (
    <header
      className="py-3 sm:py-4"
      style={{
        backgroundColor: headerBg,
      }}
    >
      <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl">
        <img
          src="/logo192.png"
          alt="Tamil Nadu Forest Department Research Wing Logo"
          className="w-14 h-14 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full flex-shrink-0"
        />
        <div className="text-center">
          <h1
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight"
            style={{ color: headerText }}
          >
            TAMIL NADU FOREST DEPARTMENT - RESEARCH DIVISION
          </h1>
          <p
            className="text-[0.65rem] sm:text-xs md:text-sm mt-0.5 sm:mt-1 max-w-2xl"
            style={{ color: subtitleColor }}
          >
            Advancing forest research, conservation, and sustainable development for a greener tomorrow
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

