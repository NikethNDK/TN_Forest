import React from 'react';
import { colors } from '../../config/colors';

const Header: React.FC = () => {
  return (
    <header 
      className="py-3 sm:py-4" 
      style={{
        backgroundColor: colors.background.page,
        // Background image commented out for now
        // backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
      }}
    >
      {/* Content - Logo and text side by side */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <img 
          src="/logo192.png" 
          alt="Tamil Nadu Forest Department Research Wing Logo"
          className="w-14 h-14 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full flex-shrink-0" 
        />
        
        {/* Text Content */}
        <div className="text-center">
          {/* Title */}
          <h1 
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight"
            style={{ color: colors.text.heading }}
          >
            TAMIL NADU FOREST DEPARTMENT - RESEARCH WING
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-[0.65rem] sm:text-xs md:text-sm mt-0.5 sm:mt-1 max-w-2xl"
            style={{ color: colors.text.secondary }}
          >
            Advancing forest research, conservation, and sustainable development for a greener tomorrow
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

