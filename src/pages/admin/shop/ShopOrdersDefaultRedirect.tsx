import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/common';
import { getMe } from '../../../services/api/shopApi';

/**
 * `/admin/shop/orders` — main admin → requested queue; division admin → pending (action) queue.
 */
const ShopOrdersDefaultRedirect: React.FC = () => {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then((me) =>
        setTarget(
          me.admin_type === 'division_admin'
            ? '/admin/shop/orders/pending'
            : '/admin/shop/orders/requests'
        )
      )
      .catch(() => setTarget('/admin/shop/orders/requests'));
  }, []);

  if (!target) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return <Navigate to={target} replace />;
};

export default ShopOrdersDefaultRedirect;
