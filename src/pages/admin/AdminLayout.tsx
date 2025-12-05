import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    // TODO: Replace with Firebase Auth check
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login/admin');
    }
  }, [navigate]);

  // Check authentication before rendering
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 lg:ml-72">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

