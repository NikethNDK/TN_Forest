import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Boxes, Clock3, IndianRupee, Package, RefreshCcw, Truck, Users } from 'lucide-react';
import { LoadingSpinner } from '../../../components/common';
import {
  getDivisionAdmins,
  getMe,
  getOrders,
  getProductsPaginated,
  getRefundQueueOrders,
  type OrderFromApi,
  type OrderItemApi,
  type OrderItemFulfillmentStatus,
  type ShopProductFromApi,
} from '../../../services/api/shopApi';

type AdminRole = 'main_admin' | 'division_admin' | 'unknown';

type DailyPoint = {
  label: string;
  value: number;
};

type SplitDatum = {
  label: string;
  value: number;
  colorClass: string;
};

type StackDatum = {
  label: string;
  pending: number;
  accepted: number;
  rejected: number;
};

type LowStockRow = {
  id: number;
  name: string;
  divisionName: string;
  stock: number;
};

const LOW_STOCK_KG = 5;
const CHART_DAYS = 14;
const ORDER_FETCH_LIMIT = 250;
const PRODUCT_FETCH_PAGE_SIZE = 100;

function toNumber(value: string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  } catch {
    return value;
  }
}

function dayKey(dateLike: string): string {
  const d = new Date(dateLike);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function buildLastNDays(days: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function hasPendingScopedLine(order: OrderFromApi): boolean {
  return (order.items ?? []).some((line) => line.decision_status === 'pending');
}

function hasOpenFulfillmentLine(order: OrderFromApi): boolean {
  return (order.items ?? []).some(
    (line) => line.decision_status === 'accepted' && line.fulfillment_status !== 'delivered'
  );
}

function isCompletedForDivision(order: OrderFromApi): boolean {
  return !(order.items ?? []).some(
    (line) => line.decision_status === 'pending' || (line.decision_status === 'accepted' && line.fulfillment_status !== 'delivered')
  );
}

function isAwaitingDecision(order: OrderFromApi): boolean {
  return order.status === 'pending' && (order.decision_rollup ?? 'awaiting_decisions') === 'awaiting_decisions';
}

function isInFulfillment(order: OrderFromApi): boolean {
  return (order.items ?? []).some((line) => line.decision_status === 'accepted' && line.fulfillment_status !== 'delivered');
}

function refundPendingCount(order: OrderFromApi): number {
  return (order.items ?? []).reduce((acc, line) => {
    if (line.decision_status !== 'rejected') return acc;
    return line.refund_status === 'refund_pending' ? acc + 1 : acc;
  }, 0);
}

function countFulfillmentStatuses(items: OrderItemApi[]): Record<OrderItemFulfillmentStatus, number> {
  const counts: Record<OrderItemFulfillmentStatus, number> = {
    not_started: 0,
    shipped: 0,
    out_for_delivery: 0,
    delivered: 0,
  };
  for (const line of items) {
    if (line.decision_status !== 'accepted') continue;
    const status = line.fulfillment_status ?? 'not_started';
    counts[status] += 1;
  }
  return counts;
}

async function loadAllProducts(): Promise<ShopProductFromApi[]> {
  let page = 1;
  let hasMore = true;
  const all: ShopProductFromApi[] = [];
  while (hasMore && page <= 20) {
    const res = await getProductsPaginated(page, PRODUCT_FETCH_PAGE_SIZE);
    all.push(...res.results);
    hasMore = res.next != null;
    page += 1;
  }
  return all;
}

const StatCard: React.FC<{ title: string; value: string; hint?: string; icon: React.ReactNode }> = ({
  title,
  value,
  hint,
  icon,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="text-green-700">{icon}</div>
    </div>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

const SimpleLineChart: React.FC<{ title: string; data: DailyPoint[] }> = ({ title, data }) => {
  const width = 520;
  const height = 160;
  const max = Math.max(1, ...data.map((d) => d.value));
  const points = data
    .map((d, i) => {
      const x = (i / Math.max(1, data.length - 1)) * width;
      const y = height - (d.value / max) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');
  const last = data[data.length - 1];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500">Latest: {last?.value ?? 0}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
        <polyline fill="none" stroke="#15803d" strokeWidth="3" points={points} />
        {data.map((d, i) => {
          const x = (i / Math.max(1, data.length - 1)) * width;
          const y = height - (d.value / max) * (height - 20) - 10;
          return <circle key={`${d.label}-${i}`} cx={x} cy={y} r="2.8" fill="#166534" />;
        })}
      </svg>
      <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-gray-500">
        {data.slice(-7).map((d) => (
          <span key={d.label} className="truncate text-center">
            {d.label}
          </span>
        ))}
      </div>
    </section>
  );
};

const StackedBars: React.FC<{ title: string; rows: StackDatum[] }> = ({ title, rows }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
    <div className="space-y-2">
      {rows.map((r) => {
        const total = Math.max(1, r.pending + r.accepted + r.rejected);
        return (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
              <span>{r.label}</span>
              <span>{r.pending + r.accepted + r.rejected}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded bg-gray-100">
              <div className="bg-yellow-400" style={{ width: `${(r.pending / total) * 100}%` }} />
              <div className="bg-emerald-500" style={{ width: `${(r.accepted / total) * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(r.rejected / total) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
    <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-yellow-400" />Pending</span>
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" />Accepted</span>
      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500" />Rejected</span>
    </div>
  </section>
);

const DonutChart: React.FC<{ title: string; rows: SplitDatum[] }> = ({ title, rows }) => {
  const total = Math.max(1, rows.reduce((sum, r) => sum + r.value, 0));
  let cursor = 0;
  const segments = rows.map((r) => {
    const start = (cursor / total) * 360;
    cursor += r.value;
    const end = (cursor / total) * 360;
    return { ...r, start, end };
  });
  const gradient = segments
    .map((s) => `${cssColorFromClass(s.colorClass)} ${s.start}deg ${s.end}deg`)
    .join(', ');

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="absolute inset-4 rounded-full bg-white" />
        </div>
        <div className="space-y-2 text-xs text-gray-700">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded ${r.colorClass}`} />
              <span className="min-w-24">{r.label}</span>
              <span className="font-semibold">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function cssColorFromClass(colorClass: string): string {
  if (colorClass.includes('emerald')) return '#10b981';
  if (colorClass.includes('blue')) return '#3b82f6';
  if (colorClass.includes('amber')) return '#f59e0b';
  if (colorClass.includes('yellow')) return '#facc15';
  if (colorClass.includes('indigo')) return '#6366f1';
  if (colorClass.includes('red')) return '#ef4444';
  if (colorClass.includes('gray')) return '#6b7280';
  return '#22c55e';
}

const AdminShopOverview: React.FC = () => {
  const [role, setRole] = useState<AdminRole>('unknown');
  const [orders, setOrders] = useState<OrderFromApi[]>([]);
  const [products, setProducts] = useState<ShopProductFromApi[]>([]);
  const [refundQueue, setRefundQueue] = useState<OrderFromApi[]>([]);
  const [divisionAdminCount, setDivisionAdminCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await getMe();
        const adminRole: AdminRole = me.admin_type === 'division_admin' ? 'division_admin' : 'main_admin';
        if (cancelled) return;
        setRole(adminRole);

        const [ordersRes, productsRes] = await Promise.all([
          getOrders(),
          loadAllProducts(),
        ]);
        if (cancelled) return;
        setOrders(ordersRes.slice(0, ORDER_FETCH_LIMIT));
        setProducts(productsRes);

        if (adminRole === 'main_admin') {
          const [refundsRes, adminsRes] = await Promise.all([
            getRefundQueueOrders(),
            getDivisionAdmins(100),
          ]);
          if (cancelled) return;
          setRefundQueue(refundsRes);
          setDivisionAdminCount(adminsRes.count);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load overview data';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const days = useMemo(() => buildLastNDays(CHART_DAYS), []);

  const lowStockRows: LowStockRow[] = useMemo(
    () =>
      products
        .filter((p) => p.stock < LOW_STOCK_KG)
        .map((p) => ({
          id: p.id,
          name: p.name,
          divisionName: p.divisionName,
          stock: p.stock,
        }))
        .sort((a, b) => a.stock - b.stock),
    [products]
  );

  const mainData = useMemo(() => {
    const totalOrders = orders.length;
    const awaiting = orders.filter(isAwaitingDecision);
    const inFulfillment = orders.filter(isInFulfillment);
    const gmv = orders.reduce((sum, o) => sum + toNumber(o.total_amount), 0);
    const hiddenListings = products.filter((p) => !p.visibleOnShop).length;
    const pendingRefundOrders = refundQueue.filter((o) => refundPendingCount(o) > 0);

    const orderTrend: DailyPoint[] = days.map((d) => ({
      label: formatDate(d),
      value: orders.filter((o) => dayKey(o.created_at) === d).length,
    }));

    const decisionByDay: StackDatum[] = days.map((d) => {
      const dayOrders = orders.filter((o) => dayKey(o.created_at) === d);
      return {
        label: formatDate(d),
        pending: dayOrders.filter((o) => (o.decision_rollup ?? 'awaiting_decisions') === 'awaiting_decisions').length,
        accepted: dayOrders.filter((o) => {
          const rollup = o.decision_rollup ?? 'awaiting_decisions';
          return rollup === 'fully_accepted' || rollup === 'partially_accepted';
        }).length,
        rejected: dayOrders.filter((o) => (o.decision_rollup ?? 'awaiting_decisions') === 'fully_rejected').length,
      };
    });

    const allItems = orders.flatMap((o) => o.items ?? []);
    const fulfillmentCounts = countFulfillmentStatuses(allItems);
    const fulfillmentSplit: SplitDatum[] = [
      { label: 'Not started', value: fulfillmentCounts.not_started, colorClass: 'bg-gray-400' },
      { label: 'Shipped', value: fulfillmentCounts.shipped, colorClass: 'bg-blue-500' },
      { label: 'Out for delivery', value: fulfillmentCounts.out_for_delivery, colorClass: 'bg-amber-500' },
      { label: 'Delivered', value: fulfillmentCounts.delivered, colorClass: 'bg-emerald-500' },
    ];

    return {
      totalOrders,
      awaitingCount: awaiting.length,
      inFulfillmentCount: inFulfillment.length,
      pendingRefundCount: pendingRefundOrders.length,
      gmv,
      listingsCount: products.length,
      hiddenListings,
      requestQueue: awaiting.slice(0, 5),
      refundQueueTop: pendingRefundOrders.slice(0, 5),
      lowStockTop: lowStockRows.slice(0, 5),
      orderTrend,
      decisionByDay,
      fulfillmentSplit,
    };
  }, [days, lowStockRows, orders, products, refundQueue]);

  const divisionData = useMemo(() => {
    const pendingOrders = orders.filter(hasPendingScopedLine);
    const fulfillmentOrders = orders.filter(hasOpenFulfillmentLine);
    const completedOrders = orders.filter(isCompletedForDivision);
    const scopedRevenue = orders.reduce((sum, o) => sum + toNumber(o.portion_subtotal), 0);
    const orderTrend: DailyPoint[] = days.map((d) => ({
      label: formatDate(d),
      value: orders.filter((o) => dayKey(o.created_at) === d).length,
    }));

    const allItems = orders.flatMap((o) => o.items ?? []);
    const fulfillmentCounts = countFulfillmentStatuses(allItems);
    const fulfillmentSplit: SplitDatum[] = [
      { label: 'Not started', value: fulfillmentCounts.not_started, colorClass: 'bg-gray-400' },
      { label: 'Shipped', value: fulfillmentCounts.shipped, colorClass: 'bg-blue-500' },
      { label: 'Out for delivery', value: fulfillmentCounts.out_for_delivery, colorClass: 'bg-amber-500' },
      { label: 'Delivered', value: fulfillmentCounts.delivered, colorClass: 'bg-emerald-500' },
    ];

    const decisionRows: SplitDatum[] = [
      { label: 'Pending', value: allItems.filter((i) => i.decision_status === 'pending').length, colorClass: 'bg-yellow-400' },
      { label: 'Accepted', value: allItems.filter((i) => i.decision_status === 'accepted').length, colorClass: 'bg-emerald-500' },
      { label: 'Rejected', value: allItems.filter((i) => i.decision_status === 'rejected').length, colorClass: 'bg-red-500' },
    ];

    const pipelineRows: StackDatum[] = days.slice(-7).map((d) => {
      const dayItems = orders.filter((o) => dayKey(o.created_at) === d).flatMap((o) => o.items ?? []);
      return {
        label: formatDate(d),
        pending: dayItems.filter((i) => i.decision_status === 'pending').length,
        accepted: dayItems.filter((i) => i.decision_status === 'accepted').length,
        rejected: dayItems.filter((i) => i.decision_status === 'rejected').length,
      };
    });

    return {
      pendingOrders,
      fulfillmentOrders,
      completedOrders,
      scopedRevenue,
      listingsCount: products.length,
      lowStockTop: lowStockRows.slice(0, 5),
      orderTrend,
      fulfillmentSplit,
      decisionRows,
      pipelineRows,
    };
  }, [days, lowStockRows, orders, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner message="Loading overview..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  const isMain = role === 'main_admin';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-sm text-gray-600 mt-1">
          {isMain
            ? 'Global EcoStore performance and operational queues.'
            : 'Division-scoped workload, fulfillment progress, and stock watch.'}
        </p>
      </div>

      {isMain ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total orders" value={String(mainData.totalOrders)} icon={<BarChart3 className="h-5 w-5" />} />
            <StatCard title="Awaiting decisions" value={String(mainData.awaitingCount)} icon={<Clock3 className="h-5 w-5" />} />
            <StatCard title="In fulfillment" value={String(mainData.inFulfillmentCount)} icon={<Truck className="h-5 w-5" />} />
            <StatCard title="Pending refunds" value={String(mainData.pendingRefundCount)} icon={<RefreshCcw className="h-5 w-5" />} />
            <StatCard title="Gross value (GMV)" value={`₹${formatCurrency(mainData.gmv)}`} icon={<IndianRupee className="h-5 w-5" />} />
            <StatCard
              title="Listings"
              value={String(mainData.listingsCount)}
              hint={`${mainData.hiddenListings} hidden on shop${divisionAdminCount != null ? ` • ${divisionAdminCount} division admins` : ''}`}
              icon={<Boxes className="h-5 w-5" />}
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SimpleLineChart title="Orders trend (last 14 days)" data={mainData.orderTrend} />
            <StackedBars title="Decision mix by day" rows={mainData.decisionByDay.slice(-7)} />
            <DonutChart title="Fulfillment split (accepted lines)" rows={mainData.fulfillmentSplit} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <OverviewList
              title="Requested orders"
              emptyText="No orders awaiting decisions."
              rows={mainData.requestQueue.map((o) => ({
                key: o.id,
                primary: o.order_no || `#${o.id}`,
                secondary: `${o.delivery_name} • ${formatDate(o.created_at)}`,
                right: `₹${formatCurrency(toNumber(o.total_amount))}`,
                link: `/admin/shop/orders/${o.id}`,
              }))}
              ctaLabel="Open requested queue"
              ctaTo="/admin/shop/orders/requests"
            />
            <OverviewList
              title="Refund queue"
              emptyText="No pending refund actions."
              rows={mainData.refundQueueTop.map((o) => ({
                key: o.id,
                primary: o.order_no || `#${o.id}`,
                secondary: `${o.delivery_name} • Pending lines: ${refundPendingCount(o)}`,
                right: o.refund_rollup || 'refund_pending',
                link: `/admin/shop/orders/${o.id}`,
              }))}
              ctaLabel="Open refund queue"
              ctaTo="/admin/shop/orders/refunds"
            />
            <OverviewList
              title={`Low stock (< ${LOW_STOCK_KG} kg)`}
              emptyText="No low-stock listings."
              rows={mainData.lowStockTop.map((p) => ({
                key: p.id,
                primary: p.name,
                secondary: p.divisionName,
                right: `${p.stock} kg`,
                link: '/admin/shop/products',
              }))}
              ctaLabel="Open products"
              ctaTo="/admin/shop/products"
            />
          </section>
        </>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Need your decision" value={String(divisionData.pendingOrders.length)} icon={<Clock3 className="h-5 w-5" />} />
            <StatCard title="Fulfillment queue" value={String(divisionData.fulfillmentOrders.length)} icon={<Truck className="h-5 w-5" />} />
            <StatCard title="Completed orders" value={String(divisionData.completedOrders.length)} icon={<BarChart3 className="h-5 w-5" />} />
            <StatCard title="Your portion revenue" value={`₹${formatCurrency(divisionData.scopedRevenue)}`} icon={<IndianRupee className="h-5 w-5" />} />
            <StatCard title="Your listings" value={String(divisionData.listingsCount)} icon={<Package className="h-5 w-5" />} />
            <StatCard title={`Low stock (< ${LOW_STOCK_KG} kg)`} value={String(divisionData.lowStockTop.length)} icon={<Boxes className="h-5 w-5" />} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SimpleLineChart title="Scoped orders trend (last 14 days)" data={divisionData.orderTrend} />
            <StackedBars title="Decision pipeline (last 7 days)" rows={divisionData.pipelineRows} />
            <DonutChart title="Fulfillment split (accepted lines)" rows={divisionData.fulfillmentSplit} />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <OverviewList
              title="Pending orders"
              emptyText="No pending order decisions."
              rows={divisionData.pendingOrders.slice(0, 5).map((o) => ({
                key: o.id,
                primary: o.order_no || `#${o.id}`,
                secondary: `${o.delivery_name} • ${formatDate(o.created_at)}`,
                right: `₹${formatCurrency(toNumber(o.portion_subtotal) || toNumber(o.total_amount))}`,
                link: `/admin/shop/orders/${o.id}`,
              }))}
              ctaLabel="Open pending queue"
              ctaTo="/admin/shop/orders/pending"
            />
            <OverviewList
              title="Fulfillment queue"
              emptyText="No open fulfillment items."
              rows={divisionData.fulfillmentOrders.slice(0, 5).map((o) => ({
                key: o.id,
                primary: o.order_no || `#${o.id}`,
                secondary: `${o.delivery_name} • ${o.fulfillment_rollup ?? 'in_transit'}`,
                right: formatDate(o.updated_at),
                link: `/admin/shop/orders/${o.id}`,
              }))}
              ctaLabel="Open fulfillment queue"
              ctaTo="/admin/shop/orders/fulfillment"
            />
            <OverviewList
              title={`Low stock (< ${LOW_STOCK_KG} kg)`}
              emptyText="No low-stock listings."
              rows={divisionData.lowStockTop.map((p) => ({
                key: p.id,
                primary: p.name,
                secondary: p.divisionName,
                right: `${p.stock} kg`,
                link: '/admin/shop/products',
              }))}
              ctaLabel="Open products"
              ctaTo="/admin/shop/products"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Line decision split</h3>
            <DonutChart title="Decision status" rows={divisionData.decisionRows} />
          </section>
        </>
      )}
    </div>
  );
};

const OverviewList: React.FC<{
  title: string;
  rows: { key: number; primary: string; secondary: string; right: string; link: string }[];
  emptyText: string;
  ctaLabel: string;
  ctaTo: string;
}> = ({ title, rows, emptyText, ctaLabel, ctaTo }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    {rows.length === 0 ? (
      <p className="mt-4 text-sm text-gray-500">{emptyText}</p>
    ) : (
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <Link
            key={row.key}
            to={row.link}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{row.primary}</p>
              <p className="truncate text-xs text-gray-500">{row.secondary}</p>
            </div>
            <span className="ml-3 text-xs font-semibold text-gray-700">{row.right}</span>
          </Link>
        ))}
      </div>
    )}
    <div className="mt-4">
      <Link to={ctaTo} className="text-sm font-medium text-green-700 hover:text-green-800">
        {ctaLabel} →
      </Link>
    </div>
  </section>
);

export default AdminShopOverview;
