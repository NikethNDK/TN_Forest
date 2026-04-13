/**
 * Division admin: orders that still have at least one pending line for this admin's division(s).
 * Same table UX as Confirmed orders; filter uses scoped line items from GET /api/orders/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Inbox, Search } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import { getOrders, getMe, type OrderFromApi } from '../../../services/api/shopApi';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

function hasPendingScopedLine(o: OrderFromApi): boolean {
  return (o.items ?? []).some((i) => i.decision_status === 'pending');
}

const AdminShopOrdersPendingDivision: React.FC = () => {
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
      setOrders(list.filter(hasPendingScopedLine));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (access !== 'ready') return;
    fetchOrders();
  }, [access, fetchOrders]);

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
    o.portion_subtotal != null && o.portion_subtotal !== '' ? o.portion_subtotal : o.total_amount;

  if (access === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (access === 'redirect') {
    return <Navigate to="/admin/shop/orders/requests" replace />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Inbox className="h-7 w-7 text-green-600" />
        Pending orders
      </h2>
      <p className="text-gray-600 mb-2">Orders with line items awaiting your division&apos;s accept or reject.</p>
      <p className="text-gray-500 text-sm mb-6">Open an order to act on your lines. You only see your division&apos;s portion.</p>

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
          <LoadingSpinner message="Loading pending orders..." />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No pending orders for your division.
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
                  Your portion
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

export default AdminShopOrdersPendingDivision;
