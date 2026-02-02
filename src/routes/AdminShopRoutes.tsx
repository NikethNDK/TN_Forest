import { Route } from 'react-router-dom';
import AdminShopLayout from '../pages/admin/shop/AdminShopLayout';
import AdminShopOverview from '../pages/admin/shop/AdminShopOverview';
import AdminShopDivisions from '../pages/admin/shop/AdminShopDivisions.tsx';
import AdminShopProducts from '../pages/admin/shop/AdminShopProducts.tsx';

export const adminShopRoutes = (
  <>
    <Route path="/admin/shop" element={<AdminShopLayout />}>
      <Route index element={<AdminShopOverview />} />
      <Route path="divisions" element={<AdminShopDivisions />} />
      <Route path="products" element={<AdminShopProducts />} />
    </Route>
  </>
);
