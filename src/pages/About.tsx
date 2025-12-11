import React, { useState, useEffect } from 'react';
import { Target, Eye, Loader2 } from 'lucide-react';
import FacultyCard from '../components/faculty/FacultyCard';
import { subscribeToFaculty } from '../services/firebase/facultyService';
import type { FacultyMember } from '../types';

const About: React.FC = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToFaculty(
      (members) => {
        setFacultyMembers(members);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Introductory Banner/Header */}
      <div 
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549490216-3a137b01d1c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-green-900/70"></div>
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
      
      {/* Mission and Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-xl shadow-xl p-10 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <Target className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Our Mission</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To embrace the drive for innovation in soil health by developing and scaling biofertilizer solutions that improve soil fertility, ecosystem resilience, and biodiversity and producing high-quality, climate-resilient tree seedlings to support reforestation and land restoration efforts and sustainable agroforestry.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By providing superior forest tree seeds to government agencies, stakeholders, and communities, with an aim to promote widespread adoption of sustainable forestry practices. The efforts will also focus on the conservation and management of rare, endangered, and threatened (RET) species, ensuring ecological stability and long-term environmental sustainability.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Through collaborative research and strategic partnerships, we strive to be a catalyst for transformative change in forest and land management.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl shadow-xl p-10 border-t-4 border-green-600 transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <Eye className="h-10 w-10 p-2 bg-green-100 text-green-700 rounded-full mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Our Vision</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production and research, developing advanced microbial inoculants to enhance soil fertility and ecosystem productivity and biodiversity improvement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We envision the production of high-quality, climate-resilient seedlings to support reforestation and restoration efforts, while supplying quality forest tree seeds for the forest department, line departments and other stakeholders.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our vision extends to fostering sustainable management practices in rare, endangered, and threatened (RET) species for long-term ecological benefits, ensuring that our efforts contribute to a more resilient and sustainable future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Governance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">
              Leadership & Governance
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              The distinguished leadership team of the Tamil Nadu Forest Department.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-600">Loading faculty members...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading faculty members: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {facultyMembers.map((member) => (
                <FacultyCard key={member.id} member={member} />
              ))}
            </div>
          )}

          {!loading && !error && facultyMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No faculty members available at this time.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
