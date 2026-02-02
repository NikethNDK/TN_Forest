import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  FileText, 
  Phone, 
  GitBranch,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { divisions } from '../../data/mockData';
import { signOutUser } from '../../services/firebase/authService';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDivisions, setExpandedDivisions] = useState<string[]>([]);

  const toggleDivision = (slug: string) => {
    setExpandedDivisions(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/home', label: 'Home Page', icon: Home },
    { path: '/admin/about', label: 'About Page', icon: Users },
    { path: '/admin/faculty', label: 'Faculty Page', icon: Users },
    { path: '/admin/publications', label: 'Publications', icon: FileText },
    // { path: '/admin/information', label: 'Information', icon: Info },
    { path: '/admin/contact', label: 'Contact Page', icon: Phone },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    if (path === '/admin/shop') {
      return location.pathname.startsWith('/admin/shop');
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login/admin');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      navigate('/login/admin');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-forest-green-900 text-white z-40
          w-64 lg:w-72 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold text-lime-400">Admin Panel</h1>
          <p className="text-sm text-green-300 mt-1">TNFDRW Management</p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-100px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-green-700 text-lime-400'
                    : 'text-green-100 hover:bg-green-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Divisions Section */}
          <div className="pt-4">
            <button
              onClick={() => toggleDivision('divisions')}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${expandedDivisions.includes('divisions')
                  ? 'bg-green-800 text-lime-400'
                  : 'text-green-100 hover:bg-green-800 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5" />
                <span className="font-medium">Divisions</span>
              </div>
              {expandedDivisions.includes('divisions') ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedDivisions.includes('divisions') && (
              <div className="ml-4 mt-2 space-y-1">
                {divisions.map((division) => (
                  <Link
                    key={division.id}
                    to={`/admin/divisions/${division.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm
                      ${location.pathname === `/admin/divisions/${division.slug}`
                        ? 'bg-green-700 text-lime-400'
                        : 'text-green-200 hover:bg-green-800 hover:text-white'
                      }
                    `}
                  >
                    <span>{division.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* EcoStore Admin */}
          <Link
            to="/admin/shop"
            onClick={() => setIsOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive('/admin/shop')
                ? 'bg-green-700 text-lime-400'
                : 'text-green-100 hover:bg-green-800 hover:text-white'
              }
            `}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">EcoStore Admin</span>
          </Link>

          {/* Back to Site & Logout */}
          <div className="pt-4 border-t border-green-800 mt-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-800 hover:text-white transition-colors"
            >
              <span className="font-medium">← Back to Site</span>
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;

