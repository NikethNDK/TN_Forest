import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar } from 'lucide-react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import ShopPreviewSection from '../components/home/ShopPreviewSection';
import GeneticResourcesSection from '../components/home/GeneticResourcesSection';
import LinksCarousel from '../components/home/LinksCarousel';
import WelcomeModal from '../components/home/WelcomeModal';
import RotatingConveyor from '../components/home/RotatingConveyor';
import { subscribeToNews, subscribeToEvents } from '../services/firebase/newsEventService';
import type { NewsItem, Event } from '../types';

const HERO_SHRINK_SCROLL_THRESHOLD = 100;
const CHROME_HEIGHT_FALLBACK = 180;
const HERO_SHRINK_DURATION_MS = 350;

type Rect = { top: number; left: number; width: number; height: number };

type HeroPhase = 'expanded' | 'shrinking' | 'shrunk' | 'expanding';

const roundRect = (r: DOMRect): Rect => ({
  top: Math.round(r.top),
  left: Math.round(r.left),
  width: Math.round(r.width),
  height: Math.round(r.height),
});

const getFullViewportRect = (): Rect => {
  const chromeHeight =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--chrome-height')
    ) || CHROME_HEIGHT_FALLBACK;
  const top = Math.round(chromeHeight);
  return {
    top,
    left: 0,
    width: window.innerWidth,
    height: Math.round(window.innerHeight - chromeHeight),
  };
};

