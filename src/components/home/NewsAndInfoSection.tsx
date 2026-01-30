import React from 'react';
import type { NewsItem, Event } from '../../types';
import RotatingConveyor from './RotatingConveyor';

// This component is now used ONLY for mobile layout
// Desktop layout with sticky sidebars is handled directly in Home.tsx
interface NewsAndInfoSectionProps {
  latestNews: NewsItem[];
  events: Event[];
}

const NewsAndInfoSection: React.FC<NewsAndInfoSectionProps> = ({ latestNews, events }) => {

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 sm:px-6">
        {/* Mobile Layout Only - Stacked (no sticky behavior) */}
        <div className="space-y-8">
          {/* Center Text Content */}
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-lime-500 mb-6">
                Tamil Nadu Forest Research Department
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-green-700 to-lime-400 mx-auto mb-8"></div>
            </div>

            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
              Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.
            </p>
            
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Our multidisciplinary team of researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
            </p>

            <div className="max-w-3xl mx-auto mb-8 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-r-4 border-green-600">
                <h3 className="text-xl font-bold text-green-900 mb-3">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  To embrace innovation in soil health through biofertilizer solutions, produce high-quality climate-resilient seedlings for reforestation, supply superior forest tree seeds to stakeholders, and focus on conservation of rare, endangered, and threatened species for long-term environmental sustainability.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-r-4 border-lime-500">
                <h3 className="text-xl font-bold text-green-900 mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production, advanced microbial inoculants, production of climate-resilient seedlings, supply of quality forest tree seeds, and fostering sustainable management practices in RET species for long-term ecological benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Events - Mobile */}
          <div className="bg-gradient-to-br from-forest-green-50 to-forest-green-100 shadow-xl rounded-2xl p-6 border-l-8 border-forest-green-700 ring-1 ring-forest-green-200">
            <h2 className="text-xl sm:text-2xl font-bold text-forest-green-900 mb-6 flex items-center">
              <span className="w-2 h-6 sm:h-8 bg-lime-400 mr-3"></span>
              Recent Events
            </h2>
            <div className="max-h-80">
              <RotatingConveyor items={events} itemType="event" />
            </div>
          </div>

          {/* Latest News - Mobile */}
          <div className="bg-gradient-to-bl from-forest-green-50 to-forest-green-100 shadow-xl rounded-2xl p-6 border-r-8 border-lime-500 ring-1 ring-forest-green-200">
            <h2 className="text-xl sm:text-2xl font-bold text-forest-green-900 mb-6 flex items-center justify-end">
              Latest News
              <span className="w-2 h-6 sm:h-8 bg-green-700 ml-3"></span>
            </h2>
            <div className="max-h-80">
              <RotatingConveyor items={latestNews} itemType="news" isRightAligned={true} />
            </div>
          </div>
        </div>

        {/* COMMENTED OUT: Original desktop layout - now handled in Home.tsx with sticky sidebars */}
        {/* <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-2 xl:col-span-3">
              <div className="bg-white shadow-xl rounded-2xl p-6 xl:p-8 border-l-8 border-green-700 sticky top-8">
                <h2 className="text-xl xl:text-2xl font-bold text-green-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-lime-400 mr-3"></span>
                  Latest News
                </h2>
                <div className="pr-2">
                  <RotatingConveyor items={latestNews} itemType="news" />
                </div>
              </div>
            </div>

            <div className="col-span-8 xl:col-span-6">
              <div className="text-center py-4 xl:py-6 px-4">
                <div className="mb-8">
                  <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-lime-500 mb-6">
                    Tamil Nadu Forest Research Department
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-green-700 to-lime-400 mx-auto mb-8"></div>
                </div>

                <p className="text-base xl:text-lg text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto">
                  Standing at the forefront of ecological innovation and sustainable forestry practices...
                </p>
              </div>
            </div>

            <div className="col-span-2 xl:col-span-3">
              <div className="bg-white shadow-xl rounded-2xl p-6 xl:p-8 border-r-8 border-lime-500 sticky top-8">
                <h2 className="text-xl xl:text-2xl font-bold text-green-900 mb-6 flex items-center justify-end">
                  Recent Events
                  <span className="w-2 h-8 bg-green-700 ml-3"></span>
                </h2>
                <div className="pl-2">
                  <RotatingConveyor items={events} itemType="event" isRightAligned={true} />
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default NewsAndInfoSection;

