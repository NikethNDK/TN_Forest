import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, Play, Pause } from 'lucide-react';

const VideoHeroSection = () => {
  return (
    <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
      {/* Video placeholder - replace src with actual video */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1511497584788-876760111969?w=1200"
      >
        <source src="https://www.aiwc.res.in/uploads/videos/AIWC.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1511497584788-876760111969?w=1200)'
        }}></div>
      </video>
    
    </section>
  );
};

const NewsAndInfoSection = () => {
  const latestNews = [
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

  const events = [
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile and Tablet Layout */}
        <div className="lg:hidden space-y-8">
          {/* Center Content - About Info */}
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
              Our multidisciplinary team of scientists, researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
              <div className="group">
                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-2xl sm:text-3xl">🔬</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2 text-sm sm:text-base">Research Excellence</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Advanced facilities and cutting-edge studies across the state</p>
              </div>
              
              <div className="group">
                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-2xl sm:text-3xl">🌍</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2 text-sm sm:text-base">Global Collaboration</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Partnerships with international research institutions</p>
              </div>
              
              <div className="group">
                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2 text-sm sm:text-base">Capacity Building</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Comprehensive training programs for forest personnel</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Discover Our Work
            </button>
          </div>

          {/* Latest News - Mobile */}
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

          {/* Recent Events - Mobile */}
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

        {/* Desktop Layout */}
        <div className="hidden lg:block relative">
          {/* Latest News - Left Side (Fixed Position) */}
          <div className="absolute left-0 top-0 w-80 bg-white shadow-xl rounded-r-2xl p-8 border-l-8 border-green-700">
            <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-lime-400 mr-3"></span>
              Latest News
            </h2>
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {latestNews.map((news, index) => (
                <div key={index} className="group">
                  <p className="text-xs text-gray-500 mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> {news.date}
                  </p>
                  <h3 className="font-bold text-green-800 mb-2 text-base group-hover:text-green-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{news.excerpt}</p>
                  <a href={news.link} className="text-green-600 hover:text-lime-600 text-sm font-semibold inline-flex items-center">
                    Read more 
                    <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                  </a>
                  {index < latestNews.length - 1 && <hr className="mt-6 border-gray-200" />}
                </div>
              ))}
            </div>
          </div>

          {/* Center Content - About Info */}
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 via-green-600 to-lime-500 mb-6">
                Tamil Nadu Forest Research Department
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-green-700 to-lime-400 mx-auto mb-8"></div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
              Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
              Our multidisciplinary team of scientists, researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-10">
              <div className="group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2">Research Excellence</h3>
                <p className="text-gray-600 text-sm">Advanced facilities and cutting-edge studies across the state</p>
              </div>
              
              <div className="group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2">Global Collaboration</h3>
                <p className="text-gray-600 text-sm">Partnerships with international research institutions</p>
              </div>
              
              <div className="group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="font-bold text-green-900 mb-2">Capacity Building</h3>
                <p className="text-gray-600 text-sm">Comprehensive training programs for forest personnel</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Discover Our Work
            </button>
          </div>

          {/* Recent Events - Right Side (Fixed Position) */}
          <div className="absolute right-0 top-0 w-80 bg-white shadow-xl rounded-l-2xl p-8 border-r-8 border-lime-500">
            <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center justify-end">
              Recent Events
              <span className="w-2 h-8 bg-green-700 ml-3"></span>
            </h2>
            <div className="space-y-6 max-h-96 overflow-y-auto pl-2">
              {events.map((event, index) => (
                <div key={index} className="group">
                  <p className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                    {event.date} <Calendar className="h-3 w-3 ml-1" />
                  </p>
                  <h3 className="font-bold text-green-800 mb-2 text-base text-right group-hover:text-lime-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 text-right line-clamp-2">{event.excerpt}</p>
                  <a href={event.link} className="text-green-600 hover:text-lime-600 text-sm font-semibold inline-flex items-center float-right">
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
    </section>
  );
};

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    {
      url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
      caption: "Research Facility - Coimbatore Campus"
    },
    {
      url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800",
      caption: "Endemic Species Conservation Program"
    },
    {
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
      caption: "Modern Nursery Operations"
    },
    {
      url: "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=800",
      caption: "Field Research in Western Ghats"
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      caption: "Biodiversity Monitoring"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Gallery Highlights
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <div className="relative h-64 sm:h-80 md:h-96">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-6">
                <p className="text-white text-sm sm:text-lg font-medium">
                  {images[currentIndex].caption}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-green-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-green-800" />
          </button>

          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 sm:w-8 bg-green-700' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href="/gallery"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
          >
            See More Photos
          </a>
        </div>
      </div>
    </section>
  );
};

const LinksCarousel = () => {
    const [isPaused, setIsPaused] = useState(false);

    // --- UPDATED DATA: Using publicly accessible image URLs for the logos ---
    const importantLinks = [
        { 
            title: "Tamil Nadu Forest Department", 
            url: "https://forests.tn.gov.in", 
            // Using a generic forest logo/icon for representation as TNFD logo is complex to find a direct public image source.
            icon: "https://fsi.nic.in/img/resources/logo-hindi.png" 
        },
        { 
            title: "Ministry of Environment, Forest and Climate Change", 
            url: "https://moef.gov.in", 
            // Source: Official Government of India logo/emblem often used by MOEF
            icon: "	https://moef.gov.in/storage/configuration-images/1734422674.1707280802.moef-logo-right.png" 
        },
        { 
            title: "Indian Council of Forestry Research & Education", 
            url: "https://icfre.gov.in", 
            // Source: ICFRE's official logo
            icon: "	https://icfre.gov.in/Images/icfre.gif" 
        },
        { 
            title: "National Biodiversity Authority", 
            url: "https://nbaindia.org", 
            // Source: NBA's official logo
            icon: "https://nbaindia.org/public/logo-nba.png" 
        },
        { 
            title: "Forest Survey of India", 
            url: "https://fsi.nic.in", 
            // Source: FSI's official logo
            icon: "https://fsi.nic.in/fsi_logo.png" 
        },
        { 
            title: "Wildlife Institute of India", 
            url: "https://wii.gov.in", 
            // Source: WII's official logo
            icon: "	https://wii.gov.in/uploads/settings/17560640993595.png" 
        },
        { 
            title: "Centre for Ecological Sciences (IISc)", 
            url: "#", 
            // Source: IISc's logo, representing the parent institute
            icon: "https://cdn.iisc.ac.in/assets/img/iisclogo.png" 
        },
        { 
            title: "Tamil Nadu Agricultural University", 
            url: "https://tnau.ac.in", 
            // Source: TNAU's official logo
            icon: "	https://tnau.ac.in/wp-content/uploads/2022/11/logo_tnau_main.jpg" 
        }
    ];

     const duplicatedLinks = [...importantLinks, ...importantLinks];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-green-50 to-lime-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Important & Useful Links
        </h2>

        {/* Mobile Grid Layout */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {importantLinks.slice(0, 6).map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500"
            >
              <div className="mb-3 sm:mb-4 flex-shrink-0 flex items-center justify-center" style={{ height: '50px', width: '50px' }}>
                <img
                  src={link.icon}
                  alt={`${link.title} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              
              <h3 className="font-semibold text-green-800 text-center mb-2 flex-grow text-sm sm:text-base">
                {link.title}
              </h3>
              <div className="flex justify-center items-center text-green-600 text-xs sm:text-sm">
                <span className="mr-1">Visit</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>

        {/* Desktop Carousel Layout */}
        <div 
          className="hidden lg:block relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div 
              className={`flex gap-6 ${isPaused ? '' : 'animate-scroll'}`}
              style={{
                width: 'fit-content'
              }}
            >
              {duplicatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-t-4 border-green-600 hover:border-lime-500 flex-shrink-0"
                  style={{ width: '280px', minHeight: '220px' }}
                >
                  <div className="mb-4 flex-shrink-0 flex items-center justify-center" style={{ height: '70px', width: '70px' }}>
                    <img
                      src={link.icon}
                      alt={`${link.title} Logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-green-800 text-center mb-2 flex-grow">
                    {link.title}
                  </h3>
                  <div className="flex justify-center items-center text-green-600 text-sm">
                    <span className="mr-1">Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Pause indicator */}
          {isPaused && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              <Pause className="h-5 w-5" />
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6">
          {/* Hover to pause • Auto-scrolling */}
        </p>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <VideoHeroSection />
      <NewsAndInfoSection />
      <ImageCarousel />
      <LinksCarousel />
    </div>
  );
};

export default Home;