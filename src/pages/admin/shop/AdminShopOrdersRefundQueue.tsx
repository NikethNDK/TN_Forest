import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { RotateCcw, Search } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import { getMe, getRefundQueueOrders, type OrderFromApi } from '../../../services/api/shopApi';

function refundCounts(order: OrderFromApi): { pending: number; refunded: number; failed: number } {
  return (order.items ?? []).reduce(
    (acc, item) => {
      if (item.decision_status !== 'rejected') return acc;
      if (item.refund_status === 'refund_pending') acc.pending += 1;
      if (item.refund_status === 'refunded') acc.refunded += 1;
      if (item.refund_status === 'refund_failed') acc.failed += 1;
      return acc;
    },
    { pending: 0, refunded: 0, failed: 0 }
  );
}

const AdminShopOrdersRefundQueue: React.FC = () => {
  const [orders, setOrders] = useState<OrderFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [access, setAccess] = useState<'loading' | 'ready' | 'redirect'>('loading');

  useEffect(() => {
    getMe()
      .then((me) => {
        if (me.admin_type !== 'main_admin') {
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
      const list = await getRefundQueueOrders(
        searchTerm !== undefined && searchTerm.trim() !== '' ? { search: searchTerm.trim() } : undefined
      );
      setOrders(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load refund queue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (access !== 'ready') return;
    fetchOrders();
  }, [access, fetchOrders]);

  const grouped = useMemo(() => {
    const pending: OrderFromApi[] = [];
    const settled: OrderFromApi[] = [];
    for (const order of orders) {
      const counts = refundCounts(order);
      if (counts.pending > 0) pending.push(order);
      else settled.push(order);
    }
    return { pending, settled };
  }, [orders]);

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

  const renderTable = (list: OrderFromApi[]) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order no.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund summary</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list.map((o) => {
            const counts = refundCounts(o);
            return (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                  {o.order_no || `#${o.id}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div>{o.delivery_name}</div>
                  <div className="text-gray-500">{o.delivery_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {counts.pending > 0 && <div>Pending: {counts.pending}</div>}
                  {counts.refunded > 0 && <div>Refunded: {counts.refunded}</div>}
                  {counts.failed > 0 && <div>Failed: {counts.failed}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link to={`/admin/shop/orders/${o.id}`} className="text-green-600 hover:text-green-800 font-medium">
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <RotateCcw className="h-7 w-7 text-green-600" />
        Refund queue
      </h2>
      <p className="text-gray-600 mb-6">Rejected items needing refund action are listed first.</p>

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
        <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
          Search
        </button>
      </form>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Loading refund queue..." />
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending refunds</h3>
            {grouped.pending.length === 0 ? (
              <div className="py-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                No pending refunds.
              </div>
            ) : (
              renderTable(grouped.pending)
            )}
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Processed / failed refunds</h3>
            {grouped.settled.length === 0 ? (
              <div className="py-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                No processed refund records.
              </div>
            ) : (
              renderTable(grouped.settled)
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminShopOrdersRefundQueue;
