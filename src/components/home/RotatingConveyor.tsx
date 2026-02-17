import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { NewsItem, Event } from '../../types';

interface RotatingConveyorProps {
  items: (NewsItem | Event)[];
  itemType: 'news' | 'event';
  isRightAligned?: boolean;
  variant?: 'light' | 'dark';
}

const RotatingConveyor: React.FC<RotatingConveyorProps> = ({ items, itemType, isRightAligned = false, variant = 'light' }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [singleSetHeight, setSingleSetHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation duration in seconds (adjust for speed - higher = slower)
  const scrollDuration = 15; // seconds for one complete cycle

  // Create seamless loop by duplicating items
  const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

  // Measure single set height for seamless loop
  useEffect(() => {
    if (contentRef.current && items.length > 0) {
      const measureHeight = () => {
        if (!contentRef.current) return;
        
        const children = Array.from(contentRef.current.children) as HTMLElement[];
        
        if (children.length >= items.length) {
          let height = 0;
          for (let i = 0; i < items.length; i++) {
            if (children[i]) {
              height += children[i].offsetHeight;
              if (i < items.length - 1) {
                height += 24; // space-y-6 = 1.5rem = 24px
              }
            }
          }
          
          if (height > 0) {
            setSingleSetHeight(height);
          }
        }
      };
      
      // Measure after a short delay to ensure rendering is complete
      const timeoutId = setTimeout(measureHeight, 100);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [items]);

  const isDark = variant === 'dark';

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-white/70' : 'text-home-text-secondary'}`}>
        <p>No {itemType === 'news' ? 'news' : 'events'} available yet.</p>
      </div>
    );
  }

  // Calculate animation duration based on content height for consistent speed
  const animationDuration = singleSetHeight > 0 
    ? (singleSetHeight / 500) * scrollDuration // Normalize to ~500px reference height
    : scrollDuration;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '384px' }} // max-h-96 equivalent
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* CSS Animation Styles */}
      <style>
        {`
          @keyframes scrollUp {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(0, -${singleSetHeight}px, 0);
            }
          }
        `}
      </style>
      <div
        ref={contentRef}
        className="space-y-6"
        style={{
          animation: singleSetHeight > 0 
            ? `scrollUp ${animationDuration}s linear infinite`
            : 'none',
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isNews = itemType === 'news';
          
          return (
            <div
              key={`${item.id || index}-${Math.floor(index / items.length)}`}
              className={`group ${isDark ? 'py-3 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded' : 'py-3 rounded transition-colors cursor-pointer hover:bg-news-events-ticker-header/10 border-b border-home-card-border/30'}`}
            >
              <p className={`text-xs mb-1 flex items-center ${isRightAligned ? 'justify-end' : ''} ${isDark ? 'text-white/70' : 'text-home-text-secondary'}`}>
                {isRightAligned ? (
                  <>
                    {item.date} <Calendar className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    <Calendar className="h-3 w-3 mr-1" /> {item.date}
                  </>
                )}
              </p>
              <h3 className={`font-bold mb-2 text-sm xl:text-base ${isRightAligned ? 'text-right' : ''} transition-colors ${isDark ? 'text-white group-hover:text-white/90' : 'text-home-heading-secondary group-hover:text-home-heading'}`}>
                {item.title}
              </h3>
              <p className={`text-xs xl:text-sm mb-2 ${isRightAligned ? 'text-right' : ''} line-clamp-2 ${isDark ? 'text-white/80' : 'text-home-text-secondary'}`}>
                {item.excerpt}
              </p>
              {(item.link || item.pdfUrl) && (
                <a
                  href={item.link || item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs xl:text-sm font-semibold inline-flex items-center ${isRightAligned ? 'float-right' : ''} ${isDark ? 'text-white hover:text-white/90' : 'text-home-heading hover:text-home-heading/90'}`}
                >
                  {item.pdfUrl && !item.link ? (
                    isRightAligned ? (
                      <>
                        <span className="mr-1 group-hover:mr-2 transition-all">←</span>
                        View PDF
                      </>
                    ) : (
                      <>
                        View PDF
                        <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                      </>
                    )
                  ) : isRightAligned ? (
                    <>
                      <span className="mr-1 group-hover:mr-2 transition-all">←</span>
                      View details
                    </>
                  ) : (
                    <>
                      Read more
                      <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                    </>
                  )}
                </a>
              )}
              {isRightAligned && <div className="clear-both"></div>}
              {index < duplicatedItems.length - 1 && !isDark && (
                <hr className="mt-6 border-home-card-border/40" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders when parent updates
// Props are stable (items array reference changes only when data updates)
export default React.memo(RotatingConveyor);

