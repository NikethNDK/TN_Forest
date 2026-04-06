/**
 * Confirmed orders list (non-pending). EcoStore Admin.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Search } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import { getOrders, getMe, type OrderFromApi } from '../../../services/api/shopApi';

const STATUS_BADGE_CLASS: Record<string, string> = {
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

const AdminShopOrdersConfirmed: React.FC = () => {
  const [orders, setOrders] = useState<OrderFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isMainAdmin, setIsMainAdmin] = useState(true);

  useEffect(() => {
    getMe()
      .then((me) => setIsMainAdmin(me.admin_type === 'main_admin'))
      .catch(() => setIsMainAdmin(false));
  }, []);

  const fetchOrders = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await getOrders(
        searchTerm !== undefined && searchTerm.trim() !== '' ? { search: searchTerm.trim() } : undefined
      );
      setOrders(list.filter((o) => o.status !== 'pending'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(search.trim() || undefined);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  const displayOrderNo = (o: OrderFromApi) => o.order_no || `#${o.id}`;
  const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const displayAmount = (o: OrderFromApi) =>
    !isMainAdmin && o.portion_subtotal != null && o.portion_subtotal !== ''
      ? o.portion_subtotal
      : o.total_amount;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CheckCircle className="h-7 w-7 text-green-600" />
        Confirmed orders
      </h2>
      <p className="text-gray-600 mb-6">Accepted, declined, and other processed orders.</p>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-wrap items-center gap-2">
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
        {search.trim() && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              fetchOrders();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Loading confirmed orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No confirmed orders.
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isMainAdmin ? 'Total' : 'Your portion'}
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
                    {displayOrderNo(o)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(o.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>{o.delivery_name}</div>
                    <div className="text-gray-500">{o.delivery_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        STATUS_BADGE_CLASS[o.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{displayAmount(o)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={`/admin/shop/orders/${o.id}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
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

export default AdminShopOrdersConfirmed;
