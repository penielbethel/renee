import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
    // Mock blog data - In a real app, this would come from an API
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Sustainable Farming: The Future of African Agriculture",
            excerpt: "How Renee Golden is implementing eco-friendly practices to boost crop yields while protecting the environment for future generations.",
            author: "Yinka Michael",
            date: "Oct 24, 2025",
            category: "Agriculture",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            slug: "sustainable-farming-future"
        },
        {
            id: 2,
            title: "The Health Benefits of Pure Honey",
            excerpt: "Discover why our locally sourced, unadulterated honey is not just a sweetener, but a powerhouse of nutrition and healing properties.",
            author: "Nutrition Team",
            date: "Nov 12, 2025",
            category: "Health",
            image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            slug: "health-benefits-pure-honey"
        },
        {
            id: 3,
            title: "Investing in Real Estate: A Guide for 2026",
            excerpt: "Analysis of the current property market trends in Nigeria and why now is the perfect time to secure your assets with Renee Estate Services.",
            author: "Anthony Apeji",
            date: "Dec 05, 2025",
            category: "Real Estate",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            slug: "investing-real-estate-guide"
        },
        {
            id: 4,
            title: "Empowering Rural Women Through Agriculture",
            excerpt: "Our latest initiative has supported over 200 women farmers in Kwara State, providing them with tools, seeds, and training.",
            author: "Renee Foundation",
            date: "Jan 15, 2026",
            category: "Community",
            image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            slug: "empowering-rural-women"
        }
    ]);

    useEffect(() => {
        document.title = "Blog | Renee Golden Multi-ventures Limited";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page" style={{ backgroundColor: '#FAFAFA' }}>
            <Navbar />

            <Hero
                title="Our Blog & Insights"
                subtitle="Latest news, industry trends, and updates from the Renee Golden ecosystem."
                bgImage="https://images.unsplash.com/photo-1499750310159-5b988371c0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            <section className="section">
                <div className="container">
                    {/* Featured Post (First one) */}
                    <div className="featured-post mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <div className="h-full">
                                <img
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    className="w-full h-full object-cover min-h-[300px]"
                                />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1 text-gold font-bold">
                                        <Tag size={14} /> {posts[0].category.toUpperCase()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} /> {posts[0].date}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-dark hover:text-gold transition-colors">
                                    <Link to={`#`}>{posts[0].title}</Link>
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {posts[0].excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                                            {posts[0].author.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold">{posts[0].author}</span>
                                    </div>
                                    <Link to={`#`} className="flex items-center gap-2 text-gold font-bold hover:underline">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Posts Grid */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-1 w-8 bg-gold rounded-full"></div>
                        <h3 className="text-xl font-bold">Latest Articles</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {posts.slice(1).map(post => (
                            <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <Calendar size={12} /> {post.date}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-gold transition-colors line-clamp-2">
                                        <Link to={`#`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link to={`#`} className="inline-flex items-center gap-1 text-sm font-bold text-gold hover:gap-2 transition-all">
                                        Read More <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 bg-black text-white">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Subscribe to our newsletter to receive the latest updates on sustainable agriculture, food security, and investment opportunities.
                    </p>
                    <div className="max-w-md mx-auto flex">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-3 rounded-l-lg text-black focus:outline-none"
                        />
                        <button className="bg-gold text-black font-bold px-6 py-3 rounded-r-lg hover:bg-yellow-500 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer
                companyName="Renee Golden Multi-ventures Limited"
                registration="RC 1506925"
                address="Okewande Street, Budo Nuhu Village, Airport Area, Asa L.G.A., Kwara State, Nigeria"
                email="info@reneegoldenmultiventures.com"
                phone="+234-XXX-XXX-XXXX"
                aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
                quickLinks={[
                    { label: 'Home', url: '/' },
                    { label: 'Shop', url: '/shop' },
                    { label: 'Blog', url: '/blog' },
                    { label: 'Contact', url: '/contact' }
                ]}
                ctaText="Partner With Us"
                ctaLink="/contact"
            />
        </div>
    );
};

export default Blog;
