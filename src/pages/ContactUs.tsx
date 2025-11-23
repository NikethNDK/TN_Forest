import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, GitBranch } from 'lucide-react';
import type { ContactInfo, ResearchCenterContact } from '../types';
import ContactForm from '../components/contact/ContactForm';

const ContactUs: React.FC = () => {
  const contactInfo: ContactInfo[] = [
    {
      icon: <MapPin className="h-6 w-6 text-lime-500" />,
      title: "Main Office Location",
      details: [
        "Forest Department Complex",
        "Chennai, Tamil Nadu 600006, India"
      ],
      type: 'address'
    },
    {
      icon: <Phone className="h-6 w-6 text-lime-500" />,
      title: "Phone",
      details: [
        "Office: +044-227514565",
      ],
      type: 'phone'
    },
    {
      icon: <Mail className="h-6 w-6 text-lime-500" />,
      title: "Email Addresses",
      details: [
        "General: info@tnfrd.gov.in",
        "Research: research@tnfrd.gov.in",
      ],
      type: 'email'
    },
  ];

  const researchCenters: ResearchCenterContact[] = [
    {
      name: "State Forest Research Institute Center",
      location: "State Forest Research Institute Campus, Anna Nagar, Vandalur (via), Kolapakkam, Chennai 600127",
      phone: "044-2275-297",
      email: "dcfsfri@gmail.com"
    },
    {
      name: "Modern Nursery Division",
      location: "Modern Nursery Division, Behind Collectorate, Dharmapuri - 636 705",
      phone: "04342 231100",
      email: "dfomndpi@gmail.com"
    },
    {
      name: "Forest Genetics Division",
      location: "Forest Genetics Division, Bharathi Park Road, Marutham (via), Coimbatore - 600 043",
      phone: "0422-2434791",
      email: "cfgeneticscbe@yahoo.in"
    },
    {
      name: "Industrial Wood Research Division",
      location: "Industrial Wood Research Division, Kodiyalam Post Mukkombu, Trichy 639115",
      phone: "0431-2614723",
      email: "dvfiwrdmukkombu@gmail.com"
    },
    {
      name: "Agro Forestry Research Division",
      location: "Agro Forestry Research Division, No.2 Race Course Road, Madurai - 625002",
      phone: "0452 2531148",
      email: "afrmdu@gmail.com"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-lg font-semibold text-lime-600 mb-2 uppercase tracking-widest">
            Reach Out to Our Team
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
            Connect with the Research Wing
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We welcome inquiries from researchers, collaborators, and the public. Use the form 
            or reach us directly via phone and email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-bold text-green-900 border-b pb-3 mb-4">
              Official Contact Points
            </h2>
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-lime-500">
                <div className="flex items-start mb-2">
                  <div className="mr-3 mt-1 flex-shrink-0">{info.icon}</div>
                  <h3 className="text-xl font-bold text-green-900">{info.title}</h3>
                </div>
                <ul className="space-y-1 pl-1">
                  {info.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-700 text-base">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="bg-green-800 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-lime-400 mr-3" />
                <h3 className="text-xl font-bold text-lime-400">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-green-700 pb-1">
                  <span className="text-green-200">Monday - Friday</span>
                  <span className="font-semibold">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200">Saturday / Sunday</span>
                  <span className="font-semibold text-lime-400">Closed</span>
                </div>
              </div>
            </div>
          </div>
            
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-xl shadow-2xl p-8 border-t-8 border-green-700">
              <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
                <MessageCircle className="h-7 w-7 text-lime-600 mr-3" />
                Send a Direct Inquiry
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl shadow-inner p-10 mb-16">
          <h2 className="text-3xl font-bold text-green-900 mb-8 text-center flex items-center justify-center">
            <GitBranch className="h-7 w-7 text-lime-600 mr-3" />
            Our Research Divisions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchCenters.map((center, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border-b-2 border-green-300 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">{center.name}</h3>
                <div className="space-y-3 text-sm">
                  {center.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{center.location}</span>
                    </div>
                  )}
                  {center.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{center.phone}</span>
                    </div>
                  )}
                  {center.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{center.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

