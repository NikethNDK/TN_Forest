import React from 'react';

const Header = () => {
  return (
    <header className="relative h-80 sm:h-96 md:h-[500px] lg:h-[600px] xl:h-[700px] bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
      {/* Overlay - Stays on the outside */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content - This div handles centering all elements (Logo, Title, Text, Buttons) */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* Logo - Responsive sizing with better visibility */}
        <img 
          src="/logo192.png" 
          alt="Tamil Nadu Forest Department Research Wing Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 mb-3 sm:mb-4 md:mb-6 rounded-full" 
        />
        
        {/* Title - Responsive text sizing with better readability */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-shadow mb-2 sm:mb-3 md:mb-4 px-1 leading-tight">
          Welcome to Tamil Nadu Forest Department Research Wing
        </h1>
        
        {/* Subtitle - Responsive text sizing with better readability */}
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-green-100 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto text-shadow mb-4 sm:mb-6 md:mb-8 px-1 leading-relaxed">
          Advancing forest research, conservation, and sustainable development for a greener tomorrow
        </p>
        
        {/* Buttons - Responsive sizing and layout with better mobile experience */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <button className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 shadow-xl text-gray-800 text-xs sm:text-sm md:text-base"
          style={{ backgroundColor: '#8DD136', borderColor: '#8DD136',
                    filter: 'brightness(1.1)' 
                }}>
            Explore Research
          </button>
          <button className="border-2 text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg text-xs sm:text-sm md:text-base"
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