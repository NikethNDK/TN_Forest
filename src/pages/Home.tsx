import React, { useState, useEffect } from 'react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
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
    <div className="min-h-screen bg-white">
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
        <div className="relative bg-gradient-to-b from-gray-50 to-white">
          <div className="grid grid-cols-12 gap-4 xl:gap-6 px-4 xl:px-6 py-6">
            {/* Left Sidebar - Recent Events (Sticky) */}
            <div className="col-span-2 xl:col-span-3">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gradient-to-br from-forest-green-50 to-forest-green-100 shadow-xl rounded-2xl p-4 xl:p-6 border-l-8 border-forest-green-700 ring-1 ring-forest-green-200">
                  <h2 className="text-lg xl:text-xl font-bold text-forest-green-900 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-lime-400 mr-3"></span>
                    Recent Events
                  </h2>
                  <div className="pr-1">
                    <RotatingConveyor items={events} itemType="event" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Carousel + Content */}
            <div className="col-span-8 xl:col-span-6">
              {/* Carousel */}
              <div className="mb-8">
                <RotatingImageStrip />
              </div>

              {/* Center Text Content */}
              <div className="text-center py-4 xl:py-6 px-4">
                <div className="mb-8">
                  <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-lime-500 mb-6">
                    Tamil Nadu Forest Research Department
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-green-700 to-lime-400 mx-auto mb-8"></div>
                </div>

                <p className="text-base xl:text-lg text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto">
                  Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.
                </p>
                
                <p className="text-sm xl:text-base text-gray-600 leading-relaxed mb-8 max-w-4xl mx-auto">
                  Our multidisciplinary team of researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
                </p>

                <div className="max-w-4xl mx-auto mb-8 space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-r-4 border-green-600">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed text-sm xl:text-base">
                      To embrace innovation in soil health through biofertilizer solutions, produce high-quality climate-resilient seedlings for reforestation, supply superior forest tree seeds to stakeholders, and focus on conservation of rare, endangered, and threatened species for long-term environmental sustainability.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-r-4 border-lime-500">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Our Vision</h3>
                    <p className="text-gray-700 leading-relaxed text-sm xl:text-base">
                      To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production, advanced microbial inoculants, production of climate-resilient seedlings, supply of quality forest tree seeds, and fostering sustainable management practices in RET species for long-term ecological benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Latest News (Sticky) */}
            <div className="col-span-2 xl:col-span-3">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gradient-to-bl from-forest-green-50 to-forest-green-100 shadow-xl rounded-2xl p-4 xl:p-6 border-r-8 border-lime-500 ring-1 ring-forest-green-200">
                  <h2 className="text-lg xl:text-xl font-bold text-forest-green-900 mb-4 flex items-center justify-end">
                    Latest News
                    <span className="w-2 h-6 bg-green-700 ml-3"></span>
                  </h2>
                  <div className="pl-1">
                    <RotatingConveyor items={latestNews} itemType="news" isRightAligned={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Highlights - Full width, normal scroll (sticky stops here) */}
      <ImageCarousel scope="global" />
      <LinksCarousel />
    </div>
  );
};

export default Home;
