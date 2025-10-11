import React, { useState } from 'react';
import { FileText, Download, Calendar, Search, Filter } from 'lucide-react';

const Publication = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publications = [
    {
      id: 1,
      title: "Forest Biodiversity Conservation in Tamil Nadu: A Comprehensive Study",
      authors: "Dr. Rajesh Kumar, Dr. Priya Sharma, Dr. Suresh Menon",
      year: 2024,
      category: "Research Paper",
      journal: "Journal of Forest Conservation",
      description: "A detailed study on biodiversity conservation strategies and their implementation in Tamil Nadu forests.",
      pdfUrl: "/pdfs/biodiversity-study-2024.pdf"
    },
    {
      id: 2,
      title: "Modern Nursery Techniques for Forest Tree Species",
      authors: "Dr. Suresh Menon, Dr. Lakshmi Nair",
      year: 2024,
      category: "Technical Report",
      journal: "Forest Research Bulletin",
      description: "Comprehensive guide on modern nursery management and propagation techniques for forest trees.",
      pdfUrl: "/pdfs/nursery-techniques-2024.pdf"
    },
    {
      id: 3,
      title: "Climate Change Impact on Forest Ecosystems",
      authors: "Dr. Priya Sharma, Dr. Rajesh Kumar",
      year: 2023,
      category: "Research Paper",
      journal: "Environmental Science Journal",
      description: "Analysis of climate change effects on forest ecosystems and adaptation strategies.",
      pdfUrl: "/pdfs/climate-impact-2023.pdf"
    },
    {
      id: 4,
      title: "Annual Research Report 2023",
      authors: "TNFDRW Research Team",
      year: 2023,
      category: "Annual Report",
      journal: "TNFDRW Publications",
      description: "Comprehensive annual report covering all research activities and achievements.",
      pdfUrl: "/pdfs/annual-report-2023.pdf"
    },
    {
      id: 5,
      title: "Forest Genetics and Breeding Programs",
      authors: "Dr. Lakshmi Nair, Dr. Suresh Menon",
      year: 2023,
      category: "Research Paper",
      journal: "Genetics and Forest Science",
      description: "Research on forest tree genetics and breeding programs for improved varieties.",
      pdfUrl: "/pdfs/forest-genetics-2023.pdf"
    },
    {
      id: 6,
      title: "Sustainable Forest Management Guidelines",
      authors: "TNFDRW Policy Team",
      year: 2023,
      category: "Policy Document",
      journal: "Forest Policy Guidelines",
      description: "Guidelines for sustainable forest management practices in Tamil Nadu.",
      pdfUrl: "/pdfs/sustainable-management-2023.pdf"
    }
  ];

  const categories = ['all', 'Research Paper', 'Technical Report', 'Annual Report', 'Policy Document'];

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Publications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our research publications, technical reports, and scientific papers 
            covering various aspects of forest conservation and research.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {filteredPublications.map((publication) => (
            <div key={publication.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-forest-green-800 mb-2">
                      {publication.title}
                    </h3>
                    <span className="bg-forest-green-100 text-forest-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {publication.category}
                    </span>
                  </div>
                  
                  <div className="text-gray-600 mb-3">
                    <strong>Authors:</strong> {publication.authors}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {publication.year}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {publication.journal}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {publication.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  <button className="border border-forest-green-600 text-forest-green-600 hover:bg-forest-green-50 px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 bg-forest-green-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-6 text-center">
            Publication Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">150+</div>
              <div className="text-gray-600">Total Publications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">50+</div>
              <div className="text-gray-600">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">25+</div>
              <div className="text-gray-600">Technical Reports</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-forest-green-600 mb-2">15+</div>
              <div className="text-gray-600">Policy Documents</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-4">
            Submit Your Research
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We welcome research submissions from forest scientists, conservationists, 
            and environmental researchers.
          </p>
          <button className="bg-forest-green-600 hover:bg-forest-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Submit Publication
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publication;
