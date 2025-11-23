import React from 'react';
import { FileText, Download } from 'lucide-react';

interface InformationItem {
  name: string;
  action: string;
  type: string;
}

interface InformationSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: InformationItem[];
}

const Information: React.FC = () => {
  const informationSections: InformationSection[] = [
    {
      title: "Research Publications",
      description: "Access our latest research papers, reports, and scientific publications.",
      icon: <FileText className="h-8 w-8 text-lime-500" />,
      items: [
        { name: "Annual Research Report 2024", action: "Download", type: "file" },
        { name: "Forest Conservation Guidelines", action: "Download", type: "file" },
        { name: "Biodiversity Assessment Report", action: "Download", type: "file" },
        { name: "Climate Change Impact Study", action: "Download", type: "file" },
      ]
    },
    {
      title: "Forms & Applications",
      description: "Download forms for research permits, collaborations, and partnerships.",
      icon: <Download className="h-8 w-8 text-lime-500" />,
      items: [
        { name: "Research Permit Application", action: "Download", type: "file" },
        { name: "Collaboration Agreement Form", action: "Download", type: "file" },
        { name: "Data Access Request Form", action: "Download", type: "file" },
        { name: "Publication Permission Form", action: "Download", type: "file" },
      ]
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-lg font-semibold text-lime-600 mb-2 uppercase tracking-widest">
            Resources & Access
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
            Information Center
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Quickly find the documents, applications, and contact details you need for 
            collaboration and research with the T.N. Forest Department.
          </p>
        </div>

        {/* Information Sections (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {informationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-lime-500">
              <div className="flex items-start mb-6 border-b pb-4 border-green-100">
                <div className="p-3 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-1">{section.title}</h2>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
              </div>

              <ul className="space-y-4">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 hover:text-green-700 transition-colors cursor-pointer group">
                    <span className="text-lime-500 mr-3 font-extrabold">•</span>
                    <span className="flex-1 font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup (CTA) */}
        <div className="text-center bg-green-900 rounded-xl p-10">
          <h2 className="text-3xl font-bold text-lime-400 mb-4">
            Subscribe to Our Research Bulletin
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
            Receive the latest official announcements, research findings, and event invitations directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your professional email address"
              className="flex-1 px-5 py-3 rounded-lg border-0 focus:ring-4 focus:ring-lime-500 shadow-inner"
            />
            <button className="bg-lime-400 text-green-900 px-8 py-3 rounded-lg font-bold hover:bg-lime-300 transition-colors duration-300 shadow-lg">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;

