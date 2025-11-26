import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  getAboutContent,
  updateAboutMissionVision,
  addLeadershipMember,
  updateLeadershipMember,
  deleteLeadershipMember
} from '../../services/admin/adminDataService';

const AdminAbout: React.FC = () => {
  const [aboutContent, setAboutContent] = useState(getAboutContent());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [showForm, setShowForm] = useState(false);

  const handleMissionVisionUpdate = (mission: string, vision: string) => {
    const updated = updateAboutMissionVision(mission, vision);
    setAboutContent(updated);
  };

  const handleAddMember = () => {
    setFormData({ name: '', position: '' });
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEditMember = (index: number) => {
    setFormData(aboutContent.leadership[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleSaveMember = () => {
    if (editingIndex !== null) {
      const updated = updateLeadershipMember(editingIndex, formData);
      setAboutContent({ ...aboutContent, leadership: updated });
    } else {
      const updated = addLeadershipMember(formData);
      setAboutContent({ ...aboutContent, leadership: updated });
    }
    handleCancelMember();
  };

  const handleCancelMember = () => {
    setFormData({ name: '', position: '' });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDeleteMember = (index: number) => {
    if (window.confirm('Are you sure you want to delete this leadership member?')) {
      const updated = deleteLeadershipMember(index);
      setAboutContent({ ...aboutContent, leadership: updated });
    }
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= aboutContent.leadership.length) return;

    const updated = [...aboutContent.leadership];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setAboutContent({ ...aboutContent, leadership: updated });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">About Page Management</h1>
        <p className="text-gray-600">Manage mission, vision, and leadership information</p>
      </div>

      <div className="space-y-8">
        {/* Mission & Vision */}
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

        {/* Leadership & Governance */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-900">Leadership & Governance</h2>
            <button
              onClick={handleAddMember}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-green-900 mb-4">
                {editingIndex !== null ? 'Edit' : 'Add'} Leadership Member
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMember}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelMember}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {aboutContent.leadership.map((member, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveMember(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveMember(index, 'down')}
                        disabled={index === aboutContent.leadership.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-900 mb-2">{member.name}</h3>
                      <p className="text-gray-600">{member.position}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMember(index)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {aboutContent.leadership.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No leadership members yet. Click "Add Member" to create one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;

