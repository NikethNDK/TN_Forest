import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import { DivisionThemeProvider } from '../../providers/DivisionThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DivisionThemeProvider>
      <div className="min-h-screen">
        <Header />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </DivisionThemeProvider>
  );
};

export default Layout;

