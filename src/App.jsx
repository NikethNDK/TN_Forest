import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Faculty from './pages/Faculty';
import Information from './pages/Information';
import Publication from './pages/Publication';
import ContactUs from './pages/ContactUs';
import Divisions from './pages/Divisions';
import ModernNurseryDivision from './pages/ModernNurseryDivision';
import Shop from './pages/Shop';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/information" element={<Information />} />
          <Route path="/publication" element={<Publication />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/divisions" element={<Divisions />} />
          <Route path="/divisions/modern-nursery" element={<ModernNurseryDivision />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
