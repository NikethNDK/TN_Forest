import React, { useState, useEffect } from 'react';
import FacultyCard from '../components/faculty/FacultyCard';
import { getAllFaculty } from '../services/firebase/facultyService';
import type { FacultyMember } from '../types';
import { Loader2 } from 'lucide-react';

const Faculty: React.FC = () => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError(null);
        const members = await getAllFaculty();
        setFacultyMembers(members);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load faculty members');
        console.error('Error fetching faculty:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-background-page min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
            <span className="ml-3 text-content-secondary">Loading faculty members...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-background-page min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-status-error-main mb-4">Error loading faculty members: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-interactive-primaryDefault text-interactive-primaryText rounded-lg hover:bg-interactive-primaryHover"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background-page min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-medium text-content-primary mb-2">
            Leadership & Governance
          </h1>
          <p className="text-sm text-content-tertiary max-w-xl mx-auto">
            The distinguished leadership team of the Tamil Nadu Forest Department.
          </p>
        </div>

        {/* Faculty Grid */}
        {facultyMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {facultyMembers.map((member) => (
              <FacultyCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-content-tertiary">
            <p>No faculty members available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faculty;
