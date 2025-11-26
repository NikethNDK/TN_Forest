import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Phone, 
  GitBranch,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const quickLinks = [
    { path: '/admin/home', label: 'Home Page', icon: Home, color: 'bg-green-600' },
    { path: '/admin/about', label: 'About Page', icon: Users, color: 'bg-green-700' },
    { path: '/admin/publications', label: 'Publications', icon: FileText, color: 'bg-green-800' },
    { path: '/admin/contact', label: 'Contact Page', icon: Phone, color: 'bg-green-900' },
    { path: '/admin/divisions/modern-nursery', label: 'Divisions', icon: GitBranch, color: 'bg-forest-green-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all content for the Tamil Nadu Forest Department Research Wing website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                ${link.color} text-white rounded-xl shadow-lg p-6
                hover:shadow-xl transition-all transform hover:-translate-y-1
                flex items-center gap-4
              `}
            >
              <div className="bg-white/20 p-3 rounded-lg">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{link.label}</h3>
                <p className="text-white/80 text-sm mt-1">Manage content</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Divisions</p>
            <p className="text-3xl font-bold text-green-800 mt-2">5</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Research Centers</p>
            <p className="text-3xl font-bold text-green-800 mt-2">10</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Publications</p>
            <p className="text-3xl font-bold text-green-800 mt-2">1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

