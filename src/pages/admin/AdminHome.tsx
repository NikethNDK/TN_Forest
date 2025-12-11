import React, { useState, useEffect } from 'react';
import { 
  Image, 
  FileText, 
  Calendar, 
  Link as LinkIcon,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  getHomeContent,
  updateContentArea,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  updateGalleryImages
} from '../../services/admin/adminDataService';
import {
  subscribeToNews,
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  subscribeToEvents,
  addEventItem,
  updateEventItem,
  deleteEventItem
} from '../../services/firebase/newsEventService';
import {
  subscribeToSliderImages,
  addSliderImage,
  deleteSliderImage,
  reorderSliderImages
} from '../../services/firebase/sliderImageService';
import ImageUploader from '../../components/admin/ImageUploader';
import NewsEventEditor from '../../components/admin/NewsEventEditor';
import ContentBlockEditor, { ContentBlock } from '../../components/admin/ContentBlockEditor';
import LinkEditor from '../../components/admin/LinkEditor';
import { useConfirmation } from '../../hooks/useConfirmation';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import type { NewsItem, Event, ImportantLink, SliderImage } from '../../types';

const AdminHome: React.FC = () => {
  const [homeContent, setHomeContent] = useState(getHomeContent());
  const [activeSection, setActiveSection] = useState<string>('slider');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingSliderImages, setIsLoadingSliderImages] = useState(true);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const confirmation = useConfirmation();

  // Slider Images
  const handleSliderImageAdd = async (imagePath: string, publicId?: string) => {
    if (imagePath && publicId) {
      try {
        await addSliderImage({
          url: imagePath,
          publicId: publicId,
          order: sliderImages.length
        });
        toast.success('Slider image added successfully');
      } catch (error) {
        console.error('Error adding slider image:', error);
        toast.error('Failed to add slider image');
      }
    }
  };

  const handleSliderImageRemove = (image: SliderImage) => {
    if (!image.id || !image.publicId) return;
    
    confirmation.confirm(
      {
        title: 'Delete Slider Image',
        message: 'Are you sure you want to delete this image? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger'
      },
      async () => {
        try {
          setDeletingImageId(image.id!);
          const result = await deleteSliderImage(image.id!, image.publicId);
          
          if (result.cloudinaryDeleted) {
            toast.success('Slider image deleted successfully');
          } else {
            // Cloudinary deletion failed, but we kept it in Firestore per user preference
            toast.error(`Failed to delete from Cloudinary: ${result.error || 'Unknown error'}. Image kept in database.`, {
              duration: 5000
            });
          }
        } catch (error: any) {
          console.error('Error deleting slider image:', error);
          toast.error('Failed to delete slider image');
        } finally {
          setDeletingImageId(null);
        }
      }
    );
  };

  const handleSliderImageMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sliderImages.length) return;

    const updated = [...sliderImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Update order values
    const reordered = updated.map((img, idx) => ({ ...img, order: idx }));
    
    try {
      await reorderSliderImages(reordered);
      toast.success('Image order updated');
    } catch (error) {
      console.error('Error reordering slider images:', error);
      toast.error('Failed to reorder images');
    }
  };

  // Subscribe to Firebase for real-time updates
  useEffect(() => {
    const unsubscribeNews = subscribeToNews(
      (newsItems) => {
        setNews(newsItems);
        setIsLoadingNews(false);
      },
      (error) => {
        console.error('Error in news subscription:', error);
        setIsLoadingNews(false);
      }
    );

    const unsubscribeEvents = subscribeToEvents(
      (eventItems) => {
        setEvents(eventItems);
        setIsLoadingEvents(false);
      },
      (error) => {
        console.error('Error in events subscription:', error);
        setIsLoadingEvents(false);
      }
    );

    const unsubscribeSliderImages = subscribeToSliderImages(
      (images) => {
        setSliderImages(images);
        setIsLoadingSliderImages(false);
      },
      (error) => {
        console.error('Error in slider images subscription:', error);
        setIsLoadingSliderImages(false);
      }
    );

    return () => {
      unsubscribeNews();
      unsubscribeEvents();
      unsubscribeSliderImages();
    };
  }, []);

  // News handlers
  const handleAddNews = async (item: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    try {
      await addNewsItem(item);
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  };

  const handleEditNews = async (id: string, updates: Partial<NewsItem>) => {
    try {
      await updateNewsItem(id, updates);
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNewsItem(id);
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  };

  // Events handlers
  const handleAddEvent = async (item: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    try {
      await addEventItem(item);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const handleEditEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await updateEventItem(id, updates);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEventItem(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  // Content Area
  const handleContentAreaUpdate = (title: string, description: string) => {
    const updated = updateContentArea(title, description);
    setHomeContent({ ...homeContent, contentArea: updated });
  };

  const handleContentBlocksChange = (blocks: ContentBlock[]) => {
    // Convert ContentBlock[] to the format expected by the service
    blocks.forEach((block: ContentBlock) => {
      const existing = homeContent.contentArea.blocks.find((b: { id: string }) => b.id === block.id);
      if (existing) {
        updateContentBlock(block.id, { heading: block.heading, text: block.text, image: block.image });
      } else {
        addContentBlock(block);
      }
    });
    // Remove deleted blocks
    homeContent.contentArea.blocks.forEach((block: { id: string }) => {
      if (!blocks.find((b: ContentBlock) => b.id === block.id)) {
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
    const updated = homeContent.galleryImages.filter((_: string, i: number) => i !== index);
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
                {isLoadingSliderImages ? 'Loading...' : `${sliderImages.length} images`}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <ImageUploader
                  onImageChange={(url, publicId) => handleSliderImageAdd(url, publicId)}
                  directory="tn-forest/images/slider"
                  label="Add New Slider Image"
                />
              </div>
              {isLoadingSliderImages ? (
                <div className="text-center py-8 text-gray-500">Loading images...</div>
              ) : sliderImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No slider images yet. Upload your first image above.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {sliderImages.map((image, index) => (
                    <div key={image.id || index} className="relative group">
                      <img
                        src={image.url}
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
                          disabled={index === sliderImages.length - 1}
                          className="p-2 bg-white rounded-lg disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSliderImageRemove(image)}
                          disabled={deletingImageId === image.id}
                          className="p-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ConfirmationDialog
              isOpen={confirmation.isOpen}
              onClose={confirmation.close}
              onConfirm={confirmation.onConfirm}
              title={confirmation.title || 'Confirm Action'}
              message={confirmation.message}
              confirmText={confirmation.confirmText}
              cancelText={confirmation.cancelText}
              variant={confirmation.variant}
            />
          </div>
        );

      case 'news':
        return (
          <NewsEventEditor
            items={news}
            onAdd={handleAddNews}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
            title="Latest News"
            itemType="news"
            isLoading={isLoadingNews}
          />
        );

      case 'events':
        return (
          <NewsEventEditor
            items={events}
            onAdd={handleAddEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            title="Latest Events"
            itemType="event"
            isLoading={isLoadingEvents}
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
                {homeContent.galleryImages.map((image: string, index: number) => (
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

