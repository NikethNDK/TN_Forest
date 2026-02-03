import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-page">
      <Header />
      <Navbar />
      <main className="bg-background-page">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

