import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import QueryProvider from './providers/QueryProvider';
import Home from './pages/Home';
import About from './pages/About';
// import Faculty from './pages/Faculty';
// import Information from './pages/Information';
import Publication from './pages/Publication';
import ContactUs from './pages/ContactUs';
import Divisions from './pages/Divisions';
import ModernNurseryDivision from './pages/ModernNurseryDivision';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminAbout from './pages/admin/AdminAbout';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminPublications from './pages/admin/AdminPublications';
// import AdminInformation from './pages/admin/AdminInformation';
import AdminContact from './pages/admin/AdminContact';
import AdminDivision from './pages/admin/AdminDivision';
import AdminResearchCenter from './pages/admin/AdminResearchCenter';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import StateForestResearchDivision from './pages/StateForestResearchDivision';
import ForestGeneticsDivision from './pages/ForestGeneticsDivision';
import IndustrialWoodResearchDivision from './pages/IndustrialWoodResearchDivision';
import AgroForestryResearchDivision from './pages/AgroForestryResearchDivision';
import Gallery from './pages/Gallery';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Admin Login */}
          <Route path="/login/admin" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="faculty" element={<AdminFaculty />} />
            <Route path="publications" element={<AdminPublications />} />
            {/* <Route path="information" element={<AdminInformation />} /> */}
            <Route path="contact" element={<AdminContact />} />
            <Route path="divisions/:divisionSlug" element={<AdminDivision />} />
            <Route path="divisions/:divisionSlug/centers/:centerId" element={<AdminResearchCenter />} />
            <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* <Route path="/faculty" element={<Faculty />} /> */}
                {/* <Route path="/information" element={<Information />} /> */}
                <Route path="/publication" element={<Publication />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/divisions" element={<Divisions />} />
                <Route path="/divisions/:divisionSlug/gallery" element={<Gallery />} />
                <Route path="/divisions/modern-nursery" element={<ModernNurseryDivision />} />
                <Route path="/divisions/state-forest-research" element={<StateForestResearchDivision />} />
                <Route path="/divisions/forest-genetics" element={<ForestGeneticsDivision />} />
                <Route path="/divisions/industrial-wood" element={<IndustrialWoodResearchDivision />} />
                <Route path="/divisions/agro-forestry" element={<AgroForestryResearchDivision />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </QueryProvider>
  );
};

export default App;

