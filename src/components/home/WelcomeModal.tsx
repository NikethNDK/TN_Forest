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
      {/* Modal Overlay - Semi-transparent, allows background interaction */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4 pointer-events-auto"
          onClick={handleClose}
        >
          {/* Modal Container - Smaller size, stops event propagation */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[75vh] overflow-hidden flex flex-col pointer-events-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-lime-500 p-4 md:p-5 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
                <Info className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                <span className="hidden sm:inline">Welcome to TamilNadu Forest Department's Research Wing</span>
                <span className="sm:hidden">Welcome</span>
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {/* Shop Information Section */}
              <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-xl p-4 md:p-5 mb-4 border-l-4 border-green-600">
                <div className="flex items-center mb-3">
                  <ShoppingBag className="h-5 w-5 text-green-700 mr-2" />
                  <h3 className="text-lg font-bold text-green-900">Explore Our Forest Products Eco-Store</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  Discover high-quality seeds, saplings, and bio-fertilizers directly from our research centers. 
                  {/* All products are backed by our scientific research, ensuring the best 
                  quality for your afforestation and cultivation projects. */}
                </p>
                <button
                  onClick={handleShopNavigation}
                  className="bg-lime-500 hover:bg-lime-600 text-green-900 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-lg text-sm"
                >
                  Visit Eco-Store
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>

              {/* Latest News Section */}
              {/* {displayNews.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-lime-600" />
                    Latest News
                  </h3>
                  <div className="space-y-3">
                    {displayNews.map((news, index) => (
                      <div key={index} className="bg-white border-l-4 border-green-600 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {news.date}
                        </p>
                        <h4 className="font-bold text-green-800 mb-1 text-sm">{news.title}</h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{news.excerpt}</p>
                        {(news.link || news.pdfUrl) && (
                          <a 
                            href={news.link || news.pdfUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-lime-600 text-xs font-semibold inline-flex items-center"
                          >
                            {news.pdfUrl && !news.link ? 'View PDF' : 'Read more'}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Recent Events Section */}
              {/* {displayEvents.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-lime-600" />
                    Recent Events
                  </h3>
                  <div className="space-y-3">
                    {displayEvents.map((event, index) => (
                      <div key={index} className="bg-white border-l-4 border-lime-500 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {event.date}
                        </p>
                        <h4 className="font-bold text-green-800 mb-1 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.excerpt}</p>
                        {(event.link || event.pdfUrl) && (
                          <a 
                            href={event.link || event.pdfUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-lime-600 text-xs font-semibold inline-flex items-center"
                          >
                            {event.pdfUrl && !event.link ? 'View PDF' : 'View details'}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
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

