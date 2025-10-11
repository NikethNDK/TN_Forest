import React from 'react';
import { Target, Eye, Users, Award, TreePine } from 'lucide-react';

const About = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            About Tamil Nadu Forest Department Research Wing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dedicated to advancing forest science and conservation through innovative research, 
            education, and community engagement.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-forest-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-forest-green-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To conduct cutting-edge research in forest ecology, biodiversity conservation, 
              and sustainable forest management while fostering innovation and scientific excellence 
              for the benefit of Tamil Nadu's natural heritage.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Eye className="h-8 w-8 text-forest-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-forest-green-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be a globally recognized center of excellence in forest research, 
              leading the way in conservation science and sustainable development 
              for future generations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-forest-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-forest-green-800">Our Values</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Excellence, Innovation, Integrity, Collaboration, and Environmental 
              Stewardship guide our research and conservation efforts.
            </p>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-forest-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-6 text-center">
            Our History
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Established in 2008, the Tamil Nadu Forest Department Research Wing has been at the 
              forefront of forest research and conservation in South India. Over the years, we have 
              built a strong foundation of scientific knowledge and practical solutions for forest management.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our research centers across Tamil Nadu have contributed significantly to understanding 
              forest ecosystems, developing sustainable management practices, and conserving biodiversity. 
              We continue to evolve and adapt to new challenges in forest conservation and climate change.
            </p>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-8 text-center">
            Key Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-forest-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-forest-green-800">Research Excellence</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• Published 100+ research papers in international journals</li>
                <li>• Completed 50+ major research projects</li>
                <li>• Developed innovative forest management techniques</li>
                <li>• Contributed to national forest policy development</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TreePine className="h-6 w-6 text-forest-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-forest-green-800">Conservation Impact</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>• Protected 1000+ hectares of forest land</li>
                <li>• Restored degraded forest ecosystems</li>
                <li>• Conserved 50+ endangered species</li>
                <li>• Trained 500+ forest professionals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A dedicated team of scientists, researchers, and conservationists working 
            together to protect and preserve Tamil Nadu's forests.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">25+</div>
              <div className="text-gray-600">Research Scientists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">15+</div>
              <div className="text-gray-600">Field Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">10+</div>
              <div className="text-gray-600">Support Staff</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
