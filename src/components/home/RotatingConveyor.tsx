import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { NewsItem, Event } from '../../types';

interface RotatingConveyorProps {
  items: (NewsItem | Event)[];
  itemType: 'news' | 'event';
  isRightAligned?: boolean;
}

const RotatingConveyor: React.FC<RotatingConveyorProps> = ({ items, itemType, isRightAligned = false }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isHeightMeasured, setIsHeightMeasured] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const singleSetHeightRef = useRef<number>(0);
  const scrollSpeed = 0.75; // pixels per frame (adjust for speed)

  // Create seamless loop by duplicating items
  const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

  // Measure single set height for seamless loop
  useEffect(() => {
    if (contentRef.current && items.length > 0) {
      // Wait for content to be fully rendered
      const measureHeight = () => {
        if (!contentRef.current) return;
        
        // Get all child elements
        const children = Array.from(contentRef.current.children) as HTMLElement[];
        
        if (children.length >= items.length) {
          let height = 0;
          // Measure first set of items (space-y-6 adds 24px between items)
          for (let i = 0; i < items.length; i++) {
            if (children[i]) {
              height += children[i].offsetHeight;
              // Add spacing between items (except for the last one)
              if (i < items.length - 1) {
                height += 24; // space-y-6 = 1.5rem = 24px
              }
            }
          }
          
          if (height > 0) {
            singleSetHeightRef.current = height;
            setIsHeightMeasured(true); // Trigger animation to start
          }
        }
      };
      
      // Measure after a short delay to ensure rendering is complete
      const timeoutId = setTimeout(measureHeight, 100);
      requestAnimationFrame(measureHeight);
      
      return () => {
        clearTimeout(timeoutId);
        setIsHeightMeasured(false); // Reset when items change
      };
    } else {
      setIsHeightMeasured(false);
    }
  }, [items]);

  // Continuous scroll animation
  useEffect(() => {
    if (items.length === 0 || isPaused || !isHeightMeasured || singleSetHeightRef.current === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      setTranslateY((prev) => {
        let newY = prev - scrollSpeed;
        
        // When we've scrolled one full set, reset seamlessly
        // Add back the height to create seamless loop (since newY is negative)
        if (newY <= -singleSetHeightRef.current) {
          newY = newY + singleSetHeightRef.current;
        }
        
        return newY;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [items.length, isPaused, isHeightMeasured, scrollSpeed]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {itemType === 'news' ? 'news' : 'events'} available yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '384px' }} // max-h-96 equivalent
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      <div
        ref={contentRef}
        className="space-y-6"
        style={{
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {duplicatedItems.map((item, index) => {
          const isNews = itemType === 'news';
          
          return (
            <div
              key={`${item.id || index}-${Math.floor(index / items.length)}`}
              className="group"
            >
              <p className={`text-xs text-gray-500 mb-1 flex items-center ${isRightAligned ? 'justify-end' : ''}`}>
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
              <h3 className={`font-bold text-green-800 mb-2 text-sm xl:text-base ${isRightAligned ? 'text-right' : ''} ${isNews ? 'group-hover:text-green-600' : 'group-hover:text-lime-600'} transition-colors`}>
                {item.title}
              </h3>
              <p className={`text-gray-600 text-xs xl:text-sm mb-2 ${isRightAligned ? 'text-right' : ''} line-clamp-2`}>
                {item.excerpt}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-green-600 hover:text-lime-600 text-xs xl:text-sm font-semibold inline-flex items-center ${isRightAligned ? 'float-right' : ''}`}
                >
                  {isRightAligned ? (
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
              {index < duplicatedItems.length - 1 && (
                <hr className="mt-6 border-gray-200" />
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