const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [heroPhase, setHeroPhase] = useState<HeroPhase>('expanded');
  const [heroAnimation, setHeroAnimation] = useState<{ from: Rect; to: Rect | null } | null>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const gridCarouselRef = useRef<HTMLDivElement>(null);
  const heroPhaseRef = useRef<HeroPhase>(heroPhase);
  const transitionEndHandledRef = useRef(false);

  useEffect(() => {
    heroPhaseRef.current = heroPhase;
  }, [heroPhase]);

  useEffect(() => {
    const unsubscribeNews = subscribeToNews(
      (newsItems) => {
        setLatestNews(newsItems);
      },
      (error) => {
        console.error('Error in news subscription:', error);
      }
    );

    const unsubscribeEvents = subscribeToEvents(
      (eventItems) => {
        setEvents(eventItems);
      },
      (error) => {
        console.error('Error in events subscription:', error);
      }
    );

    return () => {
      unsubscribeNews();
      unsubscribeEvents();
    };
  }, []);

  // Desktop-only scroll listener: read phase from ref so effect stays stable
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    let rafId: number | null = null;

    const handleScroll = (): void => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        const phase = heroPhaseRef.current;
        if (phase === 'shrinking' || phase === 'expanding') return;
        if (scrollY < HERO_SHRINK_SCROLL_THRESHOLD) {
          if (phase === 'shrunk') {
            const rect = gridCarouselRef.current?.getBoundingClientRect();
            if (rect) {
              transitionEndHandledRef.current = false;
              setHeroAnimation({ from: roundRect(rect), to: null });
              setHeroPhase('expanding');
            }
          }
          return;
        }
        if (phase === 'expanded') {
          const rect = heroWrapperRef.current?.getBoundingClientRect();
          if (rect) {
            transitionEndHandledRef.current = false;
            setHeroAnimation({ from: roundRect(rect), to: null });
            setHeroPhase('shrinking');
          }
        }
      });
    };

    const attachScroll = (): void => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    };
    const detachScroll = (): void => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
      setHeroPhase('expanded');
      setHeroAnimation(null);
    };

    const handleMediaChange = (): void => {
      if (mq.matches) attachScroll();
      else detachScroll();
    };

    if (mq.matches) attachScroll();
    mq.addEventListener('change', handleMediaChange);
    return () => {
      mq.removeEventListener('change', handleMediaChange);
      if (mq.matches) {
        window.removeEventListener('scroll', handleScroll);
        if (rafId != null) cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // After phase becomes shrinking/expanding, set animation target so transition runs
  useEffect(() => {
    if (heroPhase !== 'shrinking' && heroPhase !== 'expanding') return;
    const id = requestAnimationFrame(() => {
      if (heroPhase === 'shrinking' && placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        setHeroAnimation((prev) => (prev ? { ...prev, to: roundRect(rect) } : null));
      } else if (heroPhase === 'expanding') {
        setHeroAnimation((prev) => (prev ? { ...prev, to: getFullViewportRect() } : null));
      }
    });
    return () => cancelAnimationFrame(id);
  }, [heroPhase]);

  const heroHeightStyle: React.CSSProperties = {
    height: `calc(100vh - var(--chrome-height, ${CHROME_HEIGHT_FALLBACK}px))`,
    minHeight: `calc(100vh - var(--chrome-height, ${CHROME_HEIGHT_FALLBACK}px))`,
  };

  const heroFixedStyle = (rect: Rect): React.CSSProperties => ({
    position: 'fixed',
    zIndex: 40,
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    transition: `top ${HERO_SHRINK_DURATION_MS}ms ease-out, left ${HERO_SHRINK_DURATION_MS}ms ease-out, width ${HERO_SHRINK_DURATION_MS}ms ease-out, height ${HERO_SHRINK_DURATION_MS}ms ease-out`,
  });

  const handleHeroTransitionEnd = (e: React.TransitionEvent): void => {
    if (e.propertyName !== 'height' && e.propertyName !== 'width') return;
    if (transitionEndHandledRef.current) return;
    if (heroPhase === 'shrinking') {
      transitionEndHandledRef.current = true;
      setHeroPhase('shrunk');
      setHeroAnimation(null);
      return;
    }
    if (heroPhase === 'expanding') {
      transitionEndHandledRef.current = true;
      setHeroPhase('expanded');
      setHeroAnimation(null);
    }
  };

  return (
    <div className="min-h-screen">
      <WelcomeModal latestNews={latestNews} events={events} />
      
      {/* Mobile Layout - Stacked (no sticky behavior) */}
      <div className="lg:hidden">
        <div className="px-4 py-4">
          <RotatingImageStrip />
        </div>
        <NewsAndInfoSection latestNews={latestNews} events={events} />
      </div>

      {/* Desktop Layout - scroll-shrink hero then 3-column grid */}
      <div className="hidden lg:block">
        {heroPhase !== 'shrunk' && (
          <div
            ref={heroPhase === 'expanding' ? undefined : heroWrapperRef}
            className="flex flex-col w-full overflow-hidden"
            style={
              (heroPhase === 'shrinking' || heroPhase === 'expanding') && heroAnimation
                ? heroFixedStyle(heroAnimation.to ?? heroAnimation.from)
                : heroHeightStyle
            }
            onTransitionEnd={handleHeroTransitionEnd}
          >
            <div className="flex-1 min-h-0 w-full">
              <RotatingImageStrip fillHeight />
            </div>
          </div>
        )}

        <div className="relative">
          <div className="grid grid-cols-12 gap-4 xl:gap-6 px-4 xl:px-6 py-6">
            {/* Left Sidebar - Recent Events (Sticky) */}
            <div className="col-span-2 xl:col-span-3  rounded-2xl px-3 xl:px-4 py-6">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-news-events-ticker-body rounded-2xl shadow-elevated overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-news-events-ticker-header">
                    <Calendar className="h-5 w-5 text-white shrink-0" />
                    <h2 className="font-serif font-semibold text-white text-sm">
                      Recent Events
                    </h2>
                  </div>
                  <div className="p-4 xl:p-6 pr-1">
                    <RotatingConveyor items={events} itemType="event" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Carousel when shrunk (unless expanding), placeholder otherwise */}
            <div className="col-span-8 xl:col-span-6 bg-background-home-body rounded-2xl px-4 xl:px-6 py-6">
              {heroPhase === 'shrunk' ? (
                <div ref={gridCarouselRef} className="mb-8">
                  <RotatingImageStrip />
                </div>
              ) : (
                <div
                  ref={placeholderRef}
                  className="mb-8 h-72 xl:h-[400px] w-full invisible"
                  aria-hidden="true"
                />
              )}

              {/* Center Text Content */}
              <div className="text-center py-8 xl:py-10 px-2 lg:px-4 max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-serif font-bold text-home-heading mb-6">
                    Tamil Nadu Forest Department - Research Wing
                  </h1>
                  <div className="w-24 h-1 bg-gradient-gold rounded-full mx-auto mb-8"></div>
                </div>

                <p className="text-sm xl:text-base text-home-text leading-relaxed mb-6 max-w-4xl mx-auto">
                  Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.
                </p>

                <p className="text-sm xl:text-base text-home-text leading-relaxed mb-6 max-w-4xl mx-auto">
                  Our multidisciplinary team of researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
                </p>

                <div className="flex justify-center mb-8">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-shop-button-bg hover:opacity-90 transition-opacity shadow-soft border border-border-default"
                  >
                    Learn more about us
                  </Link>
                </div>

                {/* Mission & Vision cards */}
                <div className="space-y-6 text-left">
                  <div className="bg-mission-vision-card-bg rounded-xl p-6 shadow-soft border border-border-default hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-xl font-serif font-semibold text-home-heading-secondary mb-3">Our Mission</h3>
                    <p className="text-home-text-secondary leading-relaxed text-sm xl:text-base">
                      To embrace innovation in soil health through biofertilizer solutions, produce high-quality climate-resilient seedlings for reforestation, supply superior forest tree seeds to stakeholders, and focus on conservation of rare, endangered, and threatened species for long-term environmental sustainability.
                    </p>
                  </div>
                  <div className="bg-mission-vision-card-bg rounded-xl p-6 shadow-soft border border-border-default hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-xl font-serif font-semibold text-home-heading-secondary mb-3">Our Vision</h3>
                    <p className="text-home-text-secondary leading-relaxed text-sm xl:text-base">
                      To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production, advanced microbial inoculants, production of climate-resilient seedlings, supply of quality forest tree seeds, and fostering sustainable management practices in RET species for long-term ecological benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Latest News (Sticky) */}
            <div className="col-span-2 xl:col-span-3  rounded-2xl px-3 xl:px-4 py-6">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-news-events-ticker-body rounded-2xl shadow-elevated overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-news-events-ticker-header justify-end">
                    <h2 className="font-serif font-semibold text-white text-sm">
                      Latest News
                    </h2>
                    <Newspaper className="h-5 w-5 text-white shrink-0" />
                  </div>
                  <div className="p-4 xl:p-6 pl-1">
                    <RotatingConveyor items={latestNews} itemType="news" isRightAligned={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop preview - full width */}
      <ShopPreviewSection />
      {/* Genetic Resources - full width */}
      <GeneticResourcesSection />
      {/* Gallery Highlights - Full width, normal scroll (sticky stops here) */}
      <ImageCarousel scope="global" />
      <LinksCarousel />
    </div>
  );
};

export default Home;
