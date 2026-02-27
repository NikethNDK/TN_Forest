import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { NewsItem, Event } from '../../types';

interface RotatingConveyorProps {
  items: (NewsItem | Event)[];
  itemType: 'news' | 'event';
  isRightAligned?: boolean;
  variant?: 'light' | 'dark';
}

const CONVEYOR_HEIGHT = 384;
const SCROLL_DURATION_SEC = 20; // fixed duration per loop for consistent speed, no resize flicker

const RotatingConveyor: React.FC<RotatingConveyorProps> = ({
  items,
  itemType,
  isRightAligned = false,
  variant = 'light',
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [singleSetHeight, setSingleSetHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDark = variant === 'dark';

  const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

  // Measure once on mount (no ResizeObserver = keyframes never change = no flicker)
  useEffect(() => {
    if (!contentRef.current || items.length === 0) return;
    const measure = () => {
      if (!contentRef.current) return;
      const children = Array.from(contentRef.current.children) as HTMLElement[];
      const firstSetCount = isDark ? items.length : 2 * items.length - 1;
      if (children.length < firstSetCount) return;
      let height = 0;
      for (let i = 0; i < firstSetCount; i++) {
        if (children[i]) height += children[i].offsetHeight;
        if (i < firstSetCount - 1) height += 24;
      }
      if (height > 0) setSingleSetHeight(height);
    };
    const t = setTimeout(measure, 150);
    return () => clearTimeout(t);
  }, [items.length, isDark]);

  if (items.length === 0) {
    return (
      <div
        className={`text-center py-8 ${isDark ? 'text-white/70' : 'text-home-text-secondary'}`}
      >
        <p>No {itemType === 'news' ? 'news' : 'events'} available yet.</p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: `${CONVEYOR_HEIGHT}px` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>
        {`
          @keyframes conveyorScrollUp {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(0, -${singleSetHeight}px, 0); }
          }
        `}
      </style>
      <div
        ref={contentRef}
        className="space-y-6"
        style={{
          animation: singleSetHeight > 0 ? `conveyorScrollUp ${SCROLL_DURATION_SEC}s linear infinite` : 'none',
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id ?? index}-${Math.floor(index / items.length)}`}
            className={`group ${
              isDark
                ? 'py-3 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded'
                : 'py-3 rounded transition-colors cursor-pointer hover:bg-news-events-ticker-header/10 border-b border-home-card-border/30'
            }`}
          >
            <p
              className={`text-xs mb-1 flex items-center ${isRightAligned ? 'justify-end' : ''} ${isDark ? 'text-white/70' : 'text-home-text-secondary'}`}
            >
              {isRightAligned ? (
                <>{item.date} <Calendar className="h-3 w-3 ml-1" /></>
              ) : (
                <><Calendar className="h-3 w-3 mr-1" /> {item.date}</>
              )}
            </p>
            <h3
              className={`font-bold mb-2 text-sm xl:text-base ${isRightAligned ? 'text-right' : ''} transition-colors ${isDark ? 'text-white group-hover:text-white/90' : 'group-hover:opacity-90'}`}
              style={!isDark ? { color: '#37281b' } : undefined}
            >
              {item.title}
            </h3>
            <p
              className={`text-xs xl:text-sm mb-2 ${isRightAligned ? 'text-right' : ''} line-clamp-2 ${isDark ? 'text-white/80' : 'text-home-text-secondary'}`}
            >
              {item.excerpt}
            </p>
            {itemType === 'news' && (item as NewsItem).blogSlug && (
              <Link
                to={`/blog/${(item as NewsItem).blogSlug}`}
                className={`text-xs xl:text-sm font-semibold inline-flex items-center ${isRightAligned ? 'float-right' : ''} ${isDark ? 'text-white hover:text-white/90' : 'text-home-heading hover:text-home-heading/90'}`}
              >
                {isRightAligned ? (
                  <> <span className="mr-1 group-hover:mr-2 transition-all">←</span> Read more </>
                ) : (
                  <> Read more <span className="ml-1 group-hover:ml-2 transition-all">→</span> </>
                )}
              </Link>
            )}
            {!(itemType === 'news' && (item as NewsItem).blogSlug) && (item.link || item.pdfUrl) && (
              <a
                href={item.link || item.pdfUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs xl:text-sm font-semibold inline-flex items-center ${isRightAligned ? 'float-right' : ''} ${isDark ? 'text-white hover:text-white/90' : 'text-home-heading hover:text-home-heading/90'}`}
              >
                {item.pdfUrl && !item.link ? (
                  isRightAligned ? (<> <span className="mr-1 group-hover:mr-2 transition-all">←</span> View PDF </>) : (<> View PDF <span className="ml-1 group-hover:ml-2 transition-all">→</span> </>)
                ) : isRightAligned ? (
                  <> <span className="mr-1 group-hover:mr-2 transition-all">←</span> View details </>
                ) : (
                  <> Read more <span className="ml-1 group-hover:ml-2 transition-all">→</span> </>
                )}
              </a>
            )}
            {isRightAligned && <div className="clear-both" />}
            {index < duplicatedItems.length - 1 && !isDark && (
              <hr className="mt-6 border-home-card-border/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(RotatingConveyor);
