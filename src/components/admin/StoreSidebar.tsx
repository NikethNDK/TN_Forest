import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, GitBranch, Package, Menu, X, LogOut } from 'lucide-react';
import { signOutUser } from '../../services/firebase/authService';

const StoreSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
  const isProductsActive = location.pathname === '/admin/shop/products';

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

          <div className="pt-4 border-t border-green-800 mt-4 space-y-2">
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-800 hover:text-white transition-colors"
            >
              <span className="font-medium">← Back to Admin</span>
            </Link>
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
