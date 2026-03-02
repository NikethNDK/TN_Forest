import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import { divisions } from '../../data/mockData';
import type { Division } from '../../types';
import { colors } from '../../config/colors';
import { defaultTheme } from '../../config/divisionThemes';
import { GENETIC_RESOURCE_TYPES } from '../../config/geneticResourceTypes';
import { useDivisionTheme } from '../../providers/DivisionThemeProvider';

interface NavItem {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const { theme } = useDivisionTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState<boolean>(false);
  const [isGeneticResourcesOpen, setIsGeneticResourcesOpen] = useState<boolean>(false);
  const [isBiodiversityOpen, setIsBiodiversityOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const geneticResourcesDropdownRef = useRef<HTMLDivElement>(null);
  const biodiversityDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDivisions = (): void => {
    setIsDivisionsOpen(!isDivisionsOpen);
  };

  const toggleGeneticResources = (): void => {
    setIsGeneticResourcesOpen(!isGeneticResourcesOpen);
  };

  const toggleBiodiversity = (): void => {
    setIsBiodiversityOpen(!isBiodiversityOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDivisionsOpen(false);
      }
      if (geneticResourcesDropdownRef.current && !geneticResourcesDropdownRef.current.contains(target)) {
        setIsGeneticResourcesOpen(false);
      }
      if (biodiversityDropdownRef.current && !biodiversityDropdownRef.current.contains(target)) {
        setIsBiodiversityOpen(false);
      }
    };

    if (isDivisionsOpen || isGeneticResourcesOpen || isBiodiversityOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDivisionsOpen, isGeneticResourcesOpen, isBiodiversityOpen]);

  // Navbar bar and links always use default theme (no division-specific navbar color)
  const navLinkStyle = {
    color: defaultTheme.navbarText,
  };

  const navLinkHoverClass = "px-4 py-3 text-sm font-medium transition-colors duration-200 hover:opacity-80";

  const cp = theme.contentPalette;
  const shopButtonStyle = {
    backgroundColor: colors.components.navbar.shopButtonBg,
    color: colors.components.navbar.shopButtonText,
  };
  const dropdownBg = cp?.bgPaper ?? colors.background.paper;
  const dropdownItemColor = cp?.textSecondary ?? colors.text.secondary;
  const dropdownItemHoverBg = cp?.primaryLightest ?? colors.primary.lightest;
  const dropdownItemHoverColor = cp?.heading ?? colors.text.headingSecondary;
  const dropdownTertiary = cp?.textTertiary ?? colors.text.tertiary;

  return (
    <nav 
      className="shadow-sm"
      style={{ backgroundColor: defaultTheme.navbarBg }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold"
              style={{ color: defaultTheme.navbarText }}
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
                    style={{ backgroundColor: dropdownBg }}
                  >
                    {divisions.map((division: Division) => (
                      <Link
                        key={division.id}
                        to={`/divisions/${division.slug}`}
                        className="block px-4 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                        style={{ color: dropdownItemColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                          e.currentTarget.style.color = dropdownItemHoverColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = dropdownItemColor;
                        }}
                        onClick={() => setIsDivisionsOpen(false)}
                      >
                        <div className="font-medium">{division.name}</div>
                        {division.description && (
                          <div className="text-xs mt-1" style={{ color: dropdownTertiary }}>
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

              {/* Genetic Resources Dropdown */}
              <div className="relative" ref={geneticResourcesDropdownRef}>
                <button
                  onClick={toggleGeneticResources}
                  className={`${navLinkHoverClass} flex items-center`}
                  style={navLinkStyle}
                >
                  Genetic Resources
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isGeneticResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGeneticResourcesOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-md shadow-lg py-1 z-50"
                    style={{ backgroundColor: dropdownBg }}
                  >
                    {GENETIC_RESOURCE_TYPES.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/genetic-resources?type=${item.slug}`}
                        className="block px-4 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                        style={{ color: dropdownItemColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                          e.currentTarget.style.color = dropdownItemHoverColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = dropdownItemColor;
                        }}
                        onClick={() => setIsGeneticResourcesOpen(false)}
                      >
                        <div className="font-medium">{item.label}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Bio Diversity Information Service Dropdown */}
              <div className="relative" ref={biodiversityDropdownRef}>
                <button
                  onClick={toggleBiodiversity}
                  className={`${navLinkHoverClass} flex items-center`}
                  style={navLinkStyle}
                >
                  Bio Diversity Information Service
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isBiodiversityOpen ? 'rotate-180' : ''}`} />
                </button>
                {isBiodiversityOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-md shadow-lg py-1 z-50"
                    style={{ backgroundColor: dropdownBg }}
                  >
                    {/* <button
                      type="button"
                      className="block w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                      style={{ color: dropdownItemColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                        e.currentTarget.style.color = dropdownItemHoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = dropdownItemColor;
                      }}
                      onClick={() => setIsBiodiversityOpen(false)}
                    >
                      <div className="font-medium">Visit Eco labs and Research Center</div>
                    </button> */}
                    <Link
                      to="/knowledge-eco-tourism"
                      className="block w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:opacity-80"
                      style={{ color: dropdownItemColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = dropdownItemHoverBg;
                        e.currentTarget.style.color = dropdownItemHoverColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = dropdownItemColor;
                      }}
                      onClick={() => setIsBiodiversityOpen(false)}
                    >
                      <div className="font-medium">Knowledge Eco Tourism</div>
                    </Link>
                  </div>
                )}
              </div>
              
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
              style={{ color: defaultTheme.navbarText }}
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
              style={{ backgroundColor: defaultTheme.navbarBg }}
            >
              <Link
                to="/"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: defaultTheme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link
                to="/about"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: defaultTheme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Divisions */}
              <div className="pt-2">
                <div 
                  className="px-4 py-3 text-base font-medium"
                  style={{ color: defaultTheme.navbarText }}
                >
                  Divisions
                </div>
                {divisions.map((division: Division) => (
                  <Link
                    key={division.id}
                    to={`/divisions/${division.slug}`}
                    className="block px-8 py-2 rounded-md text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: defaultTheme.navbarText, opacity: 0.9 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {division.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Genetic Resources */}
              <div className="pt-2">
                <div 
                  className="px-4 py-3 text-base font-medium"
                  style={{ color: defaultTheme.navbarText }}
                >
                  Genetic Resources
                </div>
                {GENETIC_RESOURCE_TYPES.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/genetic-resources?type=${item.slug}`}
                    className="block px-8 py-2 rounded-md text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: defaultTheme.navbarText, opacity: 0.9 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Bio Diversity Information Service */}
              <div className="pt-2">
                <div 
                  className="px-4 py-3 text-base font-medium"
                  style={{ color: defaultTheme.navbarText }}
                >
                  Bio Diversity Information Service
                </div>
                <button
                  type="button"
                  className="block w-full text-left px-8 py-2 rounded-md text-sm transition-colors duration-200 hover:opacity-80"
                  style={{ color: defaultTheme.navbarText, opacity: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Visit Eco labs and Research Center
                </button>
                <Link
                  to="/knowledge-eco-tourism"
                  className="block w-full text-left px-8 py-2 rounded-md text-sm transition-colors duration-200 hover:opacity-80"
                  style={{ color: defaultTheme.navbarText, opacity: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Knowledge Eco Tourism
                </Link>
              </div>
              
              <Link
                to="/publication"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: defaultTheme.navbarText }}
                onClick={() => setIsMenuOpen(false)}
              >
                Publication
              </Link>
              
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: defaultTheme.navbarText }}
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

