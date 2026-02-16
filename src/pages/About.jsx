import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Target, Eye, ShieldCheck, Award, Heart, CheckCircle } from 'lucide-react';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            <Hero
                title="About Renee Golden"
                subtitle="A diversified agricultural, industrial, and investment company committed to long-term value creation and sustainable development across Nigeria."
                bgImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Our Story */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="mb-4">Our Journey</h2>
                            <p className="lead mb-6">
                                Renee Golden Multi-ventures Limited was founded with a clear vision: to harness the vast potential of Nigeria's agricultural and industrial sectors to create shared prosperity.
                            </p>
                            <p className="mb-4">
                                Over the years, we have grown from a local enterprise into a multifaceted conglomerate with interests spanning the entire agricultural value chain, real estate, and strategic investments. Our commitment to excellence, integrity, and sustainability has been the cornerstone of our success.
                            </p>
                            <p>
                                Today, through our subsidiaries, we are not just producing food; we are empowering communities, building infrastructure, and pioneering new ways of doing business in Africa.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Company Team"
                                className="rounded-2xl shadow-xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-gold p-8 rounded-2xl hidden lg:block">
                                <h4 className="text-white text-4xl font-bold">10+</h4>
                                <p className="text-white/80 font-semibold tracking-widest uppercase text-xs">Years of Impact</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section bg-black text-white">
                <div className="container">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                                <Target className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="text-gold mb-3">Our Mission</h3>
                                <p className="text-white/70">
                                    To drive sustainable growth in the agricultural and industrial sectors through innovation, ethical business practices, and a deep commitment to the communities we serve.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                                <Eye className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="text-gold mb-3">Our Vision</h3>
                                <p className="text-white/70">
                                    To be Africa's leading partner in the agric-food value chain, recognized for excellence, quality, and our contribution to food security and economic empowerment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="mb-4">Our Core Values</h2>
                    <p className="mb-12 max-w-2xl mx-auto">The principles that guide every decision we make and every product we deliver.</p>

                    <div className="grid grid-cols-3 gap-8 text-left">
                        <div className="feature-card">
                            <ShieldCheck className="text-gold mb-4" size={40} />
                            <h3>Integrity</h3>
                            <p>We believe in transparency, honesty, and holding ourselves to the highest ethical standards in all our dealings.</p>
                        </div>
                        <div className="feature-card">
                            <Award className="text-gold mb-4" size={40} />
                            <h3>Excellence</h3>
                            <p>We strive for premium quality in everything, from our organic food processing to our industrial services.</p>
                        </div>
                        <div className="feature-card">
                            <Heart className="text-gold mb-4" size={40} />
                            <h3>Sustainability</h3>
                            <p>Our practices are designed to protect the environment and ensure the long-term viability of the land we farm.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="text-center mb-12">Why Renee Golden?</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-start gap-4 p-4">
                            <CheckCircle className="text-gold mt-1" size={24} />
                            <div>
                                <h4>End-to-End Control</h4>
                                <p>We manage the entire process from planting to processing, ensuring 100% quality control.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <CheckCircle className="text-gold mt-1" size={24} />
                            <div>
                                <h4>Organic & Pure</h4>
                                <p>No artificial additives or harmful chemicals. Just pure, natural goodness from the farm.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <CheckCircle className="text-gold mt-1" size={24} />
                            <div>
                                <h4>Community Centered</h4>
                                <p>Our Rural Empowerment initiative ensures that local farmers grow alongside us.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4">
                            <CheckCircle className="text-gold mt-1" size={24} />
                            <div>
                                <h4>Proven Expertise</h4>
                                <p>Years of experience in navigating building resilient agricultural systems in West Africa.</p>
                            </div>
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
                    { label: 'Contact', url: '/contact' }
                ]}
                ctaText="Join Our Journey"
                ctaLink="/contact"
            />
        </div>
    );
};

export default About;
