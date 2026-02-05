import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar } from 'lucide-react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import ShopPreviewSection from '../components/home/ShopPreviewSection';
import LinksCarousel from '../components/home/LinksCarousel';
import WelcomeModal from '../components/home/WelcomeModal';
import RotatingConveyor from '../components/home/RotatingConveyor';
import { subscribeToNews, subscribeToEvents } from '../services/firebase/newsEventService';
import type { NewsItem, Event } from '../types';

const Home: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

  return (
    <div className="min-h-screen bg-background-paper">
      <WelcomeModal latestNews={latestNews} events={events} />
      
      {/* Mobile Layout - Stacked (no sticky behavior) */}
      <div className="lg:hidden">
        <div className="px-4 py-4">
          <RotatingImageStrip />
        </div>
        <NewsAndInfoSection latestNews={latestNews} events={events} />
      </div>

      {/* Desktop Layout - 3-column with sticky sidebars */}
      <div className="hidden lg:block">
        {/* Sticky zone container - sidebars are sticky within this container */}
        <div className="relative bg-gradient-to-b from-background-page to-background-paper">
          <div className="grid grid-cols-12 gap-4 xl:gap-6 px-4 xl:px-6 py-6">
            {/* Left Sidebar - Recent Events (Sticky) */}
            <div className="col-span-2 xl:col-span-3 bg-background leaf-pattern rounded-2xl px-3 xl:px-4 py-6">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-forest-teal rounded-2xl shadow-elevated overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/20">
                    <Calendar className="h-5 w-5 text-white shrink-0" />
                    <h2 className="font-serif font-semibold text-white text-sm">
                      Recent Events
                    </h2>
                  </div>
                  <div className="p-4 xl:p-6 pr-1">
                    <RotatingConveyor items={events} itemType="event" variant="dark" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Carousel + Content (bg-background + leaf-pattern to match reference HomeSection) */}
            <div className="col-span-8 xl:col-span-6 bg-background leaf-pattern rounded-2xl px-4 xl:px-6 py-6">
              {/* Carousel */}
              <div className="mb-8">
                <RotatingImageStrip />
              </div>

              {/* Center Text Content - colors match reference, original copy kept */}
              <div className="text-center py-8 xl:py-10 px-2 lg:px-4 max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-serif font-bold text-primary-main mb-6">
                    Tamil Nadu Forest Research Department
                  </h1>
                  <div className="w-24 h-1 bg-gradient-gold rounded-full mx-auto mb-8"></div>
                </div>

                <p className="text-base xl:text-lg text-content-primary leading-relaxed mb-6 max-w-4xl mx-auto">
                  Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.
                </p>

                <p className="text-sm xl:text-base text-content-secondary leading-relaxed mb-8 max-w-4xl mx-auto">
                  Our multidisciplinary team of researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
                </p>

                {/* Mission & Vision cards */}
                <div className="space-y-6 text-left">
                  <div className="bg-card-background rounded-xl p-6 shadow-soft border border-border-default hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Our Mission</h3>
                    <p className="text-content-secondary leading-relaxed text-sm xl:text-base">
                      To embrace innovation in soil health through biofertilizer solutions, produce high-quality climate-resilient seedlings for reforestation, supply superior forest tree seeds to stakeholders, and focus on conservation of rare, endangered, and threatened species for long-term environmental sustainability.
                    </p>
                  </div>
                  <div className="bg-card-background rounded-xl p-6 shadow-soft border border-border-default hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1">
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Our Vision</h3>
                    <p className="text-content-secondary leading-relaxed text-sm xl:text-base">
                      To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production, advanced microbial inoculants, production of climate-resilient seedlings, supply of quality forest tree seeds, and fostering sustainable management practices in RET species for long-term ecological benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Latest News (Sticky) */}
            <div className="col-span-2 xl:col-span-3 bg-background leaf-pattern rounded-2xl px-3 xl:px-4 py-6">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-forest-olive rounded-2xl shadow-elevated overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/20 justify-end">
                    <h2 className="font-serif font-semibold text-white text-sm">
                      Latest News
                    </h2>
                    <Newspaper className="h-5 w-5 text-white shrink-0" />
                  </div>
                  <div className="p-4 xl:p-6 pl-1">
                    <RotatingConveyor items={latestNews} itemType="news" isRightAligned={true} variant="dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop preview - full width */}
      <ShopPreviewSection />
      {/* Gallery Highlights - Full width, normal scroll (sticky stops here) */}
      <ImageCarousel scope="global" />
      <LinksCarousel />
    </div>
  );
};

export default Home;
