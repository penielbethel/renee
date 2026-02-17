import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import {
    Globe, Users, Building2, Leaf, ShoppingBag, Droplet, Coffee,
    Search, TrendingUp, Award, Shield, Zap, Heart, Star,
    ArrowRight, Check, Sparkles
} from 'lucide-react';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // All searchable content
    const searchableContent = [
        { title: 'Renee Kulikuli', type: 'Product', link: '/shop', description: 'Groundnut Cookies - Crunchy and protein-rich' },
        { title: 'Renee Oils', type: 'Product', link: '/shop', description: 'Pure Groundnut Oil - Cholesterol-free' },
        { title: 'Renee Tigernut Drink', type: 'Product', link: '/shop', description: 'Natural Energy Booster' },
        { title: 'Renee Honey', type: 'Product', link: '/shop', description: '100% Raw & Organic Honey' },
        { title: 'Renee Rice', type: 'Product', link: '/shop', description: 'Stone-Free Premium Rice' },
        { title: 'About Us', type: 'Page', link: '/about', description: 'Learn about our company and mission' },
        { title: 'Contact Us', type: 'Page', link: '/contact', description: 'Get in touch with our team' },
        { title: 'Shop', type: 'Page', link: '/shop', description: 'Browse all our products' },
        { title: 'Investments', type: 'Page', link: '/investments', description: 'Investment opportunities' },
        { title: 'Partners', type: 'Page', link: '/partners', description: 'Our business partners' },
        { title: 'Global Services', type: 'Subsidiary', link: '/subsidiaries/global-services', description: 'Agricultural production and food processing' },
        { title: 'Rural Empowerment', type: 'Subsidiary', link: '/subsidiaries/rural-empowerment', description: 'Empowering rural farmers' },
        { title: 'HRL Estate Services', type: 'Subsidiary', link: '/subsidiaries/estate-services', description: 'Real estate solutions' },
    ];

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const results = searchableContent.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <Hero
                title="Pioneering the Agric Food Value Chain"
                subtitle="Renee Golden Multi-ventures Limited is dedicated to sustainable food production, processing, and the delivery of premium agricultural products."
                bgImage="/images/banner_two.jpg"
                ctaButtons={[{ label: 'Explore Our Products', link: '#products' }, { label: 'Contact Us', link: '/contact', secondary: true }]}
            />

            {/* Global Search Bar - Floating */}
            <div style={{
                position: 'sticky',
                top: '80px',
                zIndex: 999,
                padding: '1rem 0',
                backgroundColor: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: showResults ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s ease'
            }}>
                <div className="container">
                    <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            border: '2px solid #D4AF37',
                            borderRadius: '50px',
                            padding: '0.75rem 1.5rem',
                            boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
                            transition: 'all 0.3s ease'
                        }}>
                            <Search size={24} color="#D4AF37" style={{ marginRight: '1rem' }} />
                            <input
                                type="text"
                                placeholder="Search products, pages, services..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery && setShowResults(true)}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '1.1rem',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setShowResults(false);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#999',
                                        fontSize: '1.2rem',
                                        padding: '0 0.5rem'
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                marginTop: '0.5rem',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                zIndex: 1000
                            }}>
                                {searchResults.map((result, index) => (
                                    <Link
                                        key={index}
                                        to={result.link}
                                        onClick={() => setShowResults(false)}
                                        style={{
                                            display: 'block',
                                            padding: '1rem 1.5rem',
                                            borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                padding: '0.5rem',
                                                backgroundColor: '#D4AF37',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}>
                                                {result.type === 'Product' ? <ShoppingBag size={20} /> :
                                                    result.type === 'Page' ? <Star size={20} /> :
                                                        <Building2 size={20} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', color: '#1A1A1A', marginBottom: '0.25rem' }}>
                                                    {result.title}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                                    {result.description}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '12px',
                                                color: '#666',
                                                fontWeight: '600'
                                            }}>
                                                {result.type}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {showResults && searchResults.length === 0 && searchQuery && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                marginTop: '0.5rem',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                padding: '2rem',
                                textAlign: 'center',
                                color: '#666'
                            }}>
                                <p>No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section - New */}
            <section style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                color: '#fff',
                padding: '3rem 0'
            }}>
                <div className="container">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <Sparkles size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                7+
                            </div>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Premium Products</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <TrendingUp size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                100%
                            </div>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Organic & Natural</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <Award size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                5★
                            </div>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Customer Rated</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                <Shield size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                ISO
                            </div>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Quality Standards</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Overview */}
            <section className="section bg-light">
                <div className="container text-center">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1.5rem', backgroundColor: '#FFF9E6', borderRadius: '50px' }}>
                        <Zap size={20} color="#D4AF37" />
                        <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.9rem' }}>ABOUT US</span>
                    </div>
                    <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '2rem' }}>Feeding the Future Through Innovation</h2>
                    <p className="lead" style={{ maxWidth: '950px', margin: '2rem auto 5rem', padding: '0 1rem', fontSize: '1.25rem', color: '#444', lineHeight: '2.2', textAlign: 'justify' }}>
                        At Renee Golden Multi-ventures Limited, we are redefining the agricultural landscape.
                        Our core focus lies in the <strong style={{ color: '#D4AF37' }}>Agric Food Value Chain</strong>, bridging the gap between farm and table through
                        advanced <strong style={{ color: '#D4AF37' }}>Food Production and Processing</strong>. We are committed to nutrient-rich, hygienic, and
                        generations-enduring food solutions that support food security and economic growth.
                    </p>

                    <div className="grid grid-cols-2 gap-6 text-left">
                        <div style={{
                            padding: '2rem',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <Leaf size={32} color="#fff" />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#1A1A1A' }}>Sustainable Production</h3>
                            <p style={{ color: '#666', lineHeight: '1.7' }}>Leveraging modern farming equipment and eco-friendly practices to cultivate high-yield, quality crops.</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                <Check size={20} />
                                <span>Eco-Friendly Methods</span>
                            </div>
                        </div>

                        <div style={{
                            padding: '2rem',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <FactoryIcon />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#1A1A1A' }}>Advanced Processing</h3>
                            <p style={{ color: '#666', lineHeight: '1.7' }}>Transforming raw harvest into premium, shelf-stable food products like oils, snacks, and staples using state-of-the-art technology.</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                <Check size={20} />
                                <span>State-of-the-Art Tech</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1.5rem', backgroundColor: '#FFF9E6', borderRadius: '50px' }}>
                            <ShoppingBag size={20} color="#D4AF37" />
                            <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.9rem' }}>OUR PRODUCTS</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Premium Natural Products</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                            Discover our range of locally produced, professionally processed, and packaged natural goods.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8">

                        {/* Product 1: Kulikuli */}
                        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="product-card card">
                                <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                    <img src="/images/Renee Kulikuli.jpg" alt="Renee Kulikuli" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        backgroundColor: '#D4AF37',
                                        color: '#fff',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem'
                                    }}>
                                        <Star size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Popular
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Renee Kulikuli</h3>
                                    <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600', color: '#999' }}>Groundnut Cookies</p>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>Crunchy, spicy, and rich in protein. Our Kulikuli is made from carefully selected groundnuts, processed hygienically.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                        <span>Shop Now</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Product 2: Renee Oils */}
                        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="product-card card">
                                <div style={{ height: '250px', overflow: 'hidden' }}>
                                    <img src="/images/Renee Oil1.jpg" alt="Renee Oils" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Renee Oils (Emi Kuli)</h3>
                                    <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600', color: '#999' }}>Pure Groundnut Oil</p>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>Extracted from premium groundnuts, Renee Oil is cholesterol-free, heart-friendly, and perfect for all your cooking needs.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                        <span>Shop Now</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Product 3: Tigernut Drinks */}
                        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="product-card card">
                                <div style={{ height: '250px', overflow: 'hidden' }}>
                                    <img src="/images/Renee Tigernut.jpg" alt="Renee Tigernuts" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Renee Tigernuts Drinks</h3>
                                    <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600', color: '#999' }}>Natural Energy Booster</p>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>A refreshing, dairy-free milk alternative packed with fiber and vitamins. Naturally sweet and revitalizing.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                        <span>Shop Now</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Product 4: Renee Honey */}
                        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="product-card card">
                                <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                    <img src="/images/Renee Honey.jpg" alt="Renee Honey" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        backgroundColor: '#2ECC71',
                                        color: '#fff',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem'
                                    }}>
                                        <Heart size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        100% Natural
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Renee Honey</h3>
                                    <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600', color: '#999' }}>100% Raw & Organic</p>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>Sourced directly from the hive, unadulterated and pure. Rich in antioxidants and perfect for natural sweetening.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                        <span>Shop Now</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Product 5: Renee Rice */}
                        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="product-card card">
                                <div style={{ height: '250px', overflow: 'hidden' }}>
                                    <img src="/images/renee Rice.jpg" alt="Renee Rice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Renee Rice</h3>
                                    <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: '600', color: '#999' }}>Stone-Free & Premium</p>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>Locally grown and processed to international standards. Our rice is stone-free, easy to cook, and non-sticky.</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: '600' }}>
                                        <span>Shop Now</span>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* General Basket / Call to Action Image */}
                        <div className="product-card card overflow-hidden flex flex-col justify-center items-center text-center" style={{
                            backgroundImage: 'url("/images/Renee Basket.png")',
                            backgroundSize: 'cover',
                            backgroundBlendMode: 'multiply',
                            backgroundColor: '#B59328',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                            color: '#fff'
                        }}>
                            <ShoppingBag size={48} style={{ marginBottom: '1rem' }} />
                            <h3 className="mb-4" style={{ color: 'white', fontSize: '1.75rem', fontWeight: '700' }}>Wholesale & Bulk Orders</h3>
                            <p className="mb-6 max-w-xs mx-auto" style={{ color: '#ffffff', fontSize: '1.1rem' }}>We supply supermarkets, distributors, and industrial kitchens.</p>
                            <a href="/shop" className="btn" style={{
                                backgroundColor: '#fff',
                                color: '#D4AF37',
                                padding: '1rem 2rem',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Place an Order
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subsidiaries Overview */}
            <section className="section bg-light">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1.5rem', backgroundColor: '#FFF9E6', borderRadius: '50px' }}>
                            <Building2 size={20} color="#D4AF37" />
                            <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.9rem' }}>OUR BUSINESS UNITS</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Strategic Business Units</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6">

                        <div style={{
                            backgroundColor: '#fff',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Globe size={40} color="#fff" />
                            </div>
                            <h3 style={{ color: '#D4AF37', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Renee Golden Global Services</h3>
                            <p className="mb-4" style={{ color: '#666', lineHeight: '1.6' }}>End-to-end agricultural production, mechanized farming, and food processing.</p>
                            <a href="/subsidiaries/global-services" className="btn btn-outline" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                border: '2px solid #D4AF37',
                                color: '#D4AF37',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#D4AF37';
                                }}
                            >
                                Learn More
                                <ArrowRight size={18} />
                            </a>
                        </div>

                        <div style={{
                            backgroundColor: '#fff',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Users size={40} color="#fff" />
                            </div>
                            <h3 style={{ color: '#D4AF37', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Renee Rural Empowerment</h3>
                            <p className="mb-4" style={{ color: '#666', lineHeight: '1.6' }}>Empowering rural farmers through training, shared machinery, and market access.</p>
                            <a href="/subsidiaries/rural-empowerment" className="btn btn-outline" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                border: '2px solid #D4AF37',
                                color: '#D4AF37',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#D4AF37';
                                }}
                            >
                                Learn More
                                <ArrowRight size={18} />
                            </a>
                        </div>

                        <div style={{
                            backgroundColor: '#fff',
                            padding: '2.5rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                            }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Building2 size={40} color="#fff" />
                            </div>
                            <h3 style={{ color: '#D4AF37', fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>HRL Estate Services</h3>
                            <p className="mb-4" style={{ color: '#666', lineHeight: '1.6' }}>Strategic real estate solutions supporting agribusiness infrastructure.</p>
                            <a href="/subsidiaries/estate-services" className="btn btn-outline" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                border: '2px solid #D4AF37',
                                color: '#D4AF37',
                                borderRadius: '50px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#D4AF37';
                                }}
                            >
                                Learn More
                                <ArrowRight size={18} />
                            </a>
                        </div>

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
                    { label: 'Investments', url: '/investments' },
                    { label: 'Partners', url: '/partners' },
                    { label: 'Contact', url: '/contact' },
                    { label: 'Privacy Policy', url: '/privacy' },
                    { label: 'Terms', url: '/terms' }
                ]}
                ctaText="Partner With Us"
                ctaLink="/contact"
            />
        </div>
    );
};

// Simple internal component for Factory Icon
const FactoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /></svg>
);

export default Home;
