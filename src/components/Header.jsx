import React from 'react';

const Header = () => {
  return (
    <header className="relative h-screen bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
              height: '100vh',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-green-900/80 to-forest-green-800/60"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow mb-4">
          Welcome to Tamil Nadu Forest Department Research Wing
        </h1>
        
        <p className="text-lg md:text-xl text-green-100 max-w-4xl mx-auto text-shadow mb-8">
          Advancing forest research, conservation, and sustainable development for a greener tomorrow
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-white text-forest-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-300 shadow-lg">
            Explore Research
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-forest-green-800 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
