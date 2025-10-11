import React from 'react';
import { FlaskConical, Sprout, BarChart4, Users, BookOpen, Globe, Award, ShoppingCart } from 'lucide-react';

// --- Helper Components for Clean Structure ---

const ValuePropositionSection = () => {
    const features = [
        {
            icon: <FlaskConical className="h-6 w-6" />,
            title: "Ecological Research & Innovation",
            description: "Leading scientific studies in forest health, climate change adaptation, and species preservation.",
        },
        {
            icon: <Sprout className="h-6 w-6" />,
            title: "Modern Nursery Technology",
            description: "Operating state-of-the-art facilities for high-quality, disease-resistant plant propagation and genetics.",
        },
        {
            icon: <BarChart4 className="h-6 w-6" />,
            title: "Data-Driven Forest Management",
            description: "Utilizing GIS, remote sensing, and big data to inform sustainable forest policy and management.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Training & Capacity Building",
            description: "Providing expert training to field staff, academic institutions, and local communities.",
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Scientific Publications",
            description: "Publishing peer-reviewed research, technical reports, and extension materials for wide dissemination.",
        },
        {
            icon: <Globe className="h-6 w-6" />,
            title: "Biodiversity Conservation",
            description: "Focused efforts on endemic species conservation, habitat restoration, and protecting Tamil Nadu's rich biodiversity.",
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-green-900 mb-4">
                    Our Core Focus and Activities
                </h2>
                <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
                    Our work spans vital aspects of scientific forestry, ecological innovation, and sustainable development.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white rounded-xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                            <div className="flex justify-center items-center mb-4">
                                <div className="p-4 rounded-full bg-lime-100 text-green-700">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-green-900 text-center mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ImpactStatisticsSection = () => {
    const stats = [
        { count: '50+', label: 'Active Research Projects', icon: <FlaskConical className="h-8 w-8 text-lime-400" /> },
        { count: '10K+', label: 'Saplings Propagated Annually', icon: <Sprout className="h-8 w-8 text-lime-400" /> },
        { count: '100+', label: 'Scientific Publications', icon: <BookOpen className="h-8 w-8 text-lime-400" /> },
        { count: '15+', label: 'Years of Service Excellence', icon: <Award className="h-8 w-8 text-lime-400" /> },
    ];

    return (
        <section className="py-20 bg-green-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-white mb-12">
                    Our Footprint of Growth 📈
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center p-4">
                            <div className="flex justify-center mb-3">{stat.icon}</div>
                            <div className="text-5xl font-extrabold text-lime-400 mb-1">
                                {stat.count}
                            </div>
                            <div className="text-lg font-medium text-green-200">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => (
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-lime-50 border-l-8 border-green-700 p-8 md:p-12 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                    <h2 className="text-3xl font-bold text-green-900 mb-3">
                        Visit Our E-Shop for Quality Saplings
                    </h2>
                    <p className="text-lg text-gray-700 max-w-xl">
                        Support our research and conservation efforts by purchasing high-quality, scientifically grown plants from our modern nurseries.
                    </p>
                </div>
                <div className="mt-6 md:mt-0 flex-shrink-0">
                    <a 
                        href="/shop" 
                        className="flex items-center justify-center px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg shadow-md transition-colors duration-300"
                    >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Go to Shop
                    </a>
                </div>
            </div>
        </div>
    </section>
);

const NewsUpdatesSection = () => (
    <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-green-900 mb-4">Latest Updates & News</h2>
            <p className="text-lg text-gray-600 mb-8">
                Stay informed on our latest discoveries, events, and important circulars.
            </p>
            {/* You would replace this placeholder with a component that fetches and displays the latest three posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="border p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">October 1, 2024</p>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">New Species Discovered in Western Ghats</h3>
                    <p className="text-gray-600">Our team has identified a previously undocumented plant species in the Kodaikanal region...</p>
                    <a href="/news/new-species" className="text-green-600 hover:text-green-800 mt-3 inline-block font-medium">Read More →</a>
                </div>
                <div className="border p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">September 15, 2024</p>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Training Workshop on Drone Surveying</h3>
                    <p className="text-gray-600">A five-day intensive training workshop was conducted for field officers on modern forest inventory techniques...</p>
                    <a href="/news/workshop-drone" className="text-green-600 hover:text-green-800 mt-3 inline-block font-medium">Read More →</a>
                </div>
                <div className="border p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">August 28, 2024</p>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Annual Research Publication Released</h3>
                    <p className="text-gray-600">The 2024 volume features articles on bamboo cultivation and mangrove ecosystem restoration...</p>
                    <a href="/publications/2024-annual" className="text-green-600 hover:text-green-800 mt-3 inline-block font-medium">Read More →</a>
                </div>
            </div>
            <a href="/information" className="text-green-700 font-semibold hover:text-green-900 transition-colors duration-200 border-b-2 border-green-700 mt-12 inline-block">
                View All News & Publications →
            </a>
        </div>
    </section>
);


// --- Main Home Component (Page Body Content Only) ---

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. Key Value Proposition/Features Section */}
            <ValuePropositionSection />
            <hr className="border-green-100" />
            
            {/* 2. Impact Statistics/Numbers Section */}
            <ImpactStatisticsSection />
            <hr className="border-green-100" />

            {/* 3. News & Updates Section */}
            <NewsUpdatesSection />
            <hr className="border-green-100" />

            {/* 4. Secondary Call to Action (Focus on Shop/Product) */}
            <CTASection />
        </div>
    );
};

export default Home;