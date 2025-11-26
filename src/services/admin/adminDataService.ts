/**
 * Admin Data Service
 * 
 * This service manages admin data operations using the existing mock data structure.
 * For now, changes are in-memory only. Ready for future backend API integration.
 */

import { divisions } from '../../data/mockData';
import type { 
  Division, 
  ResearchCenter, 
  Experiment, 
  NewsItem, 
  Event, 
  ImportantLink 
} from '../../types';

// In-memory data storage (will be replaced with API calls later)
let adminData = {
  divisions: [...divisions],
  homeContent: {
    sliderImages: [
      '/assets/Alwarmalai.jpeg',
      '/assets/Edaikkal.jpeg',
      '/assets/Harur MNC.jpeg',
      '/assets/Jamunamarathur.jpeg',
      '/assets/Kalamavoor.jpeg',
      '/assets/Kathiripuram.jpeg',
      '/assets/Maragatta.jpeg',
      '/assets/Melchengam.jpeg',
      '/assets/Thoppur.jpeg',
      '/assets/Valkaradu.jpeg',
    ],
    news: [
      {
        date: "Oct 10, 2025",
        title: "Breakthrough in Bamboo Genetics Research",
        excerpt: "Scientists identify drought-resistant bamboo varieties suitable for Tamil Nadu climate...",
        link: "/news/bamboo-genetics"
      },
      {
        date: "Oct 8, 2025",
        title: "Monthly Forest Health Report Published",
        excerpt: "September data shows 15% improvement in forest density across protected areas...",
        link: "/news/monthly-report"
      },
      {
        date: "Oct 5, 2025",
        title: "New Research Wing Inaugurated",
        excerpt: "State-of-the-art molecular biology lab opens in Coimbatore campus...",
        link: "/news/new-wing"
      },
      {
        date: "Oct 2, 2025",
        title: "Climate Resilience Study Published",
        excerpt: "New findings on forest adaptation strategies released...",
        link: "/news/climate-study"
      }
    ] as NewsItem[],
    events: [
      {
        date: "Sep 28, 2025",
        title: "Annual Forest Officers Symposium",
        excerpt: "Over 200 officers attended the three-day knowledge sharing event...",
        link: "/events/symposium-2025"
      },
      {
        date: "Sep 20, 2025",
        title: "Community Afforestation Drive",
        excerpt: "5000 saplings planted in collaboration with local villages...",
        link: "/events/afforestation"
      },
      {
        date: "Sep 15, 2025",
        title: "Drone Training Workshop Completed",
        excerpt: "Field staff trained in advanced aerial survey techniques...",
        link: "/events/drone-workshop"
      },
      {
        date: "Sep 10, 2025",
        title: "International Biodiversity Conference",
        excerpt: "Researchers presented findings on endemic species conservation...",
        link: "/events/bio-conference"
      }
    ] as Event[],
    contentArea: {
      title: "Tamil Nadu Forest Research Department",
      description: "Standing at the forefront of ecological innovation and sustainable forestry practices, we advance scientific understanding of our natural heritage through cutting-edge research in forest conservation, biodiversity protection, and climate change adaptation.",
      blocks: [] as Array<{ id: string; heading: string; text: string; image?: string }>
    },
    missionVision: {
      mission: {
        title: "Our Mission",
        content: "To embrace the drive for innovation in soil health by developing and scaling biofertilizer solutions that improve soil fertility, ecosystem resilience, and biodiversity and producing high-quality, climate-resilient tree seedlings to support reforestation and land restoration efforts and sustainable agroforestry."
      },
      vision: {
        title: "Our Vision",
        content: "To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production and research, developing advanced microbial inoculants to enhance soil fertility and ecosystem productivity and biodiversity improvement."
      },
      customBoxes: [] as Array<{ id: string; title: string; content: string }>
    },
    galleryImages: [
      '/assets/Alwarmalai.jpeg',
      '/assets/Edaikkal.jpeg',
      '/assets/Harur MNC.jpeg',
      '/assets/Jamunamarathur.jpeg',
      '/assets/Kalamavoor.jpeg',
      '/assets/Kathiripuram.jpeg',
      '/assets/Maragatta.jpeg',
      '/assets/Melchengam.jpeg',
      '/assets/Thoppur.jpeg',
      '/assets/Valkaradu.jpeg',
    ],
    usefulLinks: [
      { 
        title: "Tamil Nadu Forest Department", 
        url: "https://forests.tn.gov.in", 
        icon: "https://fsi.nic.in/img/resources/logo-hindi.png" 
      },
      { 
        title: "Ministry of Environment, Forest and Climate Change", 
        url: "https://moef.gov.in", 
        icon: "https://moef.gov.in/storage/configuration-images/1734422674.1707280802.moef-logo-right.png" 
      },
      { 
        title: "Indian Council of Forestry Research & Education", 
        url: "https://icfre.gov.in", 
        icon: "https://icfre.gov.in/Images/icfre.gif" 
      },
    ] as ImportantLink[]
  },
  aboutContent: {
    mission: "To embrace the drive for innovation in soil health by developing and scaling biofertilizer solutions that improve soil fertility, ecosystem resilience, and biodiversity and producing high-quality, climate-resilient tree seedlings to support reforestation and land restoration efforts and sustainable agroforestry.",
    vision: "To be a leader in sustainable agroforestry and soil health through innovative biofertilizer production and research, developing advanced microbial inoculants to enhance soil fertility and ecosystem productivity and biodiversity improvement.",
    leadership: [
      {
        name: "Thiru R.S.Rajakannappan",
        position: "Hon'ble Minister for Forests"
      },
      {
        name: "Tmt. Supriya Sahu, IAS",
        position: "Additional Chief Secretary to Government, Environment, Climate Change and Forests Department"
      },
      {
        name: "Thiru.Srinivas R. Reddy, IFS",
        position: "Principal Chief Conservator of Forests (HoFF) & CEO, CAMPA (FAC)"
      },
    ]
  },
  publications: {
    categories: ['Research Paper', 'Technical Report', 'Annual Report', 'Policy Document'],
    items: [
      {
        id: 1,
        title: "நகர்ப்புறங்களில் மரம் வளர்ப்பு",
        year: 2024,
        category: "Research Paper",
        description: "A comprehensive guide on tree planting in urban areas.",
        pdfUrl: "/Publications/நகர்ப்புறங்களில் மரம் வளர்ப்பு.pdf"
      }
    ]
  },
  contact: {
    locations: [
      {
        id: 1,
        name: "Main Office Location",
        location: "Forest Department Complex Chennai, Tamil Nadu 600006, India",
        phone: "0442-27514565",
        email: "research@tnfrd.gov.in",
        showInFooter: true
      },
      {
        id: 2,
        name: "State Forest Research Division",
        location: "State Forest Research Institute Campus, Anna Nagar, Vandalur (via), Kolapakkam, Chennai - 600127",
        phone: "0442-275297",
        email: "dcfsfri@gmail.com",
        showInFooter: true
      }
    ]
  },
  divisions: {
    tollFreeNumber: "1800-425-2313"
  }
};

