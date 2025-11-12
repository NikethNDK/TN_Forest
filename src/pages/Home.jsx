import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, Play, Pause } from 'lucide-react';

// Import all images from assets (excluding react.svg)
import AlwarmalaiImage from '../assets/Alwarmalai.jpeg';
import EdaikkalImage from '../assets/Edaikkal.jpeg';
import HarurMNCImage from '../assets/Harur MNC.jpeg';
import JamunamarathurImage from '../assets/Jamunamarathur.jpeg';
import KalamavoorImage from '../assets/Kalamavoor.jpeg';
import KathiripuramImage from '../assets/Kathiripuram.jpeg';
import MaragattaImage from '../assets/Maragatta.jpeg';
import MelchengamImage from '../assets/Melchengam.jpeg';
import ThoppurImage from '../assets/Thoppur.jpeg';
import ValkaraduImage from '../assets/Valkaradu.jpeg';

const RotatingImageStrip = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    AlwarmalaiImage,
    EdaikkalImage,
    HarurMNCImage,
    JamunamarathurImage,
    KalamavoorImage,
    KathiripuramImage,
    MaragattaImage,
    MelchengamImage,
    ThoppurImage,
    ValkaraduImage
  ];

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
      <div className="relative w-full h-full">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-64 sm:h-80 md:h-96 lg:h-[500px]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
            >
              <img
                src={image}
                alt={`Nursery Image ${index + 1}`}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-green-900/30 pointer-events-none"></div>
      </div>
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
      <div className="px-4 sm:px-6 lg:px-0">
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
              Our multidisciplinary team of researchers, and field experts develop evidence-based solutions for forest management, species conservation, and ecosystem restoration across Tamil Nadu's diverse landscapes.
            </p>

            {/* Mission and Vision */}
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

            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
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
            </button> */}
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
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Latest News - Left Side */}
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

            {/* Center Content - About Info */}
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

                {/* Mission and Vision */}
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

                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6 xl:mb-10">
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
                </button> */}
              </div>
            </div>

            {/* Recent Events - Right Side */}
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

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    AlwarmalaiImage,
    EdaikkalImage,
    HarurMNCImage,
    JamunamarathurImage,
    KalamavoorImage,
    KathiripuramImage,
    MaragattaImage,
    MelchengamImage,
    ThoppurImage,
    ValkaraduImage
  ];

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-900 mb-6 sm:mb-8">
          Gallery Highlights
        </h2>
        
        <div className="relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl shadow-2xl overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-64 sm:h-80 md:h-96"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-64 sm:h-80 md:h-96"
                >
                  <img
                    src={image}
                    alt={`Nursery Image ${index + 1}`}
                    className="w-full h-64 sm:h-80 md:h-96"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-800" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
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
          {/* {isPaused && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              <Pause className="h-5 w-5" />
            </div>
          )} */}
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
      <RotatingImageStrip />
      <NewsAndInfoSection />
      <ImageCarousel />
      <LinksCarousel />
    </div>
  );
};

export default Home;