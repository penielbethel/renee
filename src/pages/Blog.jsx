import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

import axios from 'axios';

const API_URL = 'https://renee-global.vercel.app/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Blog | Renee Golden Multi-ventures Limited";
        window.scrollTo(0, 0);
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${API_URL}/blogs`);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                            <p className="mt-4 text-gray-500">Loading articles...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        <>
                            {/* Featured Post (First one) */}
                            <div className="featured-post mb-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                    <div className="h-full">
                                        <img
                                            src={posts[0].link}
                                            alt={posts[0].caption}
                                            className="w-full h-full object-cover min-h-[300px]"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1 text-gold font-bold">
                                                <Tag size={14} /> NEWS
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> {new Date(posts[0].createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4 text-dark hover:text-gold transition-colors">
                                            <Link to={`#`}>{posts[0].caption}</Link>
                                        </h2>
                                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                            {posts[0].caption}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                                                    {(posts[0].author || 'A').charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold">{posts[0].author || 'Admin'}</span>
                                            </div>
                                            <Link to={`#`} className="flex items-center gap-2 text-gold font-bold hover:underline">
                                                Read Article <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Posts Grid */}
                            {posts.length > 1 && (
                                <>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="h-1 w-8 bg-gold rounded-full"></div>
                                        <h3 className="text-xl font-bold">Latest Articles</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {posts.slice(1).map(post => (
                                            <div key={post._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={post.link}
                                                        alt={post.caption}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                                                    />
                                                    <div className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        News
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-gold transition-colors line-clamp-2">
                                                        <Link to={`#`}>{post.caption}</Link>
                                                    </h3>
                                                    <Link to={`#`} className="inline-flex items-center gap-1 text-sm font-bold text-gold hover:gap-2 transition-all">
                                                        Read More <ArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Tag size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Articles Yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Check back soon for the latest news and updates from Renee Golden Multi-ventures.
                            </p>
                        </div>
                    )}
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
