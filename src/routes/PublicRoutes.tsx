import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import GeneticResourcesPage from '../pages/GeneticResourcesPage';
import Publication from '../pages/Publication';
import ContactUs from '../pages/ContactUs';
import Divisions from '../pages/Divisions';
import ModernNurseryDivision from '../pages/ModernNurseryDivision';
import Shop from '../pages/Shop';
import Checkout from '../pages/Checkout';
import StateForestResearchDivision from '../pages/StateForestResearchDivision';
import ForestGeneticsDivision from '../pages/ForestGeneticsDivision';
import IndustrialWoodResearchDivision from '../pages/IndustrialWoodResearchDivision';
import AgroForestryResearchDivision from '../pages/AgroForestryResearchDivision';
import Gallery from '../pages/Gallery';
import BlogPost from '../pages/BlogPost';
import KnowledgeEcoTourism from '../pages/KnowledgeEcoTourism';

export const publicRoutes = (
  <Route
    path="/*"
    element={
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/genetic-resources" element={<GeneticResourcesPage />} />
          <Route path="/knowledge-eco-tourism" element={<KnowledgeEcoTourism />} />
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
    }
  />
);
