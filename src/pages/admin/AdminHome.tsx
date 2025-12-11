import React, { useState, useEffect } from 'react';
import { 
  Image, 
  FileText, 
  Calendar, 
  Link as LinkIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  getHomeContent,
  updateSliderImages,
  addNews,
  updateNews,
  deleteNews,
  addEvent,
  updateEvent,
  deleteEvent,
  updateContentArea,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  updateGalleryImages,
  addUsefulLink,
  updateUsefulLink,
  deleteUsefulLink
} from '../../services/admin/adminDataService';
import ImageUploader from '../../components/admin/ImageUploader';
import NewsEventEditor from '../../components/admin/NewsEventEditor';
import ContentBlockEditor, { ContentBlock } from '../../components/admin/ContentBlockEditor';
import LinkEditor from '../../components/admin/LinkEditor';
import type { NewsItem, Event, ImportantLink } from '../../types';

const AdminHome: React.FC = () => {
  const [homeContent, setHomeContent] = useState(getHomeContent());
  const [activeSection, setActiveSection] = useState<string>('slider');

  // Slider Images
  const handleSliderImageAdd = (imagePath: string) => {
    if (imagePath) {
      const updated = updateSliderImages([...homeContent.sliderImages, imagePath]);
      setHomeContent({ ...homeContent, sliderImages: updated });
    }
  };

  const handleSliderImageRemove = (index: number) => {
    // Use confirmation dialog if needed, but for now just remove
    const updated = homeContent.sliderImages.filter((_, i) => i !== index);
    setHomeContent({ ...homeContent, sliderImages: updateSliderImages(updated) });
  };

  const handleSliderImageMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= homeContent.sliderImages.length) return;

    const updated = [...homeContent.sliderImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setHomeContent({ ...homeContent, sliderImages: updateSliderImages(updated) });
  };

  // News
  const handleNewsChange = (news: NewsItem[]) => {
    setHomeContent({ ...homeContent, news });
  };

  // Events
  const handleEventsChange = (events: Event[]) => {
    setHomeContent({ ...homeContent, events });
  };

  // Content Area
  const handleContentAreaUpdate = (title: string, description: string) => {
    const updated = updateContentArea(title, description);
    setHomeContent({ ...homeContent, contentArea: updated });
  };

  const handleContentBlocksChange = (blocks: ContentBlock[]) => {
    // Convert ContentBlock[] to the format expected by the service
    blocks.forEach(block => {
      const existing = homeContent.contentArea.blocks.find(b => b.id === block.id);
      if (existing) {
        updateContentBlock(block.id, { heading: block.heading, text: block.text, image: block.image });
      } else {
        addContentBlock(block);
      }
    });
    // Remove deleted blocks
    homeContent.contentArea.blocks.forEach(block => {
      if (!blocks.find(b => b.id === block.id)) {
        deleteContentBlock(block.id);
      }
    });
    setHomeContent({
      ...homeContent,
      contentArea: { ...homeContent.contentArea, blocks }
    });
  };


  // Gallery
  const handleGalleryImageAdd = (imagePath: string) => {
    if (imagePath && homeContent.galleryImages.length < 10) {
      const updated = updateGalleryImages([...homeContent.galleryImages, imagePath]);
      setHomeContent({ ...homeContent, galleryImages: updated });
    }
  };

  const handleGalleryImageRemove = (index: number) => {
    // Use confirmation dialog if needed, but for now just remove
    const updated = homeContent.galleryImages.filter((_, i) => i !== index);
    setHomeContent({ ...homeContent, galleryImages: updateGalleryImages(updated) });
  };

  // Useful Links
  const handleLinksChange = (links: ImportantLink[]) => {
    setHomeContent({ ...homeContent, usefulLinks: links });
  };

  const sections = [
    { id: 'slider', label: 'Rotating Images', icon: Image },
    { id: 'news', label: 'Latest News', icon: FileText },
    { id: 'events', label: 'Latest Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery Carousel', icon: Image },
    { id: 'links', label: 'Useful Links', icon: LinkIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'slider':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-green-900">Rotating Image Strip</h3>
              <div className="text-sm text-gray-600">
                {homeContent.sliderImages.length} images
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <ImageUploader
                  onImageChange={handleSliderImageAdd}
                  directory="slider"
                  label="Add New Slider Image"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {homeContent.sliderImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Slider ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSliderImageMove(index, 'up')}
                        disabled={index === 0}
                        className="p-2 bg-white rounded-lg disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSliderImageMove(index, 'down')}
                        disabled={index === homeContent.sliderImages.length - 1}
                        className="p-2 bg-white rounded-lg disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSliderImageRemove(index)}
                        className="p-2 bg-red-500 text-white rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <NewsEventEditor
            items={homeContent.news}
            onItemsChange={handleNewsChange}
            title="Latest News"
            itemType="news"
          />
        );

      case 'events':
        return (
          <NewsEventEditor
            items={homeContent.events}
            onItemsChange={handleEventsChange}
            title="Latest Events"
            itemType="event"
          />
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">Content Area</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={homeContent.contentArea.title}
                    onChange={(e) => handleContentAreaUpdate(e.target.value, homeContent.contentArea.description)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={homeContent.contentArea.description}
                    onChange={(e) => handleContentAreaUpdate(homeContent.contentArea.title, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <ContentBlockEditor
              blocks={homeContent.contentArea.blocks}
              onBlocksChange={handleContentBlocksChange}
            />
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-green-900">Gallery Carousel Images</h3>
              <div className="text-sm text-gray-600">
                {homeContent.galleryImages.length} images
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {homeContent.galleryImages.length < 10 && (
                <div className="mb-4">
                  <ImageUploader
                    onImageChange={handleGalleryImageAdd}
                    directory="gallery"
                    label="Add Gallery Image"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                {homeContent.galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => handleGalleryImageRemove(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'links':
        return (
          <LinkEditor
            links={homeContent.usefulLinks}
            onLinksChange={handleLinksChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">Home Page Management</h1>
        <p className="text-gray-600">Manage all content sections of the home page</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-4 sticky top-8">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Sections</h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                      ${activeSection === section.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-green-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

