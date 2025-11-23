import React from 'react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import LinksCarousel from '../components/home/LinksCarousel';

const Home: React.FC = () => {
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
