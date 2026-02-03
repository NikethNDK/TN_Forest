import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Search, Filter, ExternalLink } from 'lucide-react';
import { getAllPublications } from '../services/firebase/publicationService';
import { getCategories } from '../services/firebase/publicationCategoryService';
import type { Publication } from '../types';

const Publication: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load publications and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [pubs, cats] = await Promise.all([
          getAllPublications(),
          getCategories()
        ]);
        setPublications(pubs);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading publications:', err);
        setError('Failed to load publications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-content-secondary">Loading publications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-background-paper rounded-lg shadow-lg">
            <p className="text-status-error-main">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-content-headingSecondary mb-6">
            Publications
          </h1>
          <p className="text-xl text-content-secondary max-w-3xl mx-auto leading-relaxed">
            Explore our research publications, technical reports, and scientific papers 
            covering various aspects of forest conservation and research.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-background-paper rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-content-muted" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-content-muted" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-form-inputFocus focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((publication, index) => (
              <div key={publication.id || `pub-${index}`} className="bg-background-paper rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-content-headingSecondary mb-2">
                        {publication.title}
                      </h3>
                      <span className="bg-primary-lighter text-primary-dark px-3 py-1 rounded-full text-sm font-medium">
                        {publication.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-content-tertiary mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {publication.year}
                      </div>
                      {publication.journal && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {publication.journal}
                        </div>
                      )}
                    </div>
                    
                    {publication.description && (
                      <p className="text-content-primary mb-4">
                        {publication.description}
                      </p>
                    )}
                  </div>
                  
                  {publication.pdfUrl && (
                    <div className="flex flex-col gap-2">
                      <a
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-border-primary text-content-link hover:bg-primary-lightest px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-background-paper rounded-lg shadow-lg">
              <p className="text-content-secondary">No publications found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publication;
