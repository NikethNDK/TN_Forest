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
    <div className="py-20 bg-background-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          badge="Reach Out to Our Team"
          title="Connect with the Research Wing"
          description="We welcome inquiries from researchers, collaborators, and the public. Use the form or reach us directly via phone and email."
        />

        <div className="bg-primary-lightest rounded-xl shadow-inner p-10 mb-20">
          <h2 className="text-3xl font-bold text-content-heading mb-8 text-center flex items-center justify-center">
            <GitBranch className="h-7 w-7 text-accent-darker mr-3" />
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
                    <div key={location.id} className="bg-background-paper rounded-lg shadow-md p-6 border-b-2 border-primary-light hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-semibold text-content-headingSecondary mb-4 text-center">{location.name}</h3>
                      <div className="space-y-3 text-sm">
                        {location.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-primary-main mr-3 flex-shrink-0" />
                            <span className="text-content-secondary">{location.location}</span>
                          </div>
                        )}
                        {location.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-primary-main mr-3 flex-shrink-0" />
                            <span className="text-content-secondary">{location.phone}</span>
                          </div>
                        )}
                        {location.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-primary-main mr-3 flex-shrink-0" />
                            <span className="text-content-secondary">{location.email}</span>
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
            <h2 className="text-2xl font-bold text-content-heading border-b border-border-light pb-3 mb-4">
              Official Contact Points
            </h2>
            
            <div className="bg-primary-dark text-content-inverse rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-accent-light mr-3" />
                <h3 className="text-xl font-bold text-accent-light">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border-primary pb-1">
                  <span className="text-content-inverseSecondary">Monday - Friday</span>
                  <span className="font-semibold">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-inverseSecondary">Saturday / Sunday</span>
                  <span className="font-semibold text-accent-light">Closed</span>
                </div>
              </div>
            </div>
          </div>
            
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-background-paper rounded-xl shadow-2xl p-8 border-t-8 border-primary-main">
              <h2 className="text-3xl font-bold text-content-heading mb-6 flex items-center">
                <MessageCircle className="h-7 w-7 text-accent-darker mr-3" />
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

