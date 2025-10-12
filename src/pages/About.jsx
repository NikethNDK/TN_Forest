import React from 'react';
import { Target, Eye, Users, Award, TreePine, History, Leaf, Zap, BarChart3 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Introductory Banner/Header */}
      <div 
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549490216-3a137b01d1c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-green-900/70"></div> {/* Dark Overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-lg font-semibold text-lime-400 mb-2 uppercase tracking-widest">
            Our Legacy of Science and Stewardship
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            About the Research Wing
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-4xl mx-auto">
            The Tamil Nadu Forest Department Research Wing is the scientific foundation 
            for conservation, committed to ecological innovation and sustainable forestry.
          </p>
        </div>
      </div>
      
      {/* 2. Mission, Vision, Values (Updated Design) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-xl shadow-xl p-10 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <Target className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To conduct cutting-edge researchin forest ecology, biodiversity conservation, 
                and sustainable forest management, driving innovation for Tamil Nadu's natural heritage.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl shadow-xl p-10 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <Eye className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To be a globally recognized center of excellence in forest research, 
                leading the way in conservation science and informing sustainable development 
                for future generations.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-xl shadow-xl p-10 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-4">
                <Users className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Our Values</h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                Excellence, Integrity, Innovation, Collaboration, and Environmental Stewardship are the core principles guiding our daily work and strategic decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. History Section (Split Layout) */}
      <section className="py-20 bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-12 text-center lg:text-left">
                <History className="h-16 w-16 text-lime-400 mx-auto lg:mx-0 mb-4" />
                <h2 className="text-4xl font-extrabold mb-3">
                    A Legacy of Conservation
                </h2>
                <p className="text-green-200">
                    driving scientific progress in South Indian forestry.
                </p>
            </div>
            <div className="lg:w-2/3">
                <p className="text-lg text-green-100 leading-relaxed mb-6">
                    Tamil Nadu Forest Department Research Wing has been at the 
                    forefront of forest research in South India. Our formation marked a commitment to 
                    incorporate scientific rigor into practical forest management and policy.
                </p>
                <p className="text-lg text-green-100 leading-relaxed border-l-4 border-lime-400 pl-4">
                    Our numerous research centers across Tamil Nadu have contributed significantly to understanding 
                    complex forest ecosystems, developing sustainable practices like modern propagation techniques, 
                    and securing critical biodiversity hotspots. We continuously evolve to meet the challenges of 
                    climate change and degradation.
                </p>
            </div>
        </div>
      </section>

      {/* 4. Key Achievements (Enhanced Stats Block) */}
      {/* <section className="py-20"> */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
            {/* <h2 className="text-4xl font-extrabold text-green-900 mb-12 text-center">
                Our Impact in Action
            </h2> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"> */}
                
                {/* Achievement Block 1 */}
                {/* <div className="p-6 bg-white rounded-lg shadow-xl border-b-4 border-lime-500">
                    <BarChart3 className="h-10 w-10 text-green-600 mx-auto mb-3" />
                    <div className="text-5xl font-extrabold text-green-800 mb-1">100+</div>
                    <div className="text-gray-600 font-semibold">Research Papers Published</div>
                </div> */}

                {/* Achievement Block 2 */}
                {/* <div className="p-6 bg-white rounded-lg shadow-xl border-b-4 border-lime-500">
                    <TreePine className="h-10 w-10 text-green-600 mx-auto mb-3" />
                    <div className="text-5xl font-extrabold text-green-800 mb-1">50+</div>
                    <div className="text-gray-600 font-semibold">Major Research Projects Completed</div>
                </div> */}
                
                {/* Achievement Block 3 */}
                {/* <div className="p-6 bg-white rounded-lg shadow-xl border-b-4 border-lime-500">
                    <Leaf className="h-10 w-10 text-green-600 mx-auto mb-3" />
                    <div className="text-5xl font-extrabold text-green-800 mb-1">1000+</div>
                    <div className="text-gray-600 font-semibold">Hectares Under Restoration</div>
                </div> */}

                {/* Achievement Block 4 */}
                {/* <div className="p-6 bg-white rounded-lg shadow-xl border-b-4 border-lime-500">
                    <Award className="h-10 w-10 text-green-600 mx-auto mb-3" />
                    <div className="text-5xl font-extrabold text-green-800 mb-1">500+</div>
                    <div className="text-gray-600 font-semibold">Professionals Trained</div>
                </div> */}

            {/* </div> */}
        {/* </div> */}
      {/* </section> */}

      {/* 5. Team and Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Meet Our Experts
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Our research is driven by a multidisciplinary team of dedicated scientists and conservationists.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg hover:bg-lime-50 transition-colors">
              <div className="text-5xl font-extrabold text-green-700 mb-2">25+</div>
              <div className="text-lg font-medium text-gray-700">Research Scientists</div>
            </div>
            <div className="text-center p-6 border rounded-lg hover:bg-lime-50 transition-colors">
              <div className="text-5xl font-extrabold text-green-700 mb-2">15+</div>
              <div className="text-lg font-medium text-gray-700">Field Researchers</div>
            </div>
            <div className="text-center p-6 border rounded-lg hover:bg-lime-50 transition-colors">
              <div className="text-5xl font-extrabold text-green-700 mb-2">10+</div>
              <div className="text-lg font-medium text-gray-700">Support Staff</div>
            </div>
          </div>

          {/* <div className="mt-12">
            <a 
                href="/faculty" 
                className="inline-flex items-center justify-center px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors duration-300 text-lg"
            >
                View Full Faculty Directory
            </a>
          </div> */}
        </div>
      </section>

    </div>
  );
};

export default About;