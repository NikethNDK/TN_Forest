import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <main className="bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
