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
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwuUO0IJCPFlVe1pGmBrXqigS1rU9bFOTRKw&s" 
    },
    {
      title: "Advanced Institute of Wildlife Conservation",
      url: "https://www.aiwc.res.in/",
      icon: "https://www.aiwc.res.in/assets/images/emb.png"
    },
    {
      title: "TBGP",
      url: "https://tbgpccr.tn.gov.in/",
      icon: "https://tbgpccr.tn.gov.in/assets/img/right_logo.png"
    },
    {
      title: "Green Tamil Nadu Mission",
      url: "https://www.greentnmission.com/",
      icon: "https://www.greentnmission.com/images/app_logo.png"
    },
    { 
      title: "Tamil Nadu Agricultural University", 
      url: "https://tnau.ac.in", 
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Lfng8r-iR74ArNLtbOibDcRdRzRY5mJQ2w&s " 
    },
    {
      title: "Tamil Nadu State Biodiversity Board",
      url: "https://www.tnbb.tn.gov.in/",
      icon: "data:image/jpeg;base64,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"
    },
    {
      title: "Project Nilgiri Tar",
      url: " https://tnprojectnilgiritahr.com/",
      icon: "https://tnprojectnilgiritahr.com/wp-content/uploads/2023/11/Logo-removebg-preview-1.png"
    },
    {
      title: "Ministry of Environment, Forest and Climate Change",
      url: "https://moef.gov.in/",
      icon: "	https://moef.gov.in/storage/configuration-images/1734422674.1707280802.moef-logo-right.png"
    },
    {
      title: "Indian Council of Forestry Research and Education",
      url: "https://icfre.gov.in/hi/",
      icon: "https://icfre.gov.in/Images/icfre.gif"
    },
    {
      title: "Wildlife Institute of India",
      url: " https://www.wii.gov.in/",
      icon: "data:image/png;base64,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"
    },
    {
      title: "Tamil Nadu Climate Change Mission",
      url: "https://tnclimatechangemission.in/home/",
      icon: "https://tnclimatechangemission.in/images/logo/tnccm_logo_english.png"
    },
    {
      title: "Tamil Nadu forest Plantation Corporation Limited",
      url: "https://www.tafcorn.tn.gov.in/",
      icon: "data:image/jpeg;base64,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"
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
    <section className="py-8 sm:py-12 overflow-hidden" style={{ backgroundColor: '#ededed' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-content-heading mb-6 sm:mb-8">
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
              className="flex flex-col items-center bg-background-paper rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-border-primary hover:border-accent-dark"
            >
              <div className="mb-2 sm:mb-3 flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12">
                <img
                  src={link.icon}
                  alt={`${link.title} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h3 className="font-medium text-content-headingSecondary text-center text-xs sm:text-sm line-clamp-2">
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
              animationName: singleSetWidth > 0 ? 'scrollLeft' : 'none',
              animationDuration: singleSetWidth > 0 ? `${animationDuration}s` : '0s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
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
                className="flex flex-col items-center bg-background-paper rounded-lg p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-border-primary hover:border-accent-dark flex-shrink-0 w-[200px] min-h-[140px]"
              >
                <div className="mb-3 flex-shrink-0 flex items-center justify-center h-14 w-14">
                  <img
                    src={link.icon}
                    alt={`${link.title} Logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <h3 className="font-medium text-content-headingSecondary text-center text-sm leading-tight">
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

