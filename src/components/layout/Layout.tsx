import React, { useRef, useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import { DivisionThemeProvider } from '../../providers/DivisionThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const chromeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chromeRef.current;
    if (!el) return;

    const setChromeHeight = (): void => {
      document.documentElement.style.setProperty(
        '--chrome-height',
        `${el.offsetHeight}px`
      );
    };

    setChromeHeight();
    const observer = new ResizeObserver(setChromeHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--chrome-height');
    };
  }, []);

  return (
    <DivisionThemeProvider>
      <div className="min-h-screen">
        <div ref={chromeRef}>
          <Header />
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
        </div>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </DivisionThemeProvider>
  );
};

export default Layout;

