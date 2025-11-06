// Mock data for the Tamil Nadu Forest Department Research Wing
import experimentsData from './experimentsData.json';

export const divisions = [
  {
    id: 1,
    name: "State Forest Research Division",
    // description: "Conducts research on forest ecology, biodiversity, and conservation strategies.",
    slug: "state-forest-research"
  },
  {
    id: 2,
    name: "Modern Nursery Division",
    // description: "Manages modern nurseries and research centers for plant propagation and cultivation.",
    slug: "modern-nursery",
    researchCenters: [
      {
        id: 1,
        name: "Thoppur Modern Nursery Centre",
        location: "Thoppur RF, Dharmapuri",
        area: "24.80",
        district: "Dharmapuri",
        range: "Dharmapuri Modern Nursery Range",
        description: "Modern nursery facility for forest tree species propagation and seedling production.",
        experiments: experimentsData["1"] || [],
        coordinates: { lat: 11.96828, lng: 78.05200 }
      },
      {
        id: 2,
        name: "Harur Modern Nursery Centre",
        location: "Harur RF, Dharmapuri",
        area: "29.25",
        district: "Dharmapuri",
        range: "Dharmapuri Modern Nursery Range",
        description: "Modern nursery center specializing in quality seedling production and distribution.",
        experiments: experimentsData["2"] || [],
        coordinates: { lat: 12.06574, lng: 78.47608 }
      },
      {
        id: 3,
        name: "Kalamavoor Modern Nursery Centre",
        location: "Kalamavoor Patthai RF, Pudukottai",
        area: "5.40",
        district: "Pudukottai",
        range: "Dindigul Modern Nursery Range",
        description: "Modern nursery facility in the Dindigul range, focusing on plant propagation and cultivation.",
        experiments: experimentsData["3"] || [],
        coordinates: { lat: 10.62207, lng: 78.75205 }
      },
      {
        id: 4,
        name: "Valkaradu Modern Nursery Centre",
        location: "Valkaradu RF, Theni",
        area: "9.20",
        district: "Theni",
        range: "Dindigul Modern Nursery Range",
        description: "Modern nursery center in Theni district, dedicated to sustainable forestry practices.",
        experiments: experimentsData["4"] || [],
        coordinates: { lat: 10.01465, lng: 77.49482 }
      },
      {
        id: 5,
        name: "Alwarmalai Modern Nursery Centre",
        location: "Alwarmalai RF, Villupuram",
        area: "10.00",
        district: "Villupuram",
        range: "Kallakurichi Modern Nursery Range",
        description: "Modern nursery facility in Villupuram district, part of the Kallakurichi range.",
        experiments: experimentsData["5"] || [],
        coordinates: { lat: 11.72816, lng: 79.10987 }
      },
      {
        id: 6,
        name: "Edaikkal Research Centre",
        location: "Edaikkal RF, Villupuram",
        area: "85.00",
        district: "Villupuram",
        range: "Kallakurichi Modern Nursery Range",
        description: "Major research center spanning 85 hectares, conducting advanced research in forest tree species and nursery management.",
        experiments: experimentsData["6"] || [],
        coordinates: { lat: 11.70149, lng: 79.24360 }
      },
      {
        id: 7,
        name: "Kathiripuram Research Centre",
        location: "Kavaramalai RF, Dharmapuri",
        area: "23.00",
        district: "Dharmapuri",
        range: "Harur Research Range",
        description: "Research center in Dharmapuri district, part of the Harur Research Range, focusing on forest research and development.",
        experiments: experimentsData["9"] || [],
        coordinates: { lat: 11.96498, lng: 78.31737 }
      },
      {
        id: 8,
        name: "Melchengam Research Centre",
        location: "Anandavadi RF, Thiruvanamalai",
        area: "40.00",
        district: "Thiruvanamalai",
        range: "Chengam Research Range",
        description: "Research center in Thiruvanamalai district, part of the Chengam Research Range, dedicated to forest research activities.",
        experiments: experimentsData["7"] || [],
        coordinates: { lat: 12.27189, lng: 78.71328 }
      },
      {
        id: 9,
        name: "Jamunamarathur Research Centre",
        location: "Veerappanur RF, Thiruvanamalai",
        area: "75.00",
        district: "Thiruvanamalai",
        range: "Chengam Research Range",
        description: "Large research center spanning 75 hectares in Thiruvanamalai district, conducting extensive forest research programs.",
        experiments: experimentsData["8"] || [],
        coordinates: { lat: 12.59550, lng: 78.87456 }
      },
      {
        id: 10,
        name: "Maragatta Research Centre",
        location: "Noganur RF, Krishnagiri",
        area: "38.00",
        district: "Krishnagiri",
        range: "Denkanikottai Research Range",
        description: "Research center in Krishnagiri district, part of the Denkanikottai Research Range, focusing on forest research and conservation.",
        experiments: experimentsData["10"] || [],
        coordinates: { lat: 12.48128, lng: 77.77862 }
      }
    ]
  },
  {
    id: 3,
    name: "Forest Genetics Division",
    // description: "Focuses on genetic research and breeding programs for forest species.",
    slug: "forest-genetics"
  },
  {
    id: 4,
    name: "Industrial Wood Research Division",
    // description: "Research on wood properties and industrial applications.",
    slug: "industrial-wood"
  },
  {
    id: 5,
    name: "Agro Forestry Research Division",
    // description: "Studies integration of trees with agricultural systems.",
    slug: "agro-forestry"
  }
];

export const shopProducts = [
  {
    id: 1,
    name: "Forest Tree Saplings",
    price: 25,
    image: "/images/teak-sapling.jpg",
    description: "High-quality teak saplings for reforestation",
    category: "Saplings",
    inStock: true
  },
  {
    id: 2,
    name: "Medicinal Plant Seeds",
    price: 15,
    image: "/images/medicinal-seeds.jpg",
    description: "Collection of traditional medicinal plant seeds",
    category: "Seeds",
    inStock: true
  },
  {
    id: 3,
    name: "Forest Honey",
    price: 45,
    image: "/images/forest-honey.jpg",
    description: "Pure forest honey from wild bees",
    category: "Products",
    inStock: true
  },
  {
    id: 4,
    name: "Bamboo Products",
    price: 35,
    image: "/images/bamboo-products.jpg",
    description: "Eco-friendly bamboo crafts and products",
    category: "Crafts",
    inStock: true
  },
  {
    id: 5,
    name: "Forest Research Publications",
    price: 20,
    image: "/images/publications.jpg",
    description: "Research papers and publications on forest science",
    category: "Publications",
    inStock: true
  },
  {
    id: 6,
    name: "Conservation Tools Kit",
    price: 85,
    image: "/images/conservation-kit.jpg",
    description: "Essential tools for forest conservation work",
    category: "Tools",
    inStock: false
  }
];
