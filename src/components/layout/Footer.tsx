import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe, Clock, UserCheck } from 'lucide-react';
import { subscribeToFooterLocation } from '../../services/firebase/contactService';
import { incrementVisitorCount, subscribeToVisitorCount } from '../../services/firebase/visitorService';
import type { ContactLocation } from '../../types';
import { useDivisionTheme } from '../../providers/DivisionThemeProvider';

const FOOTER_BG_IMAGE_OPTIONS = ['/footer-image.jpeg'];

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
  const { theme } = useDivisionTheme();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [visitors, setVisitors] = useState<number>(0);
  const [footerLocation, setFooterLocation] = useState<ContactLocation | null>(null);
  const [footerBgImage, setFooterBgImage] = useState<string | null>(null);

  // Resolve footer background image (try common extensions so it works regardless of file type)
  useEffect(() => {
    let cancelled = false;
    const tryNext = (index: number) => {
      if (cancelled || index >= FOOTER_BG_IMAGE_OPTIONS.length) return;
      const src = FOOTER_BG_IMAGE_OPTIONS[index];
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setFooterBgImage(src);
      };
      img.onerror = () => tryNext(index + 1);
      img.src = src;
    };
    tryNext(0);
    return () => { cancelled = true; };
  }, []);

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
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        ...(footerBgImage ? { backgroundImage: `url(${footerBgImage})` } : {}),
        color: theme.footerText,
      }}
    > 
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: theme.footerOverlay }}
      ></div>
      
      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.footerText }}>Tamil Nadu Forest Department</h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.footerText, opacity: 0.9 }}>
              Dedicated to forest research, conservation, and sustainable development 
              for the betterment of Tamil Nadu's natural heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.footerText }}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Home</a></li>
              <li><a href="/about" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>About Us</a></li>
              <li><a href="/divisions" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Divisions</a></li>
              <li><a href="/publication" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Publications</a></li>
              <li><a href="/contact" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Contact</a></li>
            </ul>
          </div>

          {/* Research Divisions */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.footerText }}>Research Divisions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/divisions/state-forest-research" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>State Forest Research</a></li>
              <li><a href="/divisions/modern-nursery" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Modern Nursery</a></li>
              <li><a href="/divisions/forest-genetics" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Forest Genetics</a></li>
              <li><a href="/divisions/industrial-wood" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Industrial Wood</a></li>
              <li><a href="/divisions/agro-forestry" className="transition-colors hover:opacity-80" style={{ color: theme.footerText, opacity: 0.9 }}>Agro Forestry</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.footerText }}>Contact Information</h3>
            {footerLocation ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span className="whitespace-pre-line" style={{ color: theme.footerText, opacity: 0.9 }}>
                    {footerLocation.location}
                  </span>
                </div>
                {footerLocation.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                    <span style={{ color: theme.footerText, opacity: 0.9 }}>{footerLocation.phone}</span>
                  </div>
                )}
                {footerLocation.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                    <span style={{ color: theme.footerText, opacity: 0.9 }}>{footerLocation.email}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span style={{ color: theme.footerText, opacity: 0.9 }}>www.tnfrd.gov.in</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span style={{ color: theme.footerText, opacity: 0.9 }}>
                    Forest Department Complex,<br />
                    Chennai, Tamil Nadu 600006
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span style={{ color: theme.footerText, opacity: 0.9 }}>+91 XXXXX XXXXX</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span style={{ color: theme.footerText, opacity: 0.9 }}>example@example.com</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                  <span style={{ color: theme.footerText, opacity: 0.9 }}>www.tnfrd.gov.in</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Info */}
          <div className="lg:col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.footerText }}>Real-Time Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                <span className="font-medium" style={{ color: theme.footerText, opacity: 0.9 }}>
                  {formatDateTime(currentTime)}
                </span>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: theme.footerText, opacity: 0.9 }} />
                <span className="font-medium" style={{ color: theme.footerText, opacity: 0.9 }}>
                  Total Visitors: {visitors.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: theme.footerText, opacity: 0.2 }}>
          <p className="text-sm" style={{ color: theme.footerText, opacity: 0.9 }}>
            © 2024 Tamil Nadu Forest Department Research Wing. All rights reserved.
          </p>
          <p className="text-xs mt-2" style={{ color: theme.footerText, opacity: 0.8 }}>
            Committed to forest conservation and sustainable development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

