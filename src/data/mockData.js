// Mock data for the Tamil Nadu Forest Department Research Wing

export const divisions = [
  {
    id: 1,
    name: "State Forest Research Division",
    description: "Conducts research on forest ecology, biodiversity, and conservation strategies.",
    slug: "state-forest-research"
  },
  {
    id: 2,
    name: "Modern Nursery Division",
    description: "Manages modern nurseries and research centers for plant propagation and cultivation.",
    slug: "modern-nursery",
    researchCenters: [
      {
        id: 1,
        name: "Thoppur Modern Nursery",
        location: "Thoppur, Tamil Nadu",
        description: "Advanced nursery facility for forest tree species propagation.",
        projects: [
          { id: 1, title: "Teak Propagation Techniques", type: "current", pdfUrl: "/pdfs/teak-propagation.pdf" },
          { id: 2, title: "Bamboo Cultivation Methods", type: "current", pdfUrl: "/pdfs/bamboo-cultivation.pdf" },
          { id: 3, title: "Native Species Conservation", type: "current", pdfUrl: "/pdfs/native-species.pdf" }
        ],
        completedProjects: [
          { id: 1, title: "Forest Restoration Project 2023", type: "completed", pdfUrl: "/pdfs/restoration-2023.pdf" },
          { id: 2, title: "Seed Bank Development", type: "completed", pdfUrl: "/pdfs/seed-bank.pdf" },
          { id: 3, title: "Climate Adaptation Study", type: "completed", pdfUrl: "/pdfs/climate-adaptation.pdf" }
        ]
      },
      {
        id: 2,
        name: "Kathipuram Research Center",
        location: "Kathipuram, Tamil Nadu",
        description: "Research center focused on medicinal plants and forest products.",
        projects: [
          { id: 1, title: "Medicinal Plant Research", type: "current", pdfUrl: "/pdfs/medicinal-plants.pdf" },
          { id: 2, title: "Forest Product Development", type: "current", pdfUrl: "/pdfs/forest-products.pdf" }
        ],
        completedProjects: [
          { id: 1, title: "Traditional Medicine Documentation", type: "completed", pdfUrl: "/pdfs/traditional-medicine.pdf" }
        ]
      },
      {
        id: 3,
        name: "Melsangam Research Center",
        location: "Melsangam, Tamil Nadu",
        description: "Specialized in agroforestry and sustainable farming practices.",
        projects: [
          { id: 1, title: "Agroforestry Systems", type: "current", pdfUrl: "/pdfs/agroforestry.pdf" },
          { id: 2, title: "Soil Conservation Methods", type: "current", pdfUrl: "/pdfs/soil-conservation.pdf" }
        ],
        completedProjects: [
          { id: 1, title: "Sustainable Agriculture Pilot", type: "completed", pdfUrl: "/pdfs/sustainable-agriculture.pdf" }
        ]
      },
      {
        id: 4,
        name: "Edaikal Research Center",
        location: "Edaikal, Tamil Nadu",
        description: "Research on forest genetics and breeding programs.",
        projects: [
          { id: 1, title: "Forest Tree Genetics", type: "current", pdfUrl: "/pdfs/tree-genetics.pdf" },
          { id: 2, title: "Breeding Program Development", type: "current", pdfUrl: "/pdfs/breeding-program.pdf" }
        ],
        completedProjects: [
          { id: 1, title: "Genetic Diversity Study", type: "completed", pdfUrl: "/pdfs/genetic-diversity.pdf" }
        ]
      },
      {
        id: 5,
        name: "Aalvarmalai Research Center",
        location: "Aalvarmalai, Tamil Nadu",
        description: "Mountain forest research and conservation center.",
        projects: [
          { id: 1, title: "Mountain Forest Ecology", type: "current", pdfUrl: "/pdfs/mountain-ecology.pdf" },
          { id: 2, title: "Wildlife Conservation", type: "current", pdfUrl: "/pdfs/wildlife-conservation.pdf" }
        ],
        completedProjects: [
          { id: 1, title: "Mountain Biodiversity Survey", type: "completed", pdfUrl: "/pdfs/mountain-biodiversity.pdf" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Forest Genetics Division",
    description: "Focuses on genetic research and breeding programs for forest species.",
    slug: "forest-genetics"
  },
  {
    id: 4,
    name: "Industrial Wood Research Division",
    description: "Research on wood properties and industrial applications.",
    slug: "industrial-wood"
  },
  {
    id: 5,
    name: "Agro Forestry Research Division",
    description: "Studies integration of trees with agricultural systems.",
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
