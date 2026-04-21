import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Package,
  Menu,
  X,
  LogOut,
  Inbox,
  CheckCircle,
  Users,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { signOutUser, getCurrentUser, getAdminFirestoreProfile } from '../../services/firebase/authService';
import { getMe } from '../../services/api/shopApi';

const StoreSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDivisionAdmin, setIsDivisionAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    let cancelled = false;
    (async () => {
      const profile = await getAdminFirestoreProfile(user.uid);
      if (!cancelled) {
        setIsDivisionAdmin(profile?.role === 'admin' && profile?.admin_type === 'division_admin');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) {
          setIsMainAdmin(me.admin_type === 'main_admin' || me.admin_type === 'main_type');
        }
      } catch {
        if (!cancelled) setIsMainAdmin(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login/admin');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login/admin');
    }
  };

  const isOverviewActive = location.pathname === '/admin/shop' || location.pathname === '/admin/shop/';
  const isDivisionsActive = location.pathname === '/admin/shop/divisions';
  const isDivisionAdminsActive = location.pathname === '/admin/shop/division-admins';
  const isProductsActive = location.pathname === '/admin/shop/products';
  const isOrdersActive = location.pathname.startsWith('/admin/shop/orders');
  const isRequestsActive = location.pathname.startsWith('/admin/shop/orders/requests');
  const isPendingDivisionActive = location.pathname.startsWith('/admin/shop/orders/pending');
  const isFulfillmentActive = location.pathname.startsWith('/admin/shop/orders/fulfillment');
  const isRefundsActive = location.pathname.startsWith('/admin/shop/orders/refunds');
  const isOrderDetailPath = /^\/admin\/shop\/orders\/\d+$/.test(location.pathname);
  const isConfirmedActive =
    location.pathname.startsWith('/admin/shop/orders/confirmed') ||
    (isDivisionAdmin && isOrderDetailPath);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`
          fixed left-0 top-0 h-full bg-forest-green-900 text-white z-40
          w-64 lg:w-72 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold text-lime-400">EcoStore Admin</h1>
          <p className="text-sm text-green-300 mt-1">Shop & inventory</p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-100px)]">
          <Link
            to="/admin/shop"
            onClick={() => setIsOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isOverviewActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </Link>

          {!isDivisionAdmin && (
            <Link
              to="/admin/shop/divisions"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isDivisionsActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <GitBranch className="h-5 w-5" />
              <span className="font-medium">Divisions</span>
            </Link>
          )}

          {isMainAdmin && (
            <Link
              to="/admin/shop/division-admins"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isDivisionAdminsActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Division admins</span>
            </Link>
          )}

          <Link
            to="/admin/shop/products"
            onClick={() => setIsOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isProductsActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Products</span>
          </Link>

          {!isDivisionAdmin && (
            <Link
              to="/admin/shop/orders/requests"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isRequestsActive || (isOrdersActive && !isConfirmedActive && !isOrderDetailPath && !isPendingDivisionActive)
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <Inbox className="h-5 w-5" />
              <span className="font-medium">Requested orders</span>
            </Link>
          )}

          {isDivisionAdmin && (
            <Link
              to="/admin/shop/orders/pending"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isPendingDivisionActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <Inbox className="h-5 w-5" />
              <span className="font-medium">Pending orders</span>
            </Link>
          )}

          {isDivisionAdmin && (
            <Link
              to="/admin/shop/orders/fulfillment"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isFulfillmentActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <Truck className="h-5 w-5" />
              <span className="font-medium">Fulfillment queue</span>
            </Link>
          )}

          {isMainAdmin && (
            <Link
              to="/admin/shop/orders/refunds"
              onClick={() => setIsOpen(false)}
              className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isRefundsActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
            >
              <RotateCcw className="h-5 w-5" />
              <span className="font-medium">Refund queue</span>
            </Link>
          )}

          <Link
            to="/admin/shop/orders/confirmed"
            onClick={() => setIsOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isConfirmedActive
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Confirmed orders</span>
          </Link>

          <div className="pt-4 border-t border-green-800 mt-4 space-y-2">
            {!isDivisionAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-800 hover:text-white transition-colors"
              >
                <span className="font-medium">← Back to Admin</span>
              </Link>
            )}
            {isDivisionAdmin && (
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-800 hover:text-white transition-colors"
              >
                <span className="font-medium">← Back to website</span>
              </Link>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default StoreSidebar;
