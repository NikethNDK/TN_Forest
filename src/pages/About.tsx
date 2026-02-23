import React, { useState, useEffect } from 'react';
import { Target, Eye } from 'lucide-react';
import FacultyCard from '../components/faculty/FacultyCard';
import { subscribeToFaculty } from '../services/firebase/facultyService';
import { subscribeToMissionVision } from '../services/firebase/aboutService';
import type { FacultyMember, MissionVision } from '../types';
import PageBanner from '../components/common/PageBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import SectionHeader from '../components/common/SectionHeader';

const About: React.FC = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [missionVision, setMissionVision] = useState<MissionVision | null>(null);
  const [loading, setLoading] = useState(true);
  const [missionVisionLoading, setMissionVisionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to faculty members
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

    return () => {
      unsubscribe();
    };
  }, []);

  // Subscribe to mission and vision
  useEffect(() => {
    setMissionVisionLoading(true);

    const unsubscribe = subscribeToMissionVision(
      (data) => {
        setMissionVision(data);
        setMissionVisionLoading(false);
      },
      (err) => {
        console.error('Error loading mission/vision:', err);
        setMissionVisionLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ededed' }}>
      {/* Introductory Banner/Header */}
      <PageBanner
        subtitle="Our Legacy of Science and Stewardship"
        title="About the Research Wing"
        description="The Tamil Nadu Forest Department Research Wing is the scientific foundation for conservation, committed to ecological innovation and sustainable forestry."
        backgroundImage="https://png.pngtree.com/thumb_back/fh260/back_our/20200630/ourmid/pngtree-green-small-fresh-forest-banner-image_340874.jpg"
      />
      
      {/* Mission and Vision */}
      <section className="py-20" style={{ backgroundColor: '#d8d3ca' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {missionVisionLoading ? (
            <LoadingSpinner message="Loading mission and vision..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="rounded-xl shadow-xl p-10 border-t-4 transition-shadow duration-300 hover:shadow-2xl" style={{ backgroundColor: '#ffffff', borderTopColor: '#5f7447' }}>
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 p-2 rounded-full mr-3 flex items-center justify-center" style={{ backgroundColor: '#5f7447' }}>
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#37281b' }}>Our Mission</h2>
                </div>
                <div 
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{ whiteSpace: 'pre-wrap', color: '#5c5549' }}
                >
                  {missionVision?.mission || 'Mission content will appear here...'}
                </div>
              </div>

              {/* Vision */}
              <div className="rounded-xl shadow-xl p-10 border-t-4 transition-shadow duration-300 hover:shadow-2xl" style={{ backgroundColor: '#ffffff', borderTopColor: '#5f7447' }}>
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 p-2 rounded-full mr-3 flex items-center justify-center" style={{ backgroundColor: '#5f7447' }}>
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#37281b' }}>Our Vision</h2>
                </div>
                <div 
                  className="leading-relaxed whitespace-pre-wrap"
                  style={{ whiteSpace: 'pre-wrap', color: '#5c5549' }}
                >
                  {missionVision?.vision || 'Vision content will appear here...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Leadership & Governance Section */}
      <section className="py-20" style={{ backgroundColor: '#ededed' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Leadership & Governance"
            description="The distinguished leadership team of the Tamil Nadu Forest Department."
          />

          {loading ? (
            <LoadingSpinner message="Loading faculty members..." />
          ) : error ? (
            <ErrorMessage 
              message={`Error loading faculty members: ${error}`}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              {facultyMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {facultyMembers.map((member) => (
                    <FacultyCard key={member.id} member={member} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No faculty members available at this time." />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
