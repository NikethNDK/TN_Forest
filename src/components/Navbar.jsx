import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import { divisions } from '../data/mockData';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    // { name: 'Information', path: '/information' },
    { name: 'Publication', path: '/publication' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDivisions = () => {
    setIsDivisionsOpen(!isDivisionsOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{backgroundColor: '#b9f041', position: 'sticky', top: '0', zIndex: 50}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-green-950 text-2xl font-bold">
              {/* TNFDRW */}
            </Link>
          </div>

           {/* Desktop Navigation */}
           <div className="hidden md:block flex-1">
             <div className="flex items-center justify-center space-x-8 ml-8">
               <Link
                 to="/"
                 className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200"
               >
                 Home
               </Link>

                             {/* Divisions Dropdown */}
               <div className="relative" ref={dropdownRef}>
                 <button
                   onClick={() => setIsDivisionsOpen(!isDivisionsOpen)}
                   className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200 flex items-center"
                 >
                   Divisions
                   <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDivisionsOpen ? 'rotate-180' : ''}`} />
                 </button>
                 
                 {isDivisionsOpen && (
                   <div 
                     className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50"
                   >
                     {divisions.map((division) => (
                       <Link
                         key={division.id}
                         to={`/divisions/${division.slug}`}
                         className="block px-4 py-3 text-sm text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-800 transition-colors duration-200"
                         onClick={() => setIsDivisionsOpen(false)}
                       >
                         <div className="font-medium">{division.name}</div>
                         <div className="text-xs text-gray-500 mt-1">{division.description}</div>
                       </Link>
                     ))}
                   </div>
                 )}
               </div>

               <Link
                 to="/about"
                 className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200"
               >
                 About
               </Link>
               
               {/* <Link
                 to="/information"
                 className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200"
               >
                 Information
               </Link> */}
               
               <Link
                 to="/publication"
                 className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200"
               >
                 Publication
               </Link>
               
               <Link
                 to="/contact"
                 className="text-green-950 hover:text-green-200 px-4 py-3 text-base font-medium transition-colors duration-200"
               >
                 Contact Us
               </Link>

              {/* Shop Button */}
              <Link
                to="/shop"
                className="bg-forest-green-700 hover:bg-forest-green-600 text-white px-6 py-3 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shop
              </Link>
            </div>
          </div>

          {/* Spacer for right side to balance with logo */}
          <div className="hidden md:block flex-shrink-0 w-20"></div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-forest-green-700 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

         {/* Mobile Navigation */}
         {isMenuOpen && (
           <div className="md:hidden">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-forest-green-800">
               <Link
                 to="/"
                 className="text-white hover:text-green-200 block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Home
               </Link>
               
               <Link
                 to="/about"
                 className="text-white hover:text-green-200 block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={() => setIsMenuOpen(false)}
               >
                 About
               </Link>
               
               {/* Mobile Divisions */}
               <div className="pt-2">
                 <div className="text-white px-4 py-3 text-base font-medium">Divisions</div>
                 {divisions.map((division) => (
                   <Link
                     key={division.id}
                     to={`/divisions/${division.slug}`}
                     className="text-green-100 hover:text-green-200 block px-8 py-2 rounded-md text-sm transition-colors duration-200"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     {division.name}
                   </Link>
                 ))}
               </div>
               
               {/* <Link
                 to="/information"
                 className="text-white hover:text-green-200 block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Information
               </Link> */}
               
               <Link
                 to="/publication"
                 className="text-white hover:text-green-200 block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Publication
               </Link>
               
               <Link
                 to="/contact"
                 className="text-white hover:text-green-200 block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Contact Us
               </Link>

              <Link
                to="/shop"
                className="bg-forest-green-700 hover:bg-forest-green-600 text-white px-4 py-3 rounded-md text-base font-medium flex items-center transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
