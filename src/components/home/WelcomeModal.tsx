import React, { useState, useEffect } from 'react';
import { X, Info, ShoppingBag, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NewsItem, Event } from '../../types';

interface WelcomeModalProps {
  latestNews: NewsItem[];
  events: Event[];
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ latestNews, events }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show modal on page load
    setIsOpen(true);
  }, []);

  const handleClose = (): void => {
    setIsOpen(false);
    setShowFloatingIcon(true);
  };

  const handleFloatingIconClick = (): void => {
    setIsOpen(true);
    setShowFloatingIcon(false);
  };

  const handleShopNavigation = (): void => {
    navigate('/shop');
  };

  // Get 2 latest news and 2 latest events
  const displayNews = latestNews.slice(0, 2);
  const displayEvents = events.slice(0, 2);

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-lime-500 p-6 flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <Info className="h-6 w-6 md:h-7 md:w-7 mr-3" />
                Welcome to Tamil Nadu Forest Research Department
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {/* Shop Information Section */}
              <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-6 mb-6 border-l-4 border-green-600">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-green-700 mr-3" />
                  <h3 className="text-xl font-bold text-green-900">Explore Our Forest Products Shop</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Discover high-quality seeds, saplings, and bio-fertilizers directly from our research centers. 
                  All products are genetically verified and backed by our scientific research, ensuring the best 
                  quality for your afforestation and cultivation projects.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Browse our extensive catalog of forest tree seeds and organic bio-fertilizers, all produced 
                  with sustainable practices and scientific precision.
                </p>
                <button
                  onClick={handleShopNavigation}
                  className="bg-lime-500 hover:bg-lime-600 text-green-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center shadow-lg"
                >
                  Visit Shop
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>

              {/* Latest News Section */}
              {displayNews.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-lime-600" />
                    Latest News
                  </h3>
                  <div className="space-y-4">
                    {displayNews.map((news, index) => (
                      <div key={index} className="bg-white border-l-4 border-green-600 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {news.date}
                        </p>
                        <h4 className="font-bold text-green-800 mb-2">{news.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{news.excerpt}</p>
                        <a 
                          href={news.link} 
                          className="text-green-600 hover:text-lime-600 text-sm font-semibold inline-flex items-center"
                        >
                          Read more
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Events Section */}
              {displayEvents.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-lime-600" />
                    Recent Events
                  </h3>
                  <div className="space-y-4">
                    {displayEvents.map((event, index) => (
                      <div key={index} className="bg-white border-l-4 border-lime-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {event.date}
                        </p>
                        <h4 className="font-bold text-green-800 mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.excerpt}</p>
                        <a 
                          href={event.link} 
                          className="text-green-600 hover:text-lime-600 text-sm font-semibold inline-flex items-center"
                        >
                          View details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Icon */}
      {showFloatingIcon && (
        <button
          onClick={handleFloatingIconClick}
          className="fixed bottom-6 right-6 bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-2xl z-40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Open welcome modal"
        >
          <Info className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default WelcomeModal;

