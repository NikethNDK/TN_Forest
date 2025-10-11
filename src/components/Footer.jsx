import React from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tamil Nadu Forest Department</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Dedicated to forest research, conservation, and sustainable development 
              for the betterment of Tamil Nadu's natural heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-green-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-green-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/divisions" className="text-green-100 hover:text-white transition-colors">Divisions</a></li>
              <li><a href="/publication" className="text-green-100 hover:text-white transition-colors">Publications</a></li>
              <li><a href="/contact" className="text-green-100 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Research Divisions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Research Divisions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/divisions/state-forest-research" className="text-green-100 hover:text-white transition-colors">State Forest Research</a></li>
              <li><a href="/divisions/modern-nursery" className="text-green-100 hover:text-white transition-colors">Modern Nursery</a></li>
              <li><a href="/divisions/forest-genetics" className="text-green-100 hover:text-white transition-colors">Forest Genetics</a></li>
              <li><a href="/divisions/industrial-wood" className="text-green-100 hover:text-white transition-colors">Industrial Wood</a></li>
              <li><a href="/divisions/agro-forestry" className="text-green-100 hover:text-white transition-colors">Agro Forestry</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-1 mr-2 text-green-300" />
                <span className="text-green-100">
                  Forest Department Complex,<br />
                  Chennai, Tamil Nadu 600006
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-300" />
                <span className="text-green-100">+91 44 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-300" />
                <span className="text-green-100">info@tnfrd.gov.in</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-300" />
                <span className="text-green-100">www.tnfrd.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-green-700 mt-8 pt-8 text-center">
          <p className="text-green-100 text-sm">
            © 2024 Tamil Nadu Forest Department Research Wing. All rights reserved.
          </p>
          <p className="text-green-200 text-xs mt-2">
            Committed to forest conservation and sustainable development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
