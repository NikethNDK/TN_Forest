import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Truck, Search } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import { getOrders, getMe, type OrderFromApi } from '../../../services/api/shopApi';

function hasOpenFulfillmentLine(order: OrderFromApi): boolean {
  return (order.items ?? []).some(
    (line) => line.decision_status === 'accepted' && line.fulfillment_status !== 'delivered'
  );
}

const AdminShopOrdersFulfillmentDivision: React.FC = () => {
  const [orders, setOrders] = useState<OrderFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [access, setAccess] = useState<'loading' | 'ready' | 'redirect'>('loading');

  useEffect(() => {
    getMe()
      .then((me) => {
        if (me.admin_type !== 'division_admin') {
          setAccess('redirect');
          return;
        }
        setAccess('ready');
      })
      .catch(() => setAccess('redirect'));
  }, []);

  const fetchOrders = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await getOrders(
        searchTerm !== undefined && searchTerm.trim() !== '' ? { search: searchTerm.trim() } : undefined
      );
      setOrders(list.filter(hasOpenFulfillmentLine));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load fulfillment queue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (access !== 'ready') return;
    fetchOrders();
  }, [access, fetchOrders]);

  if (access === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }
  if (access === 'redirect') {
    return <Navigate to="/admin/shop/orders/confirmed" replace />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="h-7 w-7 text-green-600" />
        Fulfillment queue
      </h2>
      <p className="text-gray-600 mb-6">Accepted lines that still need shipping or delivery updates.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders(search.trim() || undefined);
        }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Loading fulfillment queue..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No orders pending fulfillment in your division.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order no.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                    {o.order_no || `#${o.id}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>{o.delivery_name}</div>
                    <div className="text-gray-500">{o.delivery_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {o.fulfillment_rollup ?? 'not_started'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/admin/shop/orders/${o.id}`} className="text-green-600 hover:text-green-800 font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminShopOrdersFulfillmentDivision;
