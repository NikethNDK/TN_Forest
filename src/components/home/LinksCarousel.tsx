import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import type { ImportantLink } from '../../types';

const LinksCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [translateX, setTranslateX] = useState(0);
  const [isWidthMeasured, setIsWidthMeasured] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const singleSetWidthRef = useRef<number>(0);
  const scrollSpeed = 1.50; // pixels per frame (adjust for speed)

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
          // Measure first set of items (gap-6 adds 24px between items)
          for (let i = 0; i < importantLinks.length; i++) {
            if (children[i]) {
              width += children[i].offsetWidth;
              // Add spacing between items (except for the last one)
              if (i < importantLinks.length - 1) {
                width += 24; // gap-6 = 1.5rem = 24px
              }
            }
          }
          
          if (width > 0) {
            singleSetWidthRef.current = width;
            setIsWidthMeasured(true);
          }
        }
      };
      
      const timeoutId = setTimeout(measureWidth, 100);
      requestAnimationFrame(measureWidth);
      
      return () => {
        clearTimeout(timeoutId);
        setIsWidthMeasured(false);
      };
    } else {
      setIsWidthMeasured(false);
    }
  }, [importantLinks.length]);

  // Continuous scroll animation
  useEffect(() => {
    if (importantLinks.length === 0 || isPaused || !isWidthMeasured || singleSetWidthRef.current === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      setTranslateX((prev) => {
        let newX = prev - scrollSpeed;
        
        // When we've scrolled one full set, reset seamlessly
        if (newX <= -singleSetWidthRef.current) {
          newX = newX + singleSetWidthRef.current;
        }
        
        return newX;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [importantLinks.length, isPaused, isWidthMeasured, scrollSpeed]);

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-green-50 to-lime-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Important & Useful Links
        </h2>

        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {importantLinks.slice(0, 6).map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500"
            >
              <div className="mb-3 sm:mb-4 flex-shrink-0 flex items-center justify-center h-[50px] w-[50px]">
                <img
                  src={link.icon}
                  alt={`${link.title} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h3 className="font-semibold text-green-800 text-center mb-2 flex-grow text-sm sm:text-base">
                {link.title}
              </h3>
              <div className="flex justify-center items-center text-green-600 text-xs sm:text-sm">
                <span className="mr-1">Visit</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>

        <div 
          ref={containerRef}
          className="hidden lg:block relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={contentRef}
            className="flex gap-6"
            style={{
              transform: `translateX(${translateX}px)`,
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
                className="flex flex-col items-center bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500 flex-shrink-0 w-[280px] min-h-[220px]"
              >
                <div className="mb-4 flex-shrink-0 flex items-center justify-center h-[70px] w-[70px]">
                  <img
                    src={link.icon}
                    alt={`${link.title} Logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <h3 className="font-semibold text-green-800 text-center mb-2 flex-grow">
                  {link.title}
                </h3>
                <div className="flex justify-center items-center text-green-600 text-sm">
                  <span className="mr-1">Visit</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Memoize component to prevent unnecessary re-renders when parent updates
// Component has no props, so it only re-renders when internal state changes
export default React.memo(LinksCarousel);