// Home Page Operations
export const getHomeContent = () => adminData.homeContent;

export const updateSliderImages = (images: string[]) => {
  adminData.homeContent.sliderImages = images;
  return adminData.homeContent.sliderImages;
};

export const addNews = (news: NewsItem) => {
  adminData.homeContent.news.push(news);
  return adminData.homeContent.news;
};

export const updateNews = (index: number, news: NewsItem) => {
  adminData.homeContent.news[index] = news;
  return adminData.homeContent.news;
};

export const deleteNews = (index: number) => {
  adminData.homeContent.news.splice(index, 1);
  return adminData.homeContent.news;
};

export const addEvent = (event: Event) => {
  adminData.homeContent.events.push(event);
  return adminData.homeContent.events;
};

export const updateEvent = (index: number, event: Event) => {
  adminData.homeContent.events[index] = event;
  return adminData.homeContent.events;
};

export const deleteEvent = (index: number) => {
  adminData.homeContent.events.splice(index, 1);
  return adminData.homeContent.events;
};

export const updateContentArea = (title: string, description: string) => {
  adminData.homeContent.contentArea.title = title;
  adminData.homeContent.contentArea.description = description;
  return adminData.homeContent.contentArea;
};

export const addContentBlock = (block: { id: string; heading: string; text: string; image?: string }) => {
  adminData.homeContent.contentArea.blocks.push(block);
  return adminData.homeContent.contentArea.blocks;
};

