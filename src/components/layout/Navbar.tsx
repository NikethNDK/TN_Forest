import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import { divisions } from '../../data/mockData';
import type { Division } from '../../types';
import { colors } from '../../config/colors';
import { useDivisionTheme } from '../../providers/DivisionThemeProvider';

interface NavItem {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const { theme } = useDivisionTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Publication', path: '/publication' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDivisions = (): void => {
    setIsDivisionsOpen(!isDivisionsOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDivisionsOpen(false);
      }
    };

    if (isDivisionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDivisionsOpen]);

  // Inline styles using division theme
  const navLinkStyle = {
    color: theme.navbarText,
  };

  const navLinkHoverClass = "px-4 py-3 text-base font-medium transition-colors duration-200 hover:opacity-80";

  const shopButtonStyle = {
    backgroundColor: colors.accent.main, // Lime accent for pop
    color: colors.primary.darkest, // Dark text on lime
  };

  return (
    <nav 
      className="shadow-lg sticky top-0 z-50"
      style={{ backgroundColor: theme.navbarBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold"
              style={{ color: theme.navbarText }}
            >
              {/* TNFDRW */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-8 ml-8">
              <Link
                to="/"
                className={navLinkHoverClass}
                style={navLinkStyle}
              >
                Home
              </Link>

              {/* Divisions Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDivisions}
                  className={`${navLinkHoverClass} flex items-center`}
                  style={navLinkStyle}
                >
                  Divisions
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDivisionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDivisionsOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50"
                    style={{ backgroundColor: colors.background.paper }}
                  >
                    {divisions.map((division: Division) => (
                      <Link
                        key={division.id}
                        to={`/divisions/${division.slug}`}
                        className="block px-4 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                        style={{ 
                          color: colors.text.secondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary.lightest;
                          e.currentTarget.style.color = colors.text.headingSecondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.text.secondary;
                        }}
                        onClick={() => setIsDivisionsOpen(false)}
                      >
                        <div className="font-medium">{division.name}</div>
                        {division.description && (
                          <div 
                            className="text-xs mt-1"
                            style={{ color: colors.text.tertiary }}
                          >
                            {division.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={navLinkHoverClass}
                style={navLinkStyle}
              >
                About
              </Link>
              
              <Link
                to="/publication"
                className={navLinkHoverClass}
                style={navLinkStyle}
              >
                Publication
              </Link>
              
              <Link
                to="/contact"
                className={navLinkHoverClass}
                style={navLinkStyle}
              >
                Contact Us
              </Link>

              {/* Shop Button */}
              <Link
                to="/shop"
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center hover:opacity-90"
                style={shopButtonStyle}
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Eco-Store
              </Link>
            </div>
          </div>

          {/* Spacer for right side to balance with logo */}
          <div className="hidden md:block flex-shrink-0 w-20"></div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md transition-colors duration-200 hover:opacity-80"
              style={{ color: theme.navbarText }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
              style={{ backgroundColor: theme.navbarBg }}
            >
              <Link
                to="/"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: theme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link
                to="/about"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: theme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Divisions */}
              <div className="pt-2">
                <div 
                  className="px-4 py-3 text-base font-medium"
                  style={{ color: theme.navbarText }}
                >
                  Divisions
                </div>
                {divisions.map((division: Division) => (
                  <Link
                    key={division.id}
                    to={`/divisions/${division.slug}`}
                    className="block px-8 py-2 rounded-md text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: theme.navbarText, opacity: 0.9 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {division.name}
                  </Link>
                ))}
              </div>
              
              <Link
                to="/publication"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: theme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                Publication
              </Link>
              
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: theme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              <Link
                to="/shop"
                className="px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 hover:opacity-90"
                style={shopButtonStyle}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Eco-Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

