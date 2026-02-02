import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import QueryProvider from './providers/QueryProvider';
import { adminRoutes } from './routes/AdminRoutes';
import { adminShopRoutes } from './routes/AdminShopRoutes';
import { publicRoutes } from './routes/PublicRoutes';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {adminShopRoutes}
          {adminRoutes}
          {publicRoutes}
        </Routes>
      </Router>
    </QueryProvider>
  );
};

export default App;
