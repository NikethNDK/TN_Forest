import React, { useState, useEffect, useRef } from 'react';
import type { ImportantLink } from '../../types';

const LinksCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation duration in seconds (adjust for speed - higher = slower)
  const scrollDuration = 40; // seconds for one complete cycle

  const importantLinks: ImportantLink[] = [
    { 
      title: "Tamil Nadu Forest Department", 
      url: "https://forests.tn.gov.in", 
      icon: "https://fsi.nic.in/img/resources/logo-hindi.png" 
    },
    { 
      title: "Ministry of Environment, Forest and Climate Change", 
      url: "https://moef.gov.in", 
      icon: "https://moef.gov.in/storage/configuration-images/1734422674.1707280802.moef-logo-right.png" 
    },
    { 
      title: "Indian Council of Forestry Research & Education", 
      url: "https://icfre.gov.in", 
      icon: "https://icfre.gov.in/Images/icfre.gif" 
    },
    { 
      title: "National Biodiversity Authority", 
      url: "https://nbaindia.org", 
      icon: "https://nbaindia.org/public/logo-nba.png" 
    },
    { 
      title: "Forest Survey of India", 
      url: "https://fsi.nic.in", 
      icon: "https://fsi.nic.in/fsi_logo.png" 
    },
    { 
      title: "Wildlife Institute of India", 
      url: "https://wii.gov.in", 
      icon: "https://wii.gov.in/uploads/settings/17560640993595.png" 
    },
    { 
      title: "Centre for Ecological Sciences (IISc)", 
      url: "#", 
      icon: "https://cdn.iisc.ac.in/assets/img/iisclogo.png" 
    },
    { 
      title: "Tamil Nadu Agricultural University", 
      url: "https://tnau.ac.in", 
      icon: "https://tnau.ac.in/wp-content/uploads/2022/11/logo_tnau_main.jpg" 
    }
  ];

  // Create seamless loop by duplicating items
  const duplicatedLinks = importantLinks.length > 0 ? [...importantLinks, ...importantLinks] : [];

  // Measure single set width for seamless loop
  useEffect(() => {
    if (contentRef.current && importantLinks.length > 0) {
      const measureWidth = () => {
        if (!contentRef.current) return;
        
        const children = Array.from(contentRef.current.children) as HTMLElement[];
        
        if (children.length >= importantLinks.length) {
          let width = 0;
          for (let i = 0; i < importantLinks.length; i++) {
            if (children[i]) {
              width += children[i].offsetWidth;
              if (i < importantLinks.length - 1) {
                width += 16; // gap-4 = 1rem = 16px
              }
            }
          }
          
          if (width > 0) {
            setSingleSetWidth(width);
          }
        }
      };
      
      const timeoutId = setTimeout(measureWidth, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [importantLinks.length]);

  // Calculate animation duration based on content width for consistent speed
  const animationDuration = singleSetWidth > 0 
    ? (singleSetWidth / 2000) * scrollDuration // Normalize to ~2000px reference width
    : scrollDuration;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-green-50 to-lime-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Important & Useful Links
        </h2>

        {/* Mobile Grid Layout */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {importantLinks.slice(0, 6).map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500"
            >
              <div className="mb-2 sm:mb-3 flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12">
                <img
                  src={link.icon}
                  alt={`${link.title} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h3 className="font-medium text-green-800 text-center text-xs sm:text-sm line-clamp-2">
                {link.title}
              </h3>
            </a>
          ))}
        </div>

        {/* Desktop Carousel */}
        <div 
          ref={containerRef}
          className="hidden lg:block relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* CSS Animation Styles */}
          <style>
            {`
              @keyframes scrollLeft {
                0% {
                  transform: translate3d(0, 0, 0);
                }
                100% {
                  transform: translate3d(-${singleSetWidth}px, 0, 0);
                }
              }
            `}
          </style>
          
          <div
            ref={contentRef}
            className="flex gap-4"
            style={{
              animation: singleSetWidth > 0 
                ? `scrollLeft ${animationDuration}s linear infinite`
                : 'none',
              animationPlayState: isPaused ? 'paused' : 'running',
              willChange: 'transform',
              width: 'fit-content'
            }}
          >
            {duplicatedLinks.map((link, index) => (
              <a
                key={`${link.title}-${Math.floor(index / importantLinks.length)}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500 flex-shrink-0 w-[200px] min-h-[140px]"
              >
                <div className="mb-3 flex-shrink-0 flex items-center justify-center h-14 w-14">
                  <img
                    src={link.icon}
                    alt={`${link.title} Logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <h3 className="font-medium text-green-800 text-center text-sm leading-tight">
                  {link.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Memoize component to prevent unnecessary re-renders when parent updates
export default React.memo(LinksCarousel);

