import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, GitBranch } from 'lucide-react';
import { subscribeToContactLocations } from '../services/firebase/contactService';
import type { ContactLocation } from '../types';
import ContactForm from '../components/contact/ContactForm';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const ContactUs: React.FC = () => {
  const [locations, setLocations] = useState<ContactLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToContactLocations(
      (locationList) => {
        setLocations(locationList);
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

  return (
    <div className="py-20" style={{ backgroundColor: '#ededed' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Reach Out to Our Team"
          title="Connect with the Research Wing"
          description="We welcome inquiries from researchers, collaborators, and the public. Use the form or reach us directly via phone and email."
        />

        <div className="rounded-xl shadow-inner p-10 mb-20" style={{ backgroundColor: '#d8d3ca' }}>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center" style={{ color: '#37281b' }}>
            <GitBranch className="h-7 w-7 mr-3" style={{ color: '#5f7447' }} />
            Our Research Divisions
          </h2>
          {loading ? (
            <LoadingSpinner message="Loading research divisions..." />
          ) : error ? (
            <ErrorMessage 
              message={`Error loading locations: ${error}`}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              {locations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locations.map((location) => (
                    <div key={location.id} className="bg-white rounded-lg shadow-md p-6 border-b-2 hover:shadow-lg transition-shadow" style={{ borderBottomColor: '#5f7447' }}>
                      <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: '#37281b' }}>{location.name}</h3>
                      <div className="space-y-3 text-sm">
                        {location.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: '#5f7447' }} />
                            <span style={{ color: '#5c5549' }}>{location.location}</span>
                          </div>
                        )}
                        {location.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: '#5f7447' }} />
                            <span style={{ color: '#5c5549' }}>{location.phone}</span>
                          </div>
                        )}
                        {location.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: '#5f7447' }} />
                            <span style={{ color: '#5c5549' }}>{location.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No research divisions available at this time." />
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-bold pb-3 mb-4 border-b" style={{ color: '#37281b', borderColor: '#d8d3ca' }}>
              Official Contact Points
            </h2>
            
            <div className="rounded-xl shadow-lg p-6 text-white" style={{ backgroundColor: '#5f7447' }}>
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 mr-3" style={{ color: 'rgba(255,255,255,0.9)' }} />
                <h3 className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>Monday - Friday</span>
                  <span className="font-semibold">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>Saturday / Sunday</span>
                  <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Closed</span>
                </div>
              </div>
            </div>
          </div>
            
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-xl shadow-2xl p-8 border-t-8" style={{ borderTopColor: '#5f7447' }}>
              <h2 className="text-3xl font-bold mb-6 flex items-center" style={{ color: '#37281b' }}>
                <MessageCircle className="h-7 w-7 mr-3" style={{ color: '#5f7447' }} />
                Send a Direct Inquiry
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

