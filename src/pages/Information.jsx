import React from 'react';
import { FileText, Download, Calendar, MapPin, Phone, Mail, Link } from 'lucide-react';

// Using standard green/lime classes for visual consistency with previous components
const ICON_COLOR = "text-lime-500";
const TEXT_COLOR = "text-green-900";
const BG_COLOR = "bg-green-700";
const BUTTON_BG = "bg-lime-400";
const BUTTON_TEXT = "text-green-900";

const Information = () => {
  const informationSections = [
    {
      title: "Research Publications",
      description: "Access our latest research papers, reports, and scientific publications.",
      icon: <FileText className={`h-8 w-8 ${ICON_COLOR}`} />,
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
      icon: <Download className={`h-8 w-8 ${ICON_COLOR}`} />,
      items: [
        { name: "Research Permit Application", action: "Download", type: "file" },
        { name: "Collaboration Agreement Form", action: "Download", type: "file" },
        { name: "Data Access Request Form", action: "Download", type: "file" },
        { name: "Publication Permission Form", action: "Download", type: "file" },
      ]
    },
    {
      title: "Events & Workshops",
      description: "Stay updated with our upcoming events, workshops, and conferences.",
      icon: <Calendar className={`h-8 w-8 ${ICON_COLOR}`} />,
      items: [
        { name: "Forest Conservation Workshop - March 2024", action: "View Details", type: "link" },
        { name: "Biodiversity Research Conference - May 2024", action: "View Details", type: "link" },
        { name: "Nursery Management Training - July 2024", action: "View Details", type: "link" },
        { name: "Annual Research Symposium - December 2024", action: "View Details", type: "link" },
      ]
    },
    {
      title: "Official Circulars",
      description: "View important circulars and official announcements from the Research Wing.",
      icon: <FileText className={`h-8 w-8 ${ICON_COLOR}`} />, // Reusing FileText or use a new icon
      items: [
        { name: "New Research Grant Policy (Oct 2024)", action: "Download", type: "file" },
        { name: "Office Holiday Schedule 2025", action: "Download", type: "file" },
        { name: "Field Travel Guidelines Update", action: "Download", type: "file" },
        { name: "Q3 Progress Report Submission", action: "Download", type: "file" },
      ]
    }
  ];

  const quickLinks = [
    { name: "Research Guidelines", url: "#" },
    { name: "Data Repository", url: "#" },
    { name: "Collaboration Opportunities", url: "#" },
    { name: "Student Programs", url: "#" },
    { name: "Media Resources", url: "#" },
    { name: "Annual Reports", url: "#" }
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
                    <span className={`text-lime-500 mr-3 font-extrabold`}>•</span>
                    <span className="flex-1 font-medium">{item.name}</span>
                    
                    {/* Conditional Icon for File or Link */}
                    {item.type === 'file' ? (
                      <span className="flex items-center text-sm text-green-600 group-hover:text-green-700">
                        {item.action} <Download className="h-4 w-4 ml-2" />
                      </span>
                    ) : (
                      <span className="flex items-center text-sm text-green-600 group-hover:text-green-700">
                        {item.action} <Link className="h-4 w-4 ml-2" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Quick Links */}
        <div className={`bg-white rounded-xl shadow-xl p-8 mb-16 border-l-8 border-green-500`}>
          <h2 className={`text-3xl font-bold ${TEXT_COLOR} mb-6 text-center`}>
            Essential Resources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="p-4 text-center border border-green-200 rounded-lg hover:bg-lime-50 transition-all duration-200"
              >
                <div className="text-base font-semibold text-green-800">{link.name}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact and Office Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          
          {/* Contact Info Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-green-100">
            <h2 className={`text-2xl font-bold ${TEXT_COLOR} mb-6 flex items-center`}>
                <Phone className={`h-6 w-6 mr-3 ${ICON_COLOR}`} /> Get in Touch
            </h2>
            <div className="space-y-6">
              <ContactDetail 
                icon={MapPin} 
                title="Main Office" 
                detail="Forest Department Complex, Chennai, Tamil Nadu 600006" 
                type="address"
              />
              <ContactDetail 
                icon={Phone} 
                title="General Enquiries" 
                detail="+91 XXXXX XXXXX" // Placeholder
                type="phone"
              />
              <ContactDetail 
                icon={Mail} 
                title="Research Email" 
                detail="example@example.com" // Placeholder
                type="email"
              />
            </div>
          </div>

          {/* Office Hours Card */}
          <div className={`rounded-xl shadow-xl p-8 ${BG_COLOR} text-white`}>
            <h2 className="text-2xl font-bold text-lime-400 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-lime-400" /> Office Hours
            </h2>
            <div className="space-y-4">
              <ScheduleItem day="Monday - Friday" hours="9:00 AM - 5:00 PM" />
              <ScheduleItem day="Saturday" hours="9:00 AM - 1:00 PM" />
              <ScheduleItem day="Sunday" hours="Closed" isClosed={true} />
            </div>
            <div className="mt-8 p-4 bg-green-900/50 rounded-lg border border-lime-400">
              <p className="text-sm text-green-200">
                <strong>Note:</strong> For urgent matters outside of these hours, please use the official **emergency contact** details provided in the latest circular.
              </p>
            </div>
          </div>
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
            <button className={`${BUTTON_BG} ${BUTTON_TEXT} px-8 py-3 rounded-lg font-bold hover:bg-lime-300 transition-colors duration-300 shadow-lg`}>
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components for Clean Structure ---

const ContactDetail = ({ icon: Icon, title, detail, type }) => (
    <div className="flex items-start">
        <Icon className={`h-5 w-5 ${ICON_COLOR} mr-3 mt-1 flex-shrink-0`} />
        <div>
            <div className="font-semibold text-gray-800">{title}</div>
            <div className={`text-gray-600 ${type === 'address' ? 'leading-snug' : ''}`}>{detail}</div>
        </div>
    </div>
);

const ScheduleItem = ({ day, hours, isClosed }) => (
    <div className={`flex justify-between p-3 rounded-lg ${isClosed ? 'bg-green-600' : 'bg-green-600/50'}`}>
        <span className="text-green-200">{day}</span>
        <span className={`font-semibold ${isClosed ? 'text-lime-400' : 'text-white'}`}>{hours}</span>
    </div>
);

export default Information;