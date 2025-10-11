import React from 'react';
import { TreePine, Leaf, Users, BookOpen, Award, Globe } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <TreePine className="h-12 w-12 text-forest-green-600" />,
      title: "Forest Research",
      description: "Advanced research in forest ecology, biodiversity, and conservation strategies."
    },
    {
      icon: <Leaf className="h-12 w-12 text-forest-green-600" />,
      title: "Modern Nurseries",
      description: "State-of-the-art nurseries for plant propagation and cultivation."
    },
    {
      icon: <Users className="h-12 w-12 text-forest-green-600" />,
      title: "Expert Faculty",
      description: "Dedicated researchers and scientists with decades of experience."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-forest-green-600" />,
      title: "Publications",
      description: "Comprehensive research publications and scientific papers."
    },
    {
      icon: <Award className="h-12 w-12 text-forest-green-600" />,
      title: "Awards & Recognition",
      description: "Recognized for excellence in forest research and conservation."
    },
    {
      icon: <Globe className="h-12 w-12 text-forest-green-600" />,
      title: "Global Impact",
      description: "Contributing to global forest conservation and sustainability."
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Welcome to Tamil Nadu Forest Department Research Wing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are committed to advancing forest research, conservation, and sustainable development 
            through innovative scientific approaches and community engagement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-forest-green-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-forest-green-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">50+</div>
              <div className="text-green-100">Research Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">25+</div>
              <div className="text-green-100">Research Centers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">100+</div>
              <div className="text-green-100">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">15+</div>
              <div className="text-green-100">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of our journey towards a sustainable future through forest conservation and research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Explore Research
            </button>
            <button className="border-2 border-forest-green-600 text-forest-green-600 hover:bg-forest-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
