import React from 'react';
import {
  getAboutContent,
  updateAboutMissionVision
} from '../../services/admin/adminDataService';

const AdminAbout: React.FC = () => {
  const [aboutContent, setAboutContent] = React.useState(getAboutContent());

  const handleMissionVisionUpdate = (mission: string, vision: string) => {
    const updated = updateAboutMissionVision(mission, vision);
    setAboutContent(updated);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">About Page Management</h1>
        <p className="text-gray-600">Manage mission and vision content</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Mission & Vision</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission
            </label>
            <textarea
              value={aboutContent.mission}
              onChange={(e) => handleMissionVisionUpdate(e.target.value, aboutContent.vision)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter mission content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision
            </label>
            <textarea
              value={aboutContent.vision}
              onChange={(e) => handleMissionVisionUpdate(aboutContent.mission, e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter vision content..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;

