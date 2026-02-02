import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StoreSidebar from '../../../components/admin/StoreSidebar';
import { onAuthStateChange, isAuthenticatedAdmin } from '../../../services/firebase/authService';
import { LoadingSpinner } from '../../../components/common';
import type { User } from 'firebase/auth';

const AdminShopLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user: User | null) => {
      if (user) {
        const adminStatus = await isAuthenticatedAdmin();
        if (adminStatus) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login/admin');
        }
      } else {
        setIsAuthenticated(false);
        navigate('/login/admin');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StoreSidebar />
      <main className="flex-1 ml-64 lg:ml-72">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminShopLayout;
