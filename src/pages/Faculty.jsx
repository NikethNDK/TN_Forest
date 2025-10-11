import React from 'react';
import { GraduationCap, Award, BookOpen, Globe } from 'lucide-react';

const Faculty = () => {
  const facultyMembers = [
    {
      name: "Dr. Rajesh Kumar",
      position: "Director of Research",
      specialization: "Forest Ecology",
      experience: "25 years",
      education: "Ph.D. in Forest Sciences",
      achievements: ["Published 50+ papers", "Led 20+ research projects", "Award winner 2019"]
    },
    {
      name: "Dr. Priya Sharma",
      position: "Senior Research Scientist",
      specialization: "Biodiversity Conservation",
      experience: "20 years",
      education: "Ph.D. in Environmental Biology",
      achievements: ["Species conservation expert", "International recognition", "Mentored 15+ students"]
    },
    {
      name: "Dr. Suresh Menon",
      position: "Head - Modern Nursery Division",
      specialization: "Plant Propagation",
      experience: "18 years",
      education: "Ph.D. in Botany",
      achievements: ["Nursery management expert", "Developed new techniques", "Industry consultant"]
    },
    {
      name: "Dr. Lakshmi Nair",
      position: "Research Scientist",
      specialization: "Forest Genetics",
      experience: "15 years",
      education: "Ph.D. in Genetics",
      achievements: ["Genetic diversity studies", "Breeding programs", "Molecular research"]
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Our Faculty
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our distinguished team of researchers, scientists, and conservation experts 
            who are leading the way in forest research and conservation.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {facultyMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-forest-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-12 w-12 text-forest-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-forest-green-800 mb-2">{member.name}</h3>
                <p className="text-lg text-forest-green-600 font-semibold mb-1">{member.position}</p>
                <p className="text-gray-600">{member.specialization}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-forest-green-600 mr-3" />
                  <span className="text-gray-700"><strong>Experience:</strong> {member.experience}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-forest-green-600 mr-3" />
                  <span className="text-gray-700"><strong>Education:</strong> {member.education}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-forest-green-800 mb-2">Key Achievements:</h4>
                  <ul className="text-gray-600 space-y-1">
                    {member.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-forest-green-600 mr-2">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Research Areas */}
        <div className="bg-forest-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-6 text-center">
            Research Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-forest-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-forest-green-800 mb-2">Forest Ecology</h3>
              <p className="text-sm text-gray-600">Ecosystem dynamics and forest health</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-forest-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-forest-green-800 mb-2">Biodiversity</h3>
              <p className="text-sm text-gray-600">Species conservation and protection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-forest-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-forest-green-800 mb-2">Genetics</h3>
              <p className="text-sm text-gray-600">Forest tree breeding and genetics</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-forest-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-forest-green-800 mb-2">Conservation</h3>
              <p className="text-sm text-gray-600">Sustainable forest management</p>
            </div>
          </div>
        </div>

        {/* Join Our Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
            Join Our Research Team
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We welcome passionate researchers and scientists to join our mission 
            of forest conservation and research excellence.
          </p>
          <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faculty;
