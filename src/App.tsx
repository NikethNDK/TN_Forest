import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import QueryProvider from './providers/QueryProvider';
import Home from './pages/Home';
import About from './pages/About';
import Faculty from './pages/Faculty';
import Information from './pages/Information';
import Publication from './pages/Publication';
import ContactUs from './pages/ContactUs';
import Divisions from './pages/Divisions';
import ModernNurseryDivision from './pages/ModernNurseryDivision';
import Shop from './pages/Shop';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminAbout from './pages/admin/AdminAbout';
import AdminPublications from './pages/admin/AdminPublications';
import AdminContact from './pages/admin/AdminContact';
import AdminDivision from './pages/admin/AdminDivision';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="publications" element={<AdminPublications />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="divisions/:divisionSlug" element={<AdminDivision />} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/*" element={
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
          } />
        </Routes>
      </Router>
    </QueryProvider>
  );
};

export default App;

