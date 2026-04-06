import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import {
  onAuthStateChange,
  isAuthenticatedAdmin,
  getCurrentUser,
  getAdminFirestoreProfile,
} from '../../services/firebase/authService';
import { LoadingSpinner } from '../../components/common';
import type { User } from 'firebase/auth';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChange(async (user: User | null) => {
      if (user) {
        // Check if user is admin
        const adminStatus = await isAuthenticatedAdmin();
        if (adminStatus) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login/admin');
        }
      } else {
        setIsAuthenticated(false);
        const next = encodeURIComponent(location.pathname);
        navigate(`/login/admin?next=${next}`);
      }
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Division admins may only use EcoStore (`/admin/shop/**`); keep them out of main CMS
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const user = getCurrentUser();
    if (!user) return;
    let cancelled = false;
    (async () => {
      const profile = await getAdminFirestoreProfile(user.uid);
      if (cancelled) return;
      if (profile?.admin_type === 'division_admin' && !location.pathname.startsWith('/admin/shop')) {
        navigate('/admin/shop', { replace: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading..." size="lg" />
      </div>
    );
  }

  // Don't render admin panel if not authenticated
  if (!isAuthenticated) {
    return null;
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

