import React, { useState, useEffect } from 'react';
import { X, Info, ShoppingBag, Newspaper, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import type { NewsItem, Event } from '../../types';

interface WelcomeModalProps {
  latestNews: NewsItem[];
  events: Event[];
}

const STORAGE_KEY = 'welcomeModalSeen';

const ItemLink: React.FC<{
  item: NewsItem | Event;
  fallbackLabel: string;
}> = ({ item, fallbackLabel }) => {
  if (item.blogSlug) {
    return (
      <Link
        to={`/blog/${item.blogSlug}`}
        className="text-home-heading hover:text-home-heading/90 text-xs font-semibold inline-flex items-center"
      >
        Read more
        <ExternalLink className="h-3 w-3 ml-1" />
      </Link>
    );
  }

  if (item.link || item.pdfUrl) {
    return (
      <a
        href={item.link || item.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-home-heading hover:text-home-heading/90 text-xs font-semibold inline-flex items-center"
      >
        {item.pdfUrl && !item.link ? 'View PDF' : fallbackLabel}
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    );
  }

  return null;
};

const WelcomeModal: React.FC<WelcomeModalProps> = ({ latestNews, events }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) {
      setIsOpen(true);
    } else {
      setShowFloatingIcon(true);
    }
  }, []);

  const handleClose = (): void => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
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

  const displayNews = latestNews.filter((item) => item.showOnWelcomeModal);
  const displayEvents = events.filter((item) => item.showOnWelcomeModal);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center lg:justify-end p-4 lg:pr-8 pointer-events-auto"
          onClick={handleClose}
        >
          <div 
            className="bg-background-home-body rounded-2xl shadow-2xl max-w-xl w-full max-h-[75vh] overflow-hidden flex flex-col pointer-events-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-home-heading p-4 md:p-5 flex items-center justify-between shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
                <Info className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                <span className="hidden sm:inline">Welcome to TamilNadu Forest Department's Research Wing</span>
                <span className="sm:hidden">Welcome</span>
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:opacity-80 transition-colors p-1.5 rounded-full hover:bg-white/20 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6">
              <div className="bg-mission-vision-card-bg rounded-xl p-4 md:p-5 mb-4 border-l-4 border-home-card-border">
                <div className="flex items-center mb-3">
                  <ShoppingBag className="h-5 w-5 text-home-heading mr-2" />
                  <h3 className="text-lg font-bold text-home-heading">Explore Our Forest Products Eco-Store</h3>
                </div>
                <p className="text-sm text-home-text mb-3 leading-relaxed">
                  Discover high-quality seeds, saplings, and bio-fertilizers directly from our research centers. 
                </p>
                <button
                  onClick={handleShopNavigation}
                  className="bg-shop-button-bg hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-lg text-sm"
                >
                  Visit Eco-Store
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>

              {displayNews.length > 0 && (
                <div className="bg-news-events-ticker-body rounded-xl shadow-elevated overflow-hidden mb-4">
                  <div className="flex items-center gap-2 px-4 py-3 bg-news-events-ticker-header">
                    <Newspaper className="h-5 w-5 text-white shrink-0" />
                    <h3 className="font-serif font-semibold text-white text-sm md:text-base">
                      Latest News
                    </h3>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="space-y-0">
                      {displayNews.map((news) => (
                        <div
                          key={news.id ?? `${news.title}-${news.date}`}
                          className="py-3 group rounded transition-colors hover:bg-news-events-ticker-header/10 border-b border-home-card-border/30 last:border-b-0"
                        >
                          {news.date && (
                            <p className="text-xs text-home-text-secondary mb-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> {news.date}
                            </p>
                          )}
                          <h4 className="font-bold text-home-heading mb-1 text-sm">{news.title}</h4>
                          {news.excerpt && (
                            <p className="text-xs text-home-text-secondary mb-2 line-clamp-2">{news.excerpt}</p>
                          )}
                          <ItemLink item={news} fallbackLabel="Read more" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {displayEvents.length > 0 && (
                <div className="bg-news-events-ticker-body rounded-xl shadow-elevated overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-news-events-ticker-header">
                    <Calendar className="h-5 w-5 text-white shrink-0" />
                    <h3 className="font-serif font-semibold text-white text-sm md:text-base">
                      Upcoming Events
                    </h3>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="space-y-0">
                      {displayEvents.map((event) => (
                        <div
                          key={event.id ?? `${event.title}-${event.date}`}
                          className="py-3 group rounded transition-colors hover:bg-news-events-ticker-header/10 border-b border-home-card-border/30 last:border-b-0"
                        >
                          {event.date && (
                            <p className="text-xs text-home-text-secondary mb-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> {event.date}
                            </p>
                          )}
                          <h4 className="font-bold text-home-heading mb-1 text-sm">{event.title}</h4>
                          {event.excerpt && (
                            <p className="text-xs text-home-text-secondary mb-2 line-clamp-2">{event.excerpt}</p>
                          )}
                          <ItemLink item={event} fallbackLabel="View details" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFloatingIcon && (
        <button
          onClick={handleFloatingIconClick}
          className="fixed bottom-6 right-6 bg-home-heading hover:opacity-90 text-white p-4 rounded-full shadow-2xl z-40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Open welcome modal"
        >
          <Info className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default WelcomeModal;