export const updateContentBlock = (id: string, block: { heading: string; text: string; image?: string }) => {
  const index = adminData.homeContent.contentArea.blocks.findIndex(b => b.id === id);
  if (index !== -1) {
    adminData.homeContent.contentArea.blocks[index] = { ...adminData.homeContent.contentArea.blocks[index], ...block };
  }
  return adminData.homeContent.contentArea.blocks;
};

export const deleteContentBlock = (id: string) => {
  adminData.homeContent.contentArea.blocks = adminData.homeContent.contentArea.blocks.filter(b => b.id !== id);
  return adminData.homeContent.contentArea.blocks;
};

export const updateMissionVision = (mission: string, vision: string) => {
  adminData.homeContent.missionVision.mission.content = mission;
  adminData.homeContent.missionVision.vision.content = vision;
  return adminData.homeContent.missionVision;
};

export const addCustomBox = (box: { id: string; title: string; content: string }) => {
  adminData.homeContent.missionVision.customBoxes.push(box);
  return adminData.homeContent.missionVision.customBoxes;
};

export const deleteCustomBox = (id: string) => {
  adminData.homeContent.missionVision.customBoxes = adminData.homeContent.missionVision.customBoxes.filter(b => b.id !== id);
  return adminData.homeContent.missionVision.customBoxes;
};

export const updateGalleryImages = (images: string[]) => {
  adminData.homeContent.galleryImages = images;
  return adminData.homeContent.galleryImages;
};

export const addUsefulLink = (link: ImportantLink) => {
  adminData.homeContent.usefulLinks.push(link);
  return adminData.homeContent.usefulLinks;
};

export const updateUsefulLink = (index: number, link: ImportantLink) => {
  adminData.homeContent.usefulLinks[index] = link;
  return adminData.homeContent.usefulLinks;
};

export const deleteUsefulLink = (index: number) => {
  adminData.homeContent.usefulLinks.splice(index, 1);
  return adminData.homeContent.usefulLinks;
};

// About Page Operations
export const getAboutContent = () => adminData.aboutContent;

export const updateAboutMissionVision = (mission: string, vision: string) => {
  adminData.aboutContent.mission = mission;
  adminData.aboutContent.vision = vision;
  return adminData.aboutContent;
};

export const addLeadershipMember = (member: { name: string; position: string }) => {
  adminData.aboutContent.leadership.push(member);
  return adminData.aboutContent.leadership;
};

export const updateLeadershipMember = (index: number, member: { name: string; position: string }) => {
  adminData.aboutContent.leadership[index] = member;
  return adminData.aboutContent.leadership;
};

export const deleteLeadershipMember = (index: number) => {
  adminData.aboutContent.leadership.splice(index, 1);
  return adminData.aboutContent.leadership;
};

// Publications Operations
export const getPublications = () => adminData.publications;

export const addCategory = (category: string) => {
  if (!adminData.publications.categories.includes(category)) {
    adminData.publications.categories.push(category);
  }
  return adminData.publications.categories;
};

export const deleteCategory = (category: string) => {
  adminData.publications.categories = adminData.publications.categories.filter(c => c !== category);
  return adminData.publications.categories;
};

export const addPublication = (publication: any) => {
  const newId = Math.max(...adminData.publications.items.map(p => p.id), 0) + 1;
  adminData.publications.items.push({ ...publication, id: newId });
  return adminData.publications.items;
};

