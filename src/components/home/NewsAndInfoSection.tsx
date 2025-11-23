import React from 'react';
import { Calendar } from 'lucide-react';
import type { NewsItem, Event } from '../../types';

const NewsAndInfoSection: React.FC = () => {
  const latestNews: NewsItem[] = [
    {
      date: "Oct 10, 2025",
      title: "Breakthrough in Bamboo Genetics Research",
      excerpt: "Scientists identify drought-resistant bamboo varieties suitable for Tamil Nadu climate...",
      link: "/news/bamboo-genetics"
    },
    {
      date: "Oct 8, 2025",
      title: "Monthly Forest Health Report Published",
      excerpt: "September data shows 15% improvement in forest density across protected areas...",
      link: "/news/monthly-report"
    },
    {
      date: "Oct 5, 2025",
      title: "New Research Wing Inaugurated",
      excerpt: "State-of-the-art molecular biology lab opens in Coimbatore campus...",
      link: "/news/new-wing"
    },
    {
      date: "Oct 2, 2025",
      title: "Climate Resilience Study Published",
      excerpt: "New findings on forest adaptation strategies released...",
      link: "/news/climate-study"
    }
  ];

  const events: Event[] = [
    {
      date: "Sep 28, 2025",
      title: "Annual Forest Officers Symposium",
      excerpt: "Over 200 officers attended the three-day knowledge sharing event...",
      link: "/events/symposium-2025"
    },
    {
      date: "Sep 20, 2025",
      title: "Community Afforestation Drive",
      excerpt: "5000 saplings planted in collaboration with local villages...",
      link: "/events/afforestation"
    },
    {
      date: "Sep 15, 2025",
      title: "Drone Training Workshop Completed",
      excerpt: "Field staff trained in advanced aerial survey techniques...",
      link: "/events/drone-workshop"
    },
    {
      date: "Sep 10, 2025",
      title: "International Biodiversity Conference",
      excerpt: "Researchers presented findings on endemic species conservation...",
      link: "/events/bio-conference"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="lg:hidden space-y-8">
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

          <div className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-green-700">
            <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-6 flex items-center">
              <span className="w-2 h-6 sm:h-8 bg-lime-400 mr-3"></span>
              Latest News
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {latestNews.slice(0, 3).map((news, index) => (
                <div key={index} className="group">
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> {news.date}
                  </p>
                  <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base group-hover:text-green-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{news.excerpt}</p>
                  <a href={news.link} className="text-green-600 hover:text-lime-600 text-xs sm:text-sm font-semibold inline-flex items-center">
                    Read more 
                    <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                  </a>
                  {index < 2 && <hr className="mt-4 border-gray-200" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 border-r-8 border-lime-500">
            <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-6 flex items-center justify-end">
              Recent Events
              <span className="w-2 h-6 sm:h-8 bg-green-700 ml-3"></span>
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {events.slice(0, 3).map((event, index) => (
                <div key={index} className="group">
                  <p className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                    {event.date} <Calendar className="h-3 w-3 ml-1" />
                  </p>
                  <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base text-right group-hover:text-lime-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 text-right line-clamp-2">{event.excerpt}</p>
                  <a href={event.link} className="text-green-600 hover:text-lime-600 text-xs sm:text-sm font-semibold inline-flex items-center float-right">
                    <span className="mr-1 group-hover:mr-2 transition-all">←</span>
                    View details
                  </a>
                  <div className="clear-both"></div>
                  {index < 2 && <hr className="mt-4 border-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-2 xl:col-span-3">
              <div className="bg-white shadow-xl rounded-2xl p-6 xl:p-8 border-l-8 border-green-700 sticky top-8">
                <h2 className="text-xl xl:text-2xl font-bold text-green-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-lime-400 mr-3"></span>
                  Latest News
                </h2>
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {latestNews.map((news, index) => (
                    <div key={index} className="group">
                      <p className="text-xs text-gray-500 mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> {news.date}
                      </p>
                      <h3 className="font-bold text-green-800 mb-2 text-sm xl:text-base group-hover:text-green-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-xs xl:text-sm mb-2 line-clamp-2">{news.excerpt}</p>
                      <a href={news.link} className="text-green-600 hover:text-lime-600 text-xs xl:text-sm font-semibold inline-flex items-center">
                        Read more 
                        <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                      </a>
                      {index < latestNews.length - 1 && <hr className="mt-6 border-gray-200" />}
                    </div>
                  ))}
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

            <div className="col-span-2 xl:col-span-3">
              <div className="bg-white shadow-xl rounded-2xl p-6 xl:p-8 border-r-8 border-lime-500 sticky top-8">
                <h2 className="text-xl xl:text-2xl font-bold text-green-900 mb-6 flex items-center justify-end">
                  Recent Events
                  <span className="w-2 h-8 bg-green-700 ml-3"></span>
                </h2>
                <div className="space-y-6 max-h-96 overflow-y-auto pl-2">
                  {events.map((event, index) => (
                    <div key={index} className="group">
                      <p className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                        {event.date} <Calendar className="h-3 w-3 ml-1" />
                      </p>
                      <h3 className="font-bold text-green-800 mb-2 text-sm xl:text-base text-right group-hover:text-lime-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-xs xl:text-sm mb-2 text-right line-clamp-2">{event.excerpt}</p>
                      <a href={event.link} className="text-green-600 hover:text-lime-600 text-xs xl:text-sm font-semibold inline-flex items-center float-right">
                        <span className="mr-1 group-hover:mr-2 transition-all">←</span>
                        View details
                      </a>
                      <div className="clear-both"></div>
                      {index < events.length - 1 && <hr className="mt-6 border-gray-200" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsAndInfoSection;

