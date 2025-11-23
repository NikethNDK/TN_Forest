import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar } from 'lucide-react';
import type { Experiment } from '../types';

interface ProjectsProps {
  projects: Experiment[];
  title: string;
  type: 'current' | 'completed';
}

const Projects: React.FC<ProjectsProps> = ({ projects, title, type }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title');

  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.startDate || '2024-01-01').getTime() - new Date(a.startDate || '2024-01-01').getTime();
        default:
          return 0;
      }
    });

  const handleViewPDF = (project: Experiment): void => {
    if (project.pdfUrl) {
      window.open(project.pdfUrl, '_blank');
    } else if (project.pdfPath) {
      window.open(`/${project.pdfPath}`, '_blank');
    }
  };

  const handleDownloadPDF = (project: Experiment): void => {
    if (project.pdfUrl) {
      const link = document.createElement('a');
      link.href = project.pdfUrl;
      link.download = `${project.title}.pdf`;
      link.click();
    } else if (project.pdfPath) {
      const link = document.createElement('a');
      link.href = `/${project.pdfPath}`;
      link.download = `${project.title}.pdf`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-2xl font-bold text-green-800 flex items-center">
          <FileText className="h-6 w-6 mr-3" />
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{projects.length} {type === 'current' ? 'Active' : 'Completed'} Projects</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="title">Sort by Title</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map((project, index) => (
            <div key={project.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">
                      {project.title}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      type === 'current' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {type === 'current' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.year || project.startDate || '2024'}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      PDF Document
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {project.description}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleViewPDF(project)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(project)}
                    className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No {type === 'current' ? 'Active' : 'Completed'} Projects Found
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : `No ${type === 'current' ? 'active' : 'completed'} projects available at the moment.`
            }
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-800">
              {projects.length}
            </div>
            <div className="text-sm text-gray-600">
              Total {type === 'current' ? 'Active' : 'Completed'} Projects
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-800">
              {projects.filter(p => p.pdfUrl || p.pdfPath).length}
            </div>
            <div className="text-sm text-gray-600">
              Available PDFs
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-800">
              {new Set(projects.map(p => p.year?.toString() || '2024')).size}
            </div>
            <div className="text-sm text-gray-600">
              Years Covered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

