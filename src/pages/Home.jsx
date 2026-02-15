import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Globe, Users, Building2, Leaf, ShoppingBag, Droplet, Coffee } from 'lucide-react';

const Home = () => {
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

            {/* Corporate Overview */}
            <section className="section bg-light">
                <div className="container text-center">
                    <h2 className="mb-4">Feeding the Future Through Innovation</h2>
                    <p className="lead" style={{ maxWidth: '900px', margin: '0 auto 3rem', fontSize: '1.2rem', color: '#555' }}>
                        At Renee Golden Multi-ventures Limited, we are redefining the agricultural landscape.
                        Our core focus lies in the <strong>Agric Food Value Chain</strong>, bridging the gap between farm and table through
                        advanced <strong>Food Production and Processing</strong>. We are committed to nutrient-rich, hygienic, and
                        generations-enduring food solutions that support food security and economic growth.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="feature-card flex gap-4 items-start">
                            <div className="icon-box" style={{ flexShrink: 0 }}>
                                <Leaf size={28} />
                            </div>
                            <div>
                                <h3>Sustainable Production</h3>
                                <p>Leveraging modern farming equipment and eco-friendly practices to cultivate high-yield, quality crops.</p>
                            </div>
                        </div>
                        <div className="feature-card flex gap-4 items-start">
                            <div className="icon-box" style={{ flexShrink: 0 }}>
                                <FactoryIcon />
                            </div>
                            <div>
                                <h3>Advanced Processing</h3>
                                <p>Transforming raw harvest into premium, shelf-stable food products like oils, snacks, and staples using state-of-the-art technology.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="section">
                <div className="container">
                    <h2 className="text-center mb-8">Our Premium Products</h2>
                    <p className="text-center mb-8" style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Discover our range of locally produced, professionally processed, and packaged natural goods.
                        From wholesome snacks to essential pantry staples.
                    </p>

                    <div className="grid grid-cols-3 gap-8">

                        {/* Product 1: Kulikuli */}
                        <div className="product-card card overflow-hidden">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img src="/images/Renee Kulikuli.jpg" alt="Renee Kulikuli" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover:scale-105" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-gold mb-2">Renee Kulikuli</h3>
                                <p className="text-sm text-gray-600 mb-3">Groundnut Cookies</p>
                                <p>Crunchy, spicy, and rich in protein. Our Kulikuli is made from carefully selected groundnuts, processed hygienically to give you that authentic traditional taste with a modern touch of quality.</p>
                            </div>
                        </div>

                        {/* Product 2: Renee Oils */}
                        <div className="product-card card overflow-hidden">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img src="/images/Renee Oil1.jpg" alt="Renee Oils" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="p-6">
                                <h3 className="text-gold mb-2">Renee Oils (Emi Kuli)</h3>
                                <p className="text-sm text-gray-600 mb-3">Pure Groundnut Oil</p>
                                <p>Extracted from premium groundnuts, Renee Oil is cholesterol-free, heart-friendly, and perfect for all your cooking needs. Pure, clean, and golden.</p>
                            </div>
                        </div>

                        {/* Product 3: Tigernut Drinks */}
                        <div className="product-card card overflow-hidden">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img src="/images/Renee Tigernut.jpg" alt="Renee Tigernuts" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="p-6">
                                <h3 className="text-gold mb-2">Renee Tigernuts Drinks</h3>
                                <p className="text-sm text-gray-600 mb-3">Natural Energy Booster</p>
                                <p>A refreshing, dairy-free milk alternative packed with fiber and vitamins. Our Tigernut drink is naturally sweet and revitalizing.</p>
                            </div>
                        </div>

                        {/* Product 4: Renee Honey */}
                        <div className="product-card card overflow-hidden">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img src="/images/Renee Honey.jpg" alt="Renee Honey" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="p-6">
                                <h3 className="text-gold mb-2">Renee Honey</h3>
                                <p className="text-sm text-gray-600 mb-3">100% Raw & Organic</p>
                                <p>Sourced directly from the hive, unadulterated and pure. Rich in antioxidants and perfect for natural sweetening or medicinal use.</p>
                            </div>
                        </div>

                        {/* Product 5: Renee Rice */}
                        <div className="product-card card overflow-hidden">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img src="/images/renee Rice.jpg" alt="Renee Rice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="p-6">
                                <h3 className="text-gold mb-2">Renee Rice</h3>
                                <p className="text-sm text-gray-600 mb-3">Stone-Free & Premium</p>
                                <p>Locally grown and processed to international standards. Our rice is stone-free, easy to cook, and non-sticky, delivering the true taste of Nigerian rice.</p>
                            </div>
                        </div>

                        {/* General Basket / Call to Action Image */}
                        <div className="product-card card overflow-hidden flex flex-col justify-center items-center bg-gold text-white p-8 text-center" style={{ backgroundImage: 'url("/images/Renee Basket.png")', backgroundSize: 'cover', backgroundBlendMode: 'multiply', backgroundColor: '#B59328' }}>
                            <h3 className="mb-4" style={{ color: 'white' }}>Wholesale & Bulk Orders</h3>
                            <p className="mb-6 text-white max-w-xs mx-auto" style={{ color: '#ffffff' }}>We supply supermarkets, distributors, and industrial kitchens.</p>
                            <a href="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-gold">Place an Order</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subsidiaries Overview */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="text-center mb-8">Our Strategic Business Units</h2>
                    <div className="grid grid-cols-3 gap-4">

                        <div className="card text-center p-6 border rounded shadow-sm hover:shadow-lg transition flex flex-col items-center">
                            <div className="icon-box">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-gold mb-2">Renee Golden Global Services</h3>
                            <p className="mb-4">End-to-end agricultural production, mechanized farming, and food processing.</p>
                            <a href="/subsidiaries/global-services" className="btn btn-outline text-dark border-dark hover:bg-gold hover:text-white">Learn More</a>
                        </div>

                        <div className="card text-center p-6 border rounded shadow-sm hover:shadow-lg transition flex flex-col items-center">
                            <div className="icon-box">
                                <Users size={32} />
                            </div>
                            <h3 className="text-gold mb-2">Renee Rural Empowerment</h3>
                            <p className="mb-4">Empowering rural farmers through training, shared machinery, and market access.</p>
                            <a href="/subsidiaries/rural-empowerment" className="btn btn-outline text-dark border-dark hover:bg-gold hover:text-white">Learn More</a>
                        </div>

                        <div className="card text-center p-6 border rounded shadow-sm hover:shadow-lg transition flex flex-col items-center">
                            <div className="icon-box">
                                <Building2 size={32} />
                            </div>
                            <h3 className="text-gold mb-2">HRL Estate Services</h3>
                            <p className="mb-4">Strategic real estate solutions supporting agribusiness infrastructure.</p>
                            <a href="/subsidiaries/estate-services" className="btn btn-outline text-dark border-dark hover:bg-gold hover:text-white">Learn More</a>
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

// Simple internal component for Factory Icon since it might not be in the imported set or prefer explicit SVG
const FactoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /></svg>
);

export default Home;
