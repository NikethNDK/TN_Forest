import { Route } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminHome from '../pages/admin/AdminHome';
import AdminAbout from '../pages/admin/AdminAbout';
import AdminFaculty from '../pages/admin/AdminFaculty';
import AdminPublications from '../pages/admin/AdminPublications';
import AdminContact from '../pages/admin/AdminContact';
import AdminDivision from '../pages/admin/AdminDivision';
import AdminResearchCenter from '../pages/admin/AdminResearchCenter';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';

export const adminRoutes = (
  <>
    <Route path="/login/admin" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="home" element={<AdminHome />} />
      <Route path="about" element={<AdminAbout />} />
      <Route path="faculty" element={<AdminFaculty />} />
      <Route path="publications" element={<AdminPublications />} />
      <Route path="contact" element={<AdminContact />} />
      <Route path="divisions/:divisionSlug" element={<AdminDivision />} />
      <Route path="divisions/:divisionSlug/centers/:centerId" element={<AdminResearchCenter />} />
      <Route path="orders/:orderId" element={<AdminOrderDetail />} />
    </Route>
  </>
);
