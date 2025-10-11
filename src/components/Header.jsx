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
      {/* Overlay - Stays on the outside */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content - This div handles centering all elements (Logo, Title, Text, Buttons) */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        
        {/* Logo - MOVED INSIDE the centering div */}
        <img 
          // Corrected Path: Reference public folder files directly from the root (/)
          src="/logo192.png" 
          alt="Tamil Nadu Forest Department Research Wing Logo"
          // Added rounded-full class for an optional circular logo look
          className="w-24 h-24 md:w-36 md:h-36 mb-6 rounded-full" 
        />
        
        <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow mb-4">
          Welcome to Tamil Nadu Forest Department Research Wing
        </h1>
        
        <p className="text-lg md:text-xl text-green-100 max-w-4xl mx-auto text-shadow mb-8">
          Advancing forest research, conservation, and sustainable development for a greener tomorrow
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-xl text-gray-800"
          style={{ backgroundColor: '#8DD136', borderColor: '#8DD136',
                    filter: 'brightness(1.1)' 
                }}>
            Explore Research
          </button>
          <button className="border-2 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg"
            style={{ 
              borderColor: '#EAE8D9', 
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#EAE8D9';
                e.currentTarget.style.color = '#333'; // Dark text on hover
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white'; // White text off hover
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;