import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-forest-green-600" />,
      title: "Main Office",
      details: [
        "Forest Department Complex",
        "Chennai, Tamil Nadu 600006",
        "India"
      ]
    },
    {
      icon: <Phone className="h-6 w-6 text-forest-green-600" />,
      title: "Phone Numbers",
      details: [
        "Main Office: +91 44 1234 5678",
        "Research Division: +91 44 1234 5679",
        "Emergency: +91 44 1234 5680"
      ]
    },
    {
      icon: <Mail className="h-6 w-6 text-forest-green-600" />,
      title: "Email Addresses",
      details: [
        "General: info@tnfrd.gov.in",
        "Research: research@tnfrd.gov.in",
        "Emergency: emergency@tnfrd.gov.in"
      ]
    },
    {
      icon: <Clock className="h-6 w-6 text-forest-green-600" />,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const researchCenters = [
    {
      name: "Thoppur Modern Nursery",
      location: "Thoppur, Tamil Nadu",
      phone: "+91 44 1234 5681",
      email: "thoppur@tnfrd.gov.in"
    },
    {
      name: "Kathipuram Research Center",
      location: "Kathipuram, Tamil Nadu",
      phone: "+91 44 1234 5682",
      email: "kathipuram@tnfrd.gov.in"
    },
    {
      name: "Melsangam Research Center",
      location: "Melsangam, Tamil Nadu",
      phone: "+91 44 1234 5683",
      email: "melsangam@tnfrd.gov.in"
    },
    {
      name: "Edaikal Research Center",
      location: "Edaikal, Tamil Nadu",
      phone: "+91 44 1234 5684",
      email: "edaikal@tnfrd.gov.in"
    },
    {
      name: "Aalvarmalai Research Center",
      location: "Aalvarmalai, Tamil Nadu",
      phone: "+91 44 1234 5685",
      email: "aalvarmalai@tnfrd.gov.in"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-forest-green-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with us for inquiries, collaborations, or any questions 
            about our research and conservation activities.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="mr-3">{info.icon}</div>
                <h3 className="text-lg font-semibold text-forest-green-800">{info.title}</h3>
              </div>
              <ul className="space-y-2">
                {info.details.map((detail, idx) => (
                  <li key={idx} className="text-gray-600 text-sm">{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-3" />
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-forest-green-600 hover:bg-forest-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-forest-green-800 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              Our Location
            </h2>
            <div className="bg-forest-green-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-forest-green-600 mx-auto mb-4" />
                <p className="text-forest-green-800 font-medium">Interactive Map</p>
                <p className="text-forest-green-600 text-sm">Forest Department Complex, Chennai</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Address:</strong> Forest Department Complex, Chennai, Tamil Nadu 600006</p>
              <p><strong>Landmark:</strong> Near Government Secretariat</p>
            </div>
          </div>
        </div>

        {/* Research Centers */}
        <div className="bg-forest-green-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-forest-green-800 mb-6 text-center">
            Research Centers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchCenters.map((center, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-forest-green-800 mb-3">
                  {center.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-forest-green-600 mr-2" />
                    <span className="text-gray-600">{center.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-forest-green-600 mr-2" />
                    <span className="text-gray-600">{center.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-forest-green-600 mr-2" />
                    <span className="text-gray-600">{center.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Emergency Contact
          </h2>
          <p className="text-red-700 mb-4">
            For urgent forest-related emergencies or wildlife rescue, contact our 24/7 emergency line:
          </p>
          <div className="text-3xl font-bold text-red-800 mb-2">
            +91 44 1234 5680
          </div>
          <p className="text-red-600 text-sm">
            Available 24/7 for forest fires, wildlife emergencies, and urgent conservation matters
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
