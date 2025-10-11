import React from 'react';
import { FileText, Download, Calendar, MapPin, Phone, Mail } from 'lucide-react';

const Information = () => {
  const informationSections = [
    {
      title: "Research Publications",
      description: "Access our latest research papers, reports, and scientific publications.",
      icon: <FileText className="h-8 w-8 text-forest-green-600" />,
      items: [
        "Annual Research Report 2024",
        "Forest Conservation Guidelines",
        "Biodiversity Assessment Report",
        "Climate Change Impact Study"
      ]
    },
    {
      title: "Forms & Applications",
      description: "Download forms for research permits, collaborations, and partnerships.",
      icon: <Download className="h-8 w-8 text-forest-green-600" />,
      items: [
        "Research Permit Application",
        "Collaboration Agreement Form",
        "Data Access Request Form",
        "Publication Permission Form"
      ]
    },
    {
      title: "Events & Workshops",
      description: "Stay updated with our upcoming events, workshops, and conferences.",
      icon: <Calendar className="h-8 w-8 text-forest-green-600" />,
      items: [
        "Forest Conservation Workshop - March 2024",
        "Biodiversity Research Conference - May 2024",
        "Nursery Management Training - July 2024",
        "Annual Research Symposium - December 2024"
      ]
    },
    {
      title: "Contact Information",
      description: "Get in touch with our research teams and administrative staff.",
      icon: <Phone className="h-8 w-8 text-forest-green-600" />,
      items: [
        "Main Office: +91 44 1234 5678",
        "Research Division: +91 44 1234 5679",
        "Email: info@tnfrd.gov.in",
        "Emergency: +91 44 1234 5680"
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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Information Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access important information, documents, and resources related to our research 
            activities and forest conservation efforts.
          </p>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {informationSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="mr-4">{section.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-forest-green-800 mb-2">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 hover:text-forest-green-600 transition-colors">
                    <span className="text-forest-green-600 mr-3">•</span>
                    <span className="flex-1">{item}</span>
                    <Download className="h-4 w-4 text-forest-green-600" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-forest-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="bg-white rounded-lg p-4 text-center hover:bg-forest-green-100 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <div className="text-sm font-medium text-forest-green-800">{link.name}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-forest-green-800 mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-forest-green-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-800">Main Office</div>
                  <div className="text-gray-600">
                    Forest Department Complex,<br />
                    Chennai, Tamil Nadu 600006
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-forest-green-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-800">Phone</div>
                  <div className="text-gray-600">+91 44 1234 5678</div>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-forest-green-600 mr-3" />
                <div>
                  <div className="font-semibold text-gray-800">Email</div>
                  <div className="text-gray-600">info@tnfrd.gov.in</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-forest-green-800 mb-6">Office Hours</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-semibold text-gray-800">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-semibold text-gray-800">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-semibold text-gray-800">Closed</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-forest-green-50 rounded-lg">
              <p className="text-sm text-forest-green-800">
                <strong>Note:</strong> For urgent matters, please contact our emergency line 
                or send an email to emergency@tnfrd.gov.in
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center bg-forest-green-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest updates on research findings, 
            events, and conservation efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-forest-green-500"
            />
            <button className="bg-white text-forest-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
