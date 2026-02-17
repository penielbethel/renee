import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Handshake, Globe, ShoppingBag, Truck, Users } from 'lucide-react';

const Partners = () => {
    useEffect(() => {
        document.title = "Partners | Renee Golden - Collaborative Agricultural Innovation";
    }, []);
    return (
        <div className="partners-page">
            <Navbar />

            <Hero
                title="Our Partners"
                subtitle="Collaborating with a network of farmers, distributors, and organizations to build a resilient food system and create shared value."
                bgImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            <section className="section">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="mb-4">Building Together</h2>
                        <p className="max-w-3xl mx-auto">
                            Renee Golden operates a partnership-driven model. We believe that by working with the right people in the right places, we can scale our impact across the entire agricultural value chain.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: '#f8f9fa' }}>
                                <Users className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="mb-3">Smallholder Farmers</h3>
                                <p>We partner with thousands of rural farmers through our Rural Empowerment Initiative, providing inputs, training, and guaranteed buyback programs.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: '#f8f9fa' }}>
                                <ShoppingBag className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="mb-3">Retail & Distribution</h3>
                                <p>Our products are available in supermarkets and retail stores nationwide. We are always looking to expand our distribution network.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: '#f8f9fa' }}>
                                <Truck className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="mb-3">Logistics Providers</h3>
                                <p>We work with reliable logistics partners to ensure that our premium food products reach our customers fresh and on time.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="icon-box" style={{ background: '#f8f9fa' }}>
                                <Globe className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="mb-3">International Off-takers</h3>
                                <p>Exploring opportunities for export, we engage with international partners to bring the best of Nigerian agriculture to the global market.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container text-center">
                    <div className="glass-card" style={{ background: 'var(--black)', color: 'white', padding: '4rem' }}>
                        <Handshake size={64} className="text-gold mb-6 mx-auto" />
                        <h2 className="text-white mb-6">Interested in Partnering with Us?</h2>
                        <p className="mb-8 text-white/70 max-w-xl mx-auto">
                            Whether you are a distributor, a supplier, or an investor, we are eager to hear from you.
                            Let's explore how we can contribute to the growth of the Nigerian agricultural sector together.
                        </p>
                        <a href="/contact" className="btn btn-primary">Become a Partner</a>
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
                    { label: 'About', url: '/about' },
                    { label: 'Contact', url: '/contact' }
                ]}
                ctaText="Discuss Collaboration"
                ctaLink="/contact"
            />
        </div>
    );
};

export default Partners;
