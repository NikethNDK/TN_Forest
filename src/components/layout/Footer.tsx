import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe, Clock, UserCheck } from 'lucide-react';
import { subscribeToFooterLocation } from '../../services/firebase/contactService';
import { incrementVisitorCount, subscribeToVisitorCount } from '../../services/firebase/visitorService';
import type { ContactLocation } from '../../types';

// Function to format the date and time
const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  return date.toLocaleString(undefined, options);
};

const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [visitors, setVisitors] = useState<number>(0);
  const [footerLocation, setFooterLocation] = useState<ContactLocation | null>(null);

  // Update current time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Track visitor count once per session (skip on refresh)
  useEffect(() => {
    const SESSION_KEY = 'tnfrd_visitor_counted';
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    incrementVisitorCount().catch((error) => {
      console.error('Error incrementing visitor count:', error);
    });
  }, []);

  // Subscribe to real-time visitor count updates
  useEffect(() => {
    const unsubscribe = subscribeToVisitorCount(
      (count) => {
        setVisitors(count);
      },
      (err) => {
        console.error('Error loading visitor count:', err);
        // Don't show error to user, just use default/empty
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Subscribe to footer location updates
  useEffect(() => {
    const unsubscribe = subscribeToFooterLocation(
      (location) => {
        setFooterLocation(location);
      },
      (err) => {
        console.error('Error loading footer location:', err);
        // Don't show error to user, just use default/empty
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <footer 
      className="relative text-footer-text bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://www.shutterstock.com/image-vector/silhouette-forest-isolated-on-white-260nw-2479974867.jpg)',
      }}
    > 
      {/* Overlay */}
      <div className="absolute inset-0 bg-footer-overlay"></div>
      
      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tamil Nadu Forest Department</h3>
            <p className="text-footer-textSecondary text-sm leading-relaxed">
              Dedicated to forest research, conservation, and sustainable development 
              for the betterment of Tamil Nadu's natural heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-footer-textSecondary hover:text-footer-text transition-colors">Home</a></li>
              <li><a href="/about" className="text-footer-textSecondary hover:text-footer-text transition-colors">About Us</a></li>
              <li><a href="/divisions" className="text-footer-textSecondary hover:text-footer-text transition-colors">Divisions</a></li>
              <li><a href="/publication" className="text-footer-textSecondary hover:text-footer-text transition-colors">Publications</a></li>
              <li><a href="/contact" className="text-footer-textSecondary hover:text-footer-text transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Research Divisions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Research Divisions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/divisions/state-forest-research" className="text-footer-textSecondary hover:text-footer-text transition-colors">State Forest Research</a></li>
              <li><a href="/divisions/modern-nursery" className="text-footer-textSecondary hover:text-footer-text transition-colors">Modern Nursery</a></li>
              <li><a href="/divisions/forest-genetics" className="text-footer-textSecondary hover:text-footer-text transition-colors">Forest Genetics</a></li>
              <li><a href="/divisions/industrial-wood" className="text-footer-textSecondary hover:text-footer-text transition-colors">Industrial Wood</a></li>
              <li><a href="/divisions/agro-forestry" className="text-footer-textSecondary hover:text-footer-text transition-colors">Agro Forestry</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            {footerLocation ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-1 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary whitespace-pre-line">
                    {footerLocation.location}
                  </span>
                </div>
                {footerLocation.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                    <span className="text-footer-textSecondary">{footerLocation.phone}</span>
                  </div>
                )}
                {footerLocation.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                    <span className="text-footer-textSecondary">{footerLocation.email}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary">www.tnfrd.gov.in</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-1 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary">
                    Forest Department Complex,<br />
                    Chennai, Tamil Nadu 600006
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary">+91 XXXXX XXXXX</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary">example@example.com</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                  <span className="text-footer-textSecondary">www.tnfrd.gov.in</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Info */}
          <div className="lg:col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Real-Time Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                <span className="text-footer-textSecondary font-medium">
                  {formatDateTime(currentTime)}
                </span>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-footer-icon flex-shrink-0" />
                <span className="text-footer-textSecondary font-medium">
                  Total Visitors: {visitors.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-footer-border mt-8 pt-8 text-center">
          <p className="text-footer-textSecondary text-sm">
            © 2024 Tamil Nadu Forest Department Research Wing. All rights reserved.
          </p>
          <p className="text-content-inverseSecondary text-xs mt-2">
            Committed to forest conservation and sustainable development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

