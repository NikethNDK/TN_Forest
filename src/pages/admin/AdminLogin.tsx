import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, Leaf } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Replace with actual Firebase authentication
    // For now, this is a placeholder that allows access
    // In production, you'll use Firebase Auth here
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Placeholder validation - replace with Firebase Auth
      if (formData.email && formData.password) {
        // Store auth state (in production, this will be handled by Firebase)
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full flex">
        {/* Left Side - Logo and Website Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-8 xl:px-16">
          <div className="text-center max-w-2xl">
            {/* Logo */}
            <img 
              src="/logo192.png" 
              alt="Tamil Nadu Forest Department Research Wing Logo"
              className="w-32 h-32 xl:w-40 xl:h-40 mb-6 mx-auto rounded-full shadow-2xl"
            />
            
            {/* Title */}
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              TAMIL NADU FOREST DEPARTMENT - RESEARCH WING
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg xl:text-xl 2xl:text-2xl text-green-100 max-w-xl mx-auto leading-relaxed drop-shadow-lg mb-8">
              Advancing forest research, conservation, and sustainable development for a greener tomorrow
            </p>

            {/* Admin Portal Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Shield className="h-6 w-6 text-white" />
              <span className="text-white font-semibold text-lg">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo/Header (shown only on small screens) */}
            <div className="lg:hidden text-center mb-8">
              <img 
                src="/logo192.png" 
                alt="Tamil Nadu Forest Department Research Wing Logo"
                className="w-20 h-20 mb-4 mx-auto rounded-full"
              />
              <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                Admin Portal
              </h1>
              <p className="text-green-100 drop-shadow-lg">
                Tamil Nadu Forest Department Research Wing
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="h-5 w-5 text-green-600" />
                <h2 className="text-2xl font-bold text-green-900">Sign In</h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="admin@tnfrd.gov.in"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Secure access to the admin panel. Unauthorized access is prohibited.
                </p>
              </div>
            </div>

            {/* Back to Website Link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-white hover:text-green-200 hover:underline drop-shadow-lg"
              >
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
