import React, { useState, useEffect } from 'react';
import RotatingImageStrip from '../components/home/RotatingImageStrip';
import NewsAndInfoSection from '../components/home/NewsAndInfoSection';
import ImageCarousel from '../components/home/ImageCarousel';
import LinksCarousel from '../components/home/LinksCarousel';
import WelcomeModal from '../components/home/WelcomeModal';
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
      <RotatingImageStrip />
      <NewsAndInfoSection />
      <ImageCarousel />
      <LinksCarousel />
    </div>
  );
};

export default Home;