export const updatePublication = (id: number, publication: any) => {
  const index = adminData.publications.items.findIndex(p => p.id === id);
  if (index !== -1) {
    adminData.publications.items[index] = { ...adminData.publications.items[index], ...publication };
  }
  return adminData.publications.items;
};

export const deletePublication = (id: number) => {
  adminData.publications.items = adminData.publications.items.filter(p => p.id !== id);
  return adminData.publications.items;
};

// Contact Operations
export const getContactLocations = () => adminData.contact.locations;

export const addContactLocation = (location: any) => {
  const newId = Math.max(...adminData.contact.locations.map(l => l.id), 0) + 1;
  adminData.contact.locations.push({ ...location, id: newId });
  return adminData.contact.locations;
};

export const updateContactLocation = (id: number, location: any) => {
  const index = adminData.contact.locations.findIndex(l => l.id === id);
  if (index !== -1) {
    adminData.contact.locations[index] = { ...adminData.contact.locations[index], ...location };
  }
  return adminData.contact.locations;
};

export const deleteContactLocation = (id: number) => {
  adminData.contact.locations = adminData.contact.locations.filter(l => l.id !== id);
  return adminData.contact.locations;
};

// Division Operations
export const getDivision = (slug: string): Division | undefined => {
  return adminData.divisions.find(d => d.slug === slug);
};

export const updateDivisionHeading = (slug: string, heading: string, description?: string) => {
  const division = adminData.divisions.find(d => d.slug === slug);
  if (division) {
    // For now, we'll store custom heading/description separately
    // In a real app, this would be part of the Division type
  }
  return division;
};

export const getResearchCenter = (divisionSlug: string, centerId: number): ResearchCenter | undefined => {
  const division = adminData.divisions.find(d => d.slug === divisionSlug);
  return division?.researchCenters?.find(c => c.id === centerId);
};

export const addResearchCenter = (divisionSlug: string, center: Omit<ResearchCenter, 'id'>) => {
  const division = adminData.divisions.find(d => d.slug === divisionSlug);
  if (division && division.researchCenters) {
    const newId = Math.max(...division.researchCenters.map(c => c.id), 0) + 1;
    division.researchCenters.push({ ...center, id: newId });
  }
  return division?.researchCenters;
};

export const updateResearchCenter = (divisionSlug: string, centerId: number, updates: Partial<ResearchCenter>) => {
  const division = adminData.divisions.find(d => d.slug === divisionSlug);
  const center = division?.researchCenters?.find(c => c.id === centerId);
  if (center) {
    Object.assign(center, updates);
  }
  return center;
};

export const deleteResearchCenter = (divisionSlug: string, centerId: number) => {
  const division = adminData.divisions.find(d => d.slug === divisionSlug);
  if (division && division.researchCenters) {
    division.researchCenters = division.researchCenters.filter(c => c.id !== centerId);
  }
  return division?.researchCenters;
};

export const addExperiment = (divisionSlug: string, centerId: number, experiment: Omit<Experiment, 'id'>) => {
  const center = getResearchCenter(divisionSlug, centerId);
  if (center) {
    const newId = Math.max(...center.experiments.map(e => e.id || 0), 0) + 1;
    center.experiments.push({ ...experiment, id: newId });
  }
  return center?.experiments;
};

export const updateExperiment = (divisionSlug: string, centerId: number, experimentId: number, updates: Partial<Experiment>) => {
  const center = getResearchCenter(divisionSlug, centerId);
  const experiment = center?.experiments.find(e => e.id === experimentId);
  if (experiment) {
    Object.assign(experiment, updates);
  }
  return experiment;
};

export const deleteExperiment = (divisionSlug: string, centerId: number, experimentId: number) => {
  const center = getResearchCenter(divisionSlug, centerId);
  if (center) {
    center.experiments = center.experiments.filter(e => e.id !== experimentId);
  }
  return center?.experiments;
};

export const updateTollFreeNumber = (number: string) => {
  adminData.divisions.tollFreeNumber = number;
  return adminData.divisions.tollFreeNumber;
};

export const getTollFreeNumber = () => adminData.divisions.tollFreeNumber;

