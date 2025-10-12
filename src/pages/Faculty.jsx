import React from 'react';
import { GraduationCap, Award, BookOpen, Globe, Brain, Leaf, TreePine, Zap, Search } from 'lucide-react';

const Faculty = () => {
  const facultyMembers = [
    {
      name: "Director",
      position: "Director of Research",
      // specialization: "Forest Ecology & GIS",
      experience: "25 years",
      education: "Ph.D. in Forest Sciences",
      achievements: ["Published 50+ papers", "Led 20+ national research projects"],
      image: 'https://via.placeholder.com/150/8DD136/FFFFFF?text=RK' // Placeholder for profile image
    },
    {
      name: "Research Officer",
      position: "Senior Research Scientist",
      // specialization: "Biodiversity Conservation & Genetics",
      experience: "20 years",
      education: "Ph.D. in Environmental Biology",
      achievements: ["Species conservation expert", "International recognition"],
      image: 'https://via.placeholder.com/150/8DD136/FFFFFF?text=PS' // Placeholder for profile image
    },
    // {
    //   name: "Dr. Suresh Menon",
    //   position: "Head - Modern Nursery Division",
    //   specialization: "Plant Propagation & Silviculture",
    //   experience: "18 years",
    //   education: "Ph.D. in Botany",
    //   achievements: ["Developed new propagation techniques", "Industry consultant", "Awarded for Nursery Management"],
    //   image: 'https://via.placeholder.com/150/8DD136/FFFFFF?text=SM' // Placeholder for profile image
    // },
    // {
    //   name: "Dr. Lakshmi Nair",
    //   position: "Research Scientist",
    //   specialization: "Forest Genetics & Biotechnology",
    //   experience: "15 years",
    //   education: "Ph.D. in Genetics",
    //   achievements: ["Pioneering genetic diversity studies", "Managed international breeding programs", "Molecular research specialist"],
    //   image: 'https://via.placeholder.com/150/8DD136/FFFFFF?text=LN' // Placeholder for profile image
    // }
  ];

  // Helper component for the faculty card
  const FacultyCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-xl border border-green-100 p-8 transform hover:scale-[1.01] transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        
        {/* Image/Icon Area */}
        <div className="flex-shrink-0">
          {/* Using a placeholder circle. In a real app, replace with <img src={member.image} /> */}
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-300 shadow-lg">
             <GraduationCap className="h-10 w-10 text-green-700" />
          </div>
        </div>

        {/* Info Area */}
        <div className="text-center sm:text-left flex-grow">
          <h3 className="text-3xl font-bold text-green-900 mb-1">{member.name}</h3>
          <p className="text-xl font-semibold text-lime-600 mb-2">{member.position}</p>
          <p className="text-base text-gray-600 border-b border-green-100 pb-3 mb-4">
            {/* Specialization: <span className="font-medium text-green-800">{member.specialization}</span> */}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              {/* <BookOpen className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" /> */}
              {/* <span className="font-semibold">Edu:</span> {member.education} */}
            </div>
            <div className="flex items-center text-gray-700">
              {/* <Award className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" /> */}
              {/* <span className="font-semibold">Exp:</span> {member.experience} */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements Area */}
      <div className="mt-6 pt-6 border-t border-green-100">
        <h4 className="font-bold text-green-900 mb-3 flex items-center text-lg">
          <Zap className="h-5 w-5 text-lime-600 mr-2" /> Key Achievements
        </h4>
        <ul className="text-gray-700 space-y-2 text-sm ml-4">
          {member.achievements.map((achievement, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-lime-600 mr-2 mt-1">•</span>
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-lg font-semibold text-lime-600 mb-2 uppercase tracking-widest">
            Leaders in Forest Science
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
            Our Distinguished Faculty
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Meet the accomplished researchers and scientists whose expertise drives 
            innovation and conservation efforts within the Tamil Nadu Forest Department.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {facultyMembers.map((member, index) => (
            <FacultyCard key={index} member={member} />
          ))}
        </div>

        {/* Research Areas / Expertise Summary */}
        <div className="bg-white rounded-xl shadow-2xl p-10 border-4 border-green-200">
          <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">
            Core Areas of Research Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <ExpertiseBlock icon={Leaf} title="Forest Ecology" description="Ecosystem dynamics" />
            <ExpertiseBlock icon={Globe} title="Biodiversity" description="Species conservation" />
            <ExpertiseBlock icon={Brain} title="Genetics" description="Tree breeding programs" />
            <ExpertiseBlock icon={TreePine} title="Silviculture" description="Sustainable management" />
            <ExpertiseBlock icon={Search} title="Data Science" description="GIS & Remote Sensing" />
          </div>
        </div>

        {/* Join Our Team CTA */}
        <div className="text-center mt-16 p-10 bg-green-900 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Shape the Future of Forestry
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            We are always looking for passionate researchers and scientists to join our mission 
            of conservation and research excellence.
          </p>
          <button className="bg-lime-400 hover:bg-lime-300 text-green-900 px-10 py-4 rounded-lg font-bold transition-colors duration-300 shadow-lg text-lg">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for Research Area blocks
const ExpertiseBlock = ({ icon: Icon, title, description }) => (
    <div className="text-center p-3">
        <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-lime-500">
            <Icon className="h-8 w-8 text-lime-600" />
        </div>
        <h3 className="font-bold text-green-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
    </div>
);

export default Faculty;