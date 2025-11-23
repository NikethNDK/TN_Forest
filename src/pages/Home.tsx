import React from 'react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import LinksCarousel from '../components/home/LinksCarousel';
import WelcomeModal from '../components/home/WelcomeModal';
import type { NewsItem, Event } from '../types';

const Home: React.FC = () => {
  // News and Events data (shared with NewsAndInfoSection)
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
    <div className="min-h-screen bg-white">
      <WelcomeModal latestNews={latestNews} events={events} />
      <RotatingImageStrip />
      <NewsAndInfoSection />
      <ImageCarousel />
      <LinksCarousel />
    </div>
  );
};

export default Home;
