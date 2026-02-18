import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import { GENETIC_RESOURCE_TYPES } from '../../config/geneticResourceTypes';

const CARD_WIDTH = 320;
const CARD_GAP = 24;
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function GeneticResourceCardImage({ slug, alt }: { slug: string; alt: string }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const ext = IMAGE_EXTENSIONS[extensionIndex];
  const src = `/genetic_resources/${slug}.${ext}`;

  const tryNextExtension = useCallback(() => {
    if (extensionIndex < IMAGE_EXTENSIONS.length - 1) {
      setExtensionIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  }, [extensionIndex]);

  if (failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-mission-vision-card-bg via-background-home-body to-mission-vision-card-bg flex items-center justify-center">
        <Sprout className="h-16 w-16 text-home-heading/20" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      onError={tryNextExtension}
    />
  );
}

const GeneticResourcesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, []);

  return (
    <section id="genetic-resources" className="py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout className="h-6 w-6 text-home-heading-secondary" />
          <span className="text-home-heading-secondary font-semibold text-sm uppercase tracking-wide">
            Resources
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-home-heading mb-2">
          Genetic Resources
        </h2>
        <div className="w-32 h-1 bg-gradient-gold rounded-full mx-auto mb-6 sm:mb-8" />
        <p className="text-center text-home-text-secondary text-sm mb-6 sm:mb-8 max-w-2xl mx-auto">
          Explore our diverse genetic resource types for forest conservation and research.
        </p>

        {/* Carousel with hidden scrollbar and nav buttons */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll genetic resources left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-home-heading/90 hover:bg-home-heading text-white shadow-elevated flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-home-heading focus:ring-offset-2"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll genetic resources right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-home-heading/90 hover:bg-home-heading text-white shadow-elevated flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-home-heading focus:ring-offset-2"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 sm:gap-6 min-w-max">
              {GENETIC_RESOURCE_TYPES.map((resourceType) => (
                <Link
                  key={resourceType.slug}
                  to={`/genetic-resources?type=${resourceType.slug}`}
                  className="group relative flex-shrink-0 w-[280px] sm:w-[320px] h-[200px] sm:h-[240px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-home-card-border"
                >
                  <GeneticResourceCardImage slug={resourceType.slug} alt={resourceType.label} />
                  {/* Text overlay — warm dark to match home */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-home-heading/90 via-home-heading/70 to-transparent px-4 py-4 sm:py-5 pt-8">
                    <h3 className="text-white text-base sm:text-lg font-serif font-semibold leading-tight group-hover:opacity-90 transition-opacity">
                      {resourceType.label}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneticResourcesSection;
