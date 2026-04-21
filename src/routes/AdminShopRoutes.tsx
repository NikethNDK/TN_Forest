import { Route } from 'react-router-dom';
import AdminShopLayout from '../pages/admin/shop/AdminShopLayout';
import AdminShopOverview from '../pages/admin/shop/AdminShopOverview';
import AdminShopDivisions from '../pages/admin/shop/AdminShopDivisions.tsx';
import AdminShopProducts from '../pages/admin/shop/AdminShopProducts.tsx';
import ShopOrdersDefaultRedirect from '../pages/admin/shop/ShopOrdersDefaultRedirect';
import AdminShopOrdersRequests from '../pages/admin/shop/AdminShopOrdersRequests.tsx';
import AdminShopOrdersConfirmed from '../pages/admin/shop/AdminShopOrdersConfirmed.tsx';
import AdminShopOrdersPendingDivision from '../pages/admin/shop/AdminShopOrdersPendingDivision';
import AdminShopOrdersFulfillmentDivision from '../pages/admin/shop/AdminShopOrdersFulfillmentDivision';
import AdminShopOrdersRefundQueue from '../pages/admin/shop/AdminShopOrdersRefundQueue';
import AdminShopDivisionAdmins from '../pages/admin/shop/AdminShopDivisionAdmins';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';

export const adminShopRoutes = (
  <>
    <Route path="/admin/shop" element={<AdminShopLayout />}>
      <Route index element={<AdminShopOverview />} />
      <Route path="divisions" element={<AdminShopDivisions />} />
      <Route path="division-admins" element={<AdminShopDivisionAdmins />} />
      <Route path="products" element={<AdminShopProducts />} />
      <Route path="orders" element={<ShopOrdersDefaultRedirect />} />
      <Route path="orders/requests" element={<AdminShopOrdersRequests />} />
      <Route path="orders/pending" element={<AdminShopOrdersPendingDivision />} />
      <Route path="orders/fulfillment" element={<AdminShopOrdersFulfillmentDivision />} />
      <Route path="orders/refunds" element={<AdminShopOrdersRefundQueue />} />
      <Route path="orders/confirmed" element={<AdminShopOrdersConfirmed />} />
      <Route path="orders/:orderId" element={<AdminOrderDetail />} />
    </Route>
  </>
);
