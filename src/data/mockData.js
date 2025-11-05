// Mock data for the Tamil Nadu Forest Department Research Wing

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
        projects: [
          {
            id: 1,
            title: "Biofertilizer Production and Soil Health Enhancement",
            authors: "Dr. Rajesh Kumar, Dr. Priya Sharma",
            status: "Ongoing",
            startDate: "2024-01-15",
            description: "Research on developing innovative biofertilizer solutions to improve soil fertility and ecosystem resilience."
          },
          {
            id: 2,
            title: "Climate-Resilient Seedling Production Techniques",
            authors: "Dr. Suresh Menon, Dr. Lakshmi Nair",
            status: "Ongoing",
            startDate: "2024-03-01",
            description: "Developing techniques for producing high-quality, climate-resilient tree seedlings for reforestation efforts."
          },
          {
            id: 3,
            title: "Forest Tree Seed Quality Assessment and Improvement",
            authors: "Dr. Anjali Reddy, Dr. Vikram Patel",
            status: "Ongoing",
            startDate: "2024-02-10",
            description: "Quality assessment and improvement protocols for superior forest tree seeds distribution."
          },
          {
            id: 4,
            title: "RET Species Conservation and Propagation",
            authors: "Dr. Meera Iyer, Dr. Karthik Sundaram",
            status: "Ongoing",
            startDate: "2024-01-20",
            description: "Conservation and management practices for rare, endangered, and threatened species."
          },
          {
            id: 5,
            title: "Microbial Inoculants for Enhanced Soil Productivity",
            authors: "Dr. Deepa Ranganathan, Dr. Arjun Venkatesh",
            status: "Ongoing",
            startDate: "2024-04-05",
            description: "Development of advanced microbial inoculants to enhance soil fertility and biodiversity."
          }
        ],
        completedProjects: []
      },
      {
        id: 2,
        name: "Harur Modern Nursery Centre",
        location: "Harur RF, Dharmapuri",
        area: "29.25",
        district: "Dharmapuri",
        range: "Dharmapuri Modern Nursery Range",
        description: "Modern nursery center specializing in quality seedling production and distribution.",
        projects: [
          {
            id: 1,
            title: "Vermicompost Production and Quality Standards",
            authors: "Dr. Rajesh Kumar, Dr. Priya Sharma",
            status: "Ongoing",
            startDate: "2024-01-15",
            description: "Research on vermicompost production methods and establishing quality standards for distribution."
          },
          {
            id: 2,
            title: "VAM (Vesicular Arbuscular Mycorrhizae) Cultivation",
            authors: "Dr. Suresh Menon, Dr. Lakshmi Nair",
            status: "Ongoing",
            startDate: "2024-03-01",
            description: "Advanced cultivation techniques for VAM to improve soil fertility and plant growth."
          },
          {
            id: 3,
            title: "Azospirillum and Phosphobacteria Production",
            authors: "Dr. Anjali Reddy, Dr. Vikram Patel",
            status: "Ongoing",
            startDate: "2024-02-10",
            description: "Large-scale production of nitrogen-fixing and phosphate-solubilizing bacteria for agricultural use."
          },
          {
            id: 4,
            title: "Sustainable Agroforestry Systems Development",
            authors: "Dr. Meera Iyer, Dr. Karthik Sundaram",
            status: "Ongoing",
            startDate: "2024-01-20",
            description: "Developing sustainable agroforestry systems that integrate trees with agricultural practices."
          },
          {
            id: 5,
            title: "Seed Bank and Genetic Resource Management",
            authors: "Dr. Deepa Ranganathan, Dr. Arjun Venkatesh",
            status: "Ongoing",
            startDate: "2024-04-05",
            description: "Establishment and management of seed banks for forest tree genetic resource conservation."
          }
        ],
        completedProjects: []
      },
      {
        id: 3,
        name: "Kalamavoor Modern Nursery Centre",
        location: "Kalamavoor Patthai RF, Pudukottai",
        area: "5.40",
        district: "Pudukottai",
        range: "Dindigul Modern Nursery Range",
        description: "Modern nursery facility in the Dindigul range, focusing on plant propagation and cultivation.",
        projects: [
          {
            id: 1,
            title: "Organic Composting Techniques",
            authors: "Dr. Ramesh Iyer, Dr. Kavitha Menon",
            status: "Ongoing",
            startDate: "2024-02-01",
            description: "Research on organic composting methods for enhanced soil fertility."
          },
          {
            id: 2,
            title: "Seed Germination Enhancement",
            authors: "Dr. Sanjay Kumar, Dr. Priya Reddy",
            status: "Ongoing",
            startDate: "2024-03-15",
            description: "Developing techniques to improve seed germination rates for forest species."
          },
          {
            id: 3,
            title: "Nursery Water Management System",
            authors: "Dr. Anil Verma, Dr. Meera Shah",
            status: "Ongoing",
            startDate: "2024-01-20",
            description: "Efficient water management systems for modern nursery operations."
          },
          {
            id: 4,
            title: "Soil Nutrient Analysis Program",
            authors: "Dr. Vikram Singh, Dr. Neha Patel",
            status: "Ongoing",
            startDate: "2024-04-10",
            description: "Comprehensive soil nutrient analysis for optimal plant growth."
          },
          {
            id: 5,
            title: "Pest Management in Nursery",
            authors: "Dr. Arun Desai, Dr. Shweta Nair",
            status: "Ongoing",
            startDate: "2024-02-25",
            description: "Sustainable pest management practices for nursery environments."
          }
        ],
        completedProjects: []
      },
      {
        id: 4,
        name: "Valkaradu Modern Nursery Centre",
        location: "Valkaradu RF, Theni",
        area: "9.20",
        district: "Theni",
        range: "Dindigul Modern Nursery Range",
        description: "Modern nursery center in Theni district, dedicated to sustainable forestry practices.",
        projects: [
          {
            id: 1,
            title: "Bamboo Propagation Research",
            authors: "Dr. Rajesh Nair, Dr. Lakshmi Iyer",
            status: "Ongoing",
            startDate: "2023-11-01",
            description: "Advanced techniques for bamboo species propagation and cultivation."
          },
          {
            id: 2,
            title: "Medicinal Plant Conservation",
            authors: "Dr. Suresh Kumar, Dr. Anjali Menon",
            status: "Ongoing",
            startDate: "2024-01-15",
            description: "Conservation and propagation of rare medicinal plant species."
          },
          {
            id: 3,
            title: "Climate Adaptation Strategies",
            authors: "Dr. Deepak Sharma, Dr. Radha Venkatesh",
            status: "Ongoing",
            startDate: "2023-12-10",
            description: "Developing climate-resilient nursery practices for changing conditions."
          },
          {
            id: 4,
            title: "Automated Irrigation System",
            authors: "Dr. Manoj Patel, Dr. Sunita Reddy",
            status: "Ongoing",
            startDate: "2024-03-01",
            description: "Implementation of automated irrigation systems for efficient water usage."
          },
          {
            id: 5,
            title: "Native Species Restoration",
            authors: "Dr. Kiran Desai, Dr. Pooja Nair",
            status: "Ongoing",
            startDate: "2024-02-20",
            description: "Restoration programs for native forest tree species in the region."
          }
        ],
        completedProjects: []
      },
      {
        id: 5,
        name: "Alwarmalai Modern Nursery Centre",
        location: "Alwarmalai RF, Villupuram",
        area: "10.00",
        district: "Villupuram",
        range: "Kallakurichi Modern Nursery Range",
        description: "Modern nursery facility in Villupuram district, part of the Kallakurichi range.",
        projects: [
          {
            id: 1,
            title: "Forest Tree Seed Collection",
            authors: "Dr. Venkatesh Iyer, Dr. Madhuri Kumar",
            status: "Ongoing",
            startDate: "2024-01-05",
            category: "Seed Research",
            description: "Systematic collection and cataloging of forest tree seeds."
          },
          {
            id: 2,
            title: "Biofertilizer Application Study",
            authors: "Dr. Ganesh Reddy, Dr. Swati Menon",
            status: "Ongoing",
            startDate: "2024-02-15",
            category: "Soil Health",
            description: "Study on biofertilizer application methods for improved growth."
          },
          {
            id: 3,
            title: "Nursery Infrastructure Development",
            authors: "Dr. Ravi Patel, Dr. Indira Sharma",
            status: "Ongoing",
            startDate: "2024-03-20",
            category: "Infrastructure",
            description: "Modern infrastructure development for enhanced nursery operations."
          },
          {
            id: 4,
            title: "Seed Storage Technology",
            authors: "Dr. Amit Desai, Dr. Kavya Nair",
            status: "Ongoing",
            startDate: "2024-01-25",
            category: "Seed Research",
            description: "Advanced seed storage technologies for long-term preservation."
          },
          {
            id: 5,
            title: "Organic Farming Integration",
            authors: "Dr. Rohit Singh, Dr. Divya Iyer",
            status: "Ongoing",
            startDate: "2024-04-05",
            category: "Soil Health",
            description: "Integrating organic farming practices with nursery management."
          }
        ],
        completedProjects: []
      },
      {
        id: 6,
        name: "Edaikkal Research Centre",
        location: "Edaikkal RF, Villupuram",
        area: "85.00",
        district: "Villupuram",
        range: "Kallakurichi Modern Nursery Range",
        description: "Major research center spanning 85 hectares, conducting advanced research in forest tree species and nursery management.",
        projects: [
          {
            id: 1,
            title: "Advanced Genetic Research",
            authors: "Dr. Mohan Iyer, Dr. Sneha Reddy",
            status: "Ongoing",
            startDate: "2023-10-01",
            description: "Genetic research for improved forest tree varieties."
          },
          {
            id: 2,
            title: "Ecosystem Restoration Project",
            authors: "Dr. Karthik Menon, Dr. Ananya Patel",
            status: "Ongoing",
            startDate: "2024-01-10",
            description: "Large-scale ecosystem restoration using native species."
          },
          {
            id: 3,
            title: "Molecular Biology Studies",
            authors: "Dr. Varun Sharma, Dr. Megha Nair",
            status: "Ongoing",
            startDate: "2023-12-15",
            description: "Molecular studies for understanding plant growth mechanisms."
          },
          {
            id: 4,
            title: "Wildlife Habitat Enhancement",
            authors: "Dr. Aditya Kumar, Dr. Riya Desai",
            status: "Ongoing",
            startDate: "2024-02-28",
            description: "Enhancing wildlife habitats through strategic tree planting."
          },
          {
            id: 5,
            title: "Research Collaboration Program",
            authors: "Dr. Nikhil Singh, Dr. Tanvi Iyer",
            status: "Ongoing",
            startDate: "2024-03-15",
            description: "Collaborative research programs with international institutions."
          }
        ],
        completedProjects: []
      },
      {
        id: 7,
        name: "Kathiripuram Research Centre",
        location: "Kavaramalai RF, Dharmapuri",
        area: "23.00",
        district: "Dharmapuri",
        range: "Harur Research Range",
        description: "Research center in Dharmapuri district, part of the Harur Research Range, focusing on forest research and development.",
        projects: [
          {
            id: 1,
            title: "Sustainable Forestry Practices",
            authors: "Dr. Ashok Reddy, Dr. Priya Menon",
            status: "Ongoing",
            startDate: "2024-01-12",
            description: "Developing sustainable forestry practices for long-term conservation."
          },
          {
            id: 2,
            title: "Carbon Sequestration Study",
            authors: "Dr. Rahul Patel, Dr. Shilpa Iyer",
            status: "Ongoing",
            startDate: "2024-02-18",
            description: "Research on carbon sequestration potential of forest trees."
          },
          {
            id: 3,
            title: "Biodiversity Monitoring",
            authors: "Dr. Sameer Kumar, Dr. Rekha Nair",
            status: "Ongoing",
            startDate: "2024-03-22",
            description: "Continuous monitoring of biodiversity in research areas."
          },
          {
            id: 4,
            title: "Traditional Knowledge Documentation",
            authors: "Dr. Arjun Desai, Dr. Kavita Sharma",
            status: "Ongoing",
            startDate: "2024-01-30",
            description: "Documenting traditional knowledge about forest species."
          },
          {
            id: 5,
            title: "Community Engagement Program",
            authors: "Dr. Vikas Singh, Dr. Anju Reddy",
            status: "Ongoing",
            startDate: "2024-04-08",
            description: "Engaging local communities in forest conservation efforts."
          }
        ],
        completedProjects: []
      },
      {
        id: 8,
        name: "Melchengam Research Centre",
        location: "Anandavadi RF, Thiruvanamalai",
        area: "40.00",
        district: "Thiruvanamalai",
        range: "Chengam Research Range",
        description: "Research center in Thiruvanamalai district, part of the Chengam Research Range, dedicated to forest research activities.",
        projects: [
          {
            id: 1,
            title: "Agroforestry Integration",
            authors: "Dr. Suresh Iyer, Dr. Maya Menon",
            status: "Ongoing",
            startDate: "2024-01-08",
            year: "2024",
            description: "Integrating trees with agricultural systems for mutual benefits."
          },
          {
            id: 2,
            title: "Soil Health Improvement",
            authors: "Dr. Naveen Patel, Dr. Geeta Reddy",
            status: "Ongoing",
            startDate: "2024-02-14",
            year: "2024",
            description: "Improving soil health through organic amendments and biofertilizers."
          },
          {
            id: 3,
            title: "Seed Quality Enhancement",
            authors: "Dr. Praveen Kumar, Dr. Uma Nair",
            status: "Ongoing",
            startDate: "2024-03-25",
            year: "2024",
            description: "Enhancing seed quality through improved processing techniques."
          },
          {
            id: 4,
            title: "Disease Resistance Research",
            authors: "Dr. Manish Desai, Dr. Leela Sharma",
            status: "Ongoing",
            startDate: "2024-02-05",
            year: "2024",
            description: "Research on developing disease-resistant tree varieties."
          },
          {
            id: 5,
            title: "Water Conservation Methods",
            authors: "Dr. Rajesh Singh, Dr. Padma Iyer",
            status: "Ongoing",
            startDate: "2024-04-12",
            year: "2024",
            description: "Water conservation methods for sustainable nursery operations."
          }
        ],
        completedProjects: []
      },
      {
        id: 9,
        name: "Jamunamarathur Research Centre",
        location: "Veerappanur RF, Thiruvanamalai",
        area: "75.00",
        district: "Thiruvanamalai",
        range: "Chengam Research Range",
        description: "Large research center spanning 75 hectares in Thiruvanamalai district, conducting extensive forest research programs.",
        projects: [
          {
            id: 1,
            title: "Large-Scale Reforestation",
            authors: "Dr. Ramesh Kumar, Dr. Sunitha Menon",
            status: "Ongoing",
            startDate: "2023-09-15",
            progress: 65,
            description: "Large-scale reforestation project covering 50 hectares."
          },
          {
            id: 2,
            title: "Research Publication Program",
            authors: "Dr. Anand Iyer, Dr. Jyoti Patel",
            status: "Ongoing",
            startDate: "2024-01-20",
            progress: 45,
            description: "Publishing research findings in international journals."
          },
          {
            id: 3,
            title: "Technology Transfer Initiative",
            authors: "Dr. Suresh Reddy, Dr. Meera Nair",
            status: "Ongoing",
            startDate: "2024-03-10",
            progress: 30,
            description: "Transferring research technologies to farmers and stakeholders."
          },
          {
            id: 4,
            title: "International Collaboration",
            authors: "Dr. Vikram Desai, Dr. Anitha Sharma",
            status: "Ongoing",
            startDate: "2024-02-01",
            progress: 55,
            description: "Collaborative research with international forestry institutions."
          },
          {
            id: 5,
            title: "Advanced Laboratory Setup",
            authors: "Dr. Ajay Singh, Dr. Neeta Iyer",
            status: "Ongoing",
            startDate: "2024-04-01",
            progress: 70,
            description: "Setting up advanced research laboratories for molecular studies."
          }
        ],
        completedProjects: []
      },
      {
        id: 10,
        name: "Maragatta Research Centre",
        location: "Noganur RF, Krishnagiri",
        area: "38.00",
        district: "Krishnagiri",
        range: "Denkanikottai Research Range",
        description: "Research center in Krishnagiri district, part of the Denkanikottai Research Range, focusing on forest research and conservation.",
        projects: [
          {
            id: 1,
            title: "Forest Conservation Research Program",
            authors: "Dr. Harish Kumar, Dr. Nisha Reddy",
            status: "Ongoing",
            startDate: "2024-01-18",
            description: "Comprehensive research program focused on forest conservation strategies and biodiversity protection."
          },
          {
            id: 2,
            title: "Sustainable Resource Management",
            authors: "Dr. Pradeep Iyer, Dr. Kavita Menon",
            status: "Ongoing",
            startDate: "2024-02-22",
            description: "Developing sustainable resource management practices for long-term forest health."
          },
          {
            id: 3,
            title: "Community-Based Conservation",
            authors: "Dr. Ravi Desai, Dr. Priyanka Nair",
            status: "Ongoing",
            startDate: "2024-03-12",
            description: "Engaging local communities in forest conservation and sustainable management practices."
          },
          {
            id: 4,
            title: "Wildlife Habitat Restoration",
            authors: "Dr. Sandeep Patel, Dr. Ananya Sharma",
            status: "Ongoing",
            startDate: "2024-01-28",
            description: "Restoration of wildlife habitats through strategic tree planting and ecosystem management."
          },
          {
            id: 5,
            title: "Environmental Impact Assessment",
            authors: "Dr. Nitin Singh, Dr. Radhika Iyer",
            status: "Ongoing",
            startDate: "2024-04-15",
            description: "Comprehensive environmental impact assessments for forest conservation projects."
          }
        ],
        completedProjects: []
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
