import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, GitBranch, AlertTriangle } from 'lucide-react';

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
    // In a real application, this would send data to an API endpoint
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
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
        "General Office: +044-227514565",
        "Research Wing: +91 44 XXXXX 5679",
        "Emergency Line: +91 44 XXXXX 5680"
      ],
      type: 'phone'
    },
    {
      icon: <Mail className="h-6 w-6 text-lime-500" />,
      title: "Email Addresses",
      details: [
        "General: info@tnfrd.gov.in",
        "Research: research@tnfrd.gov.in",
        "Emergency: emergency@tnfrd.gov.in"
      ],
      type: 'email'
    },
  ];

  const researchCenters = [
    {
      name: "State Forest Research Institute Center",
      address: "State Forest Research Institute Campus, Anna Nagar, Vandalur (via), Kolapakkam, Chennai 600127",
      phone: "044-2275-297",
      email: "dcfsfri@gmail.com"
    },
    {
      name: "Modern Nursery Division",
      address: "Modern Nursery Division, Behind Collectorate, Dharmapuri - 636 705",
      phone: "04342 231100",
      email: "dfomndpi@gmail.com"
    },
    {
      name: "Forest Genetics Division",
      address: "Forest Genetics Division, Bharathi Park Road, Marutham (via), Coimbatore - 600 043",
      phone: "0422-2434791",
      email: "cfgeneticscbe@yahoo.in"
    },
    {
      name: "Industrial Wood Research Division",
      address: "Industrial Wood Research Division, Kodiyalam Post Mukkombu, Trichy 639115",
      phone: "0431-2614723",
      email: "dvfiwrdmukkombu@gmail.com"
    },
    {
      name: "Agro Forestry Research Division",
      address: "Agro Forestry Research Division, No.2 Race Course Road, Madurai - 625002",
      phone: "0452 2531148",
      email: "afrmdu@gmail.com"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
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

        {/* Contact Form and Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
            
          {/* Main Contact Info (Left Column) */}
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
            
            {/* Office Hours Card */}
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
            
          {/* Contact Form & Map (Right Column) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-2xl p-8 border-t-8 border-green-700">
                <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
                    <MessageCircle className="h-7 w-7 text-lime-600 mr-3" />
                    Send a Direct Inquiry
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput name="name" label="Full Name" type="text" value={formData.name} onChange={handleInputChange} required />
                        <FormInput name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <FormInput name="subject" label="Subject" type="text" value={formData.subject} onChange={handleInputChange} required />
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-lime-500 focus:border-lime-500 transition-shadow"
                            placeholder="Please provide details about your inquiry (e.g., collaboration proposal, data request, general question)."
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-lime-500 hover:bg-lime-600 text-green-900 px-6 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center shadow-lg text-lg"
                    >
                        <Send className="h-5 w-5 mr-3" />
                        Submit Message
                    </button>
                </form>
            </div>
          </div>
        </div>

        {/* Research Centers List */}
        <div className={`bg-green-50 rounded-xl shadow-inner p-10 mb-16`}>
          <h2 className={`text-3xl font-bold text-green-900 mb-8 text-center flex items-center justify-center`}>
            <GitBranch className="h-7 w-7 text-lime-600 mr-3" />
            Our Research Divisions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchCenters.map((center, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border-b-2 border-green-300 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">{center.name}</h3>
                <div className="space-y-3 text-sm">
                  {center.address && <ContactDetailItem icon={MapPin} detail={center.address} />}
                  {center.phone && <ContactDetailItem icon={Phone} detail={center.phone} />}
                  {center.email && <ContactDetailItem icon={Mail} detail={center.email} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact Strip */}
        {/* <div className="bg-red-500/10 border-4 border-red-500 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="flex items-center mb-4 md:mb-0">
            <AlertTriangle className="h-8 w-8 text-red-700 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-red-800">24/7 Emergency Line</h2>
              <p className="text-red-700 text-sm">For urgent forest fires, wildlife emergencies, or critical incidents.</p>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-red-800 bg-white px-6 py-2 rounded-lg shadow-inner">
            +91 44 XXXXX 5680
          </div>
        </div> */}
      </div>
    </div>
  );
};

// --- Helper Components for Clean Structure ---

const FormInput = ({ name, label, type, value, onChange, required }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required ? '*' : ''}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-lime-500 focus:border-lime-500 transition-shadow"
        />
    </div>
);

const ContactDetailItem = ({ icon, detail }) => {
    const IconComponent = icon;
    return (
        <div className="flex items-center">
            <IconComponent className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
            <span className="text-gray-600">{detail}</span>
        </div>
    );
};

export default ContactUs;