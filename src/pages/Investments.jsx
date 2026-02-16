import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { TrendingUp, PieChart, Landmark, Handshake, Shield, ArrowUpRight } from 'lucide-react';

const Investments = () => {
    return (
        <div className="investments-page">
            <Navbar />

            <Hero
                title="Strategic Investments"
                subtitle="Capitalizing on emerging opportunities in agriculture, infrastructure, and industrial sectors to deliver sustainable long-term returns."
                bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Investment Philosophy */}
            <section className="section bg-light">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="mb-4">Our Investment Philosophy</h2>
                        <p className="max-w-3xl mx-auto">
                            At Renee Golden, we don't just invest capital; we invest in the future of the African economy.
                            Our focus is on real assets—land, food, and infrastructure—that provide essential value
                            regardless of market cycles.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="card p-8 bg-white border-0 shadow-sm hover:shadow-md transition">
                            <div className="icon-box" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                <Shield className="text-gold" size={28} />
                            </div>
                            <h3 className="mb-3">Security of Capital</h3>
                            <p className="text-sm">We prioritize the preservation of capital through rigorous due diligence and investment in tangible assets with underlying intrinsic value.</p>
                        </div>
                        <div className="card p-8 bg-white border-0 shadow-sm hover:shadow-md transition">
                            <div className="icon-box" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                <TrendingUp className="text-gold" size={28} />
                            </div>
                            <h3 className="mb-3">Growth in Real Value</h3>
                            <p className="text-sm">We aim for capital appreciation by improving the efficiency and productivity of the businesses and projects within our portfolio.</p>
                        </div>
                        <div className="card p-8 bg-white border-0 shadow-sm hover:shadow-md transition">
                            <div className="icon-box" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                <Handshake className="text-gold" size={28} />
                            </div>
                            <h3 className="mb-3">Strategic Partnership</h3>
                            <p className="text-sm">We believe in mutual growth. Our investment model involves partnering with stakeholders who share our vision for sustainable development.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Sectors */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center mb-12">Key Focus Sectors</h2>
                    <div className="grid grid-cols-2 gap-12">
                        <div className="flex gap-6 items-center p-6 border rounded-2xl">
                            <div className="bg-black p-4 rounded-xl">
                                <Landmark className="text-gold" size={40} />
                            </div>
                            <div>
                                <h3 className="text-gold">Agribusiness Infrastructure</h3>
                                <p>Investing in warehousing, cold storage, and processing plants that solve the post-harvest loss challenges in West Africa.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-center p-6 border rounded-2xl">
                            <div className="bg-black p-4 rounded-xl">
                                <PieChart className="text-gold" size={40} />
                            </div>
                            <div>
                                <h3 className="text-gold">Diversified Portfolios</h3>
                                <p>Managed allocations in high-growth industrial sectors and real estate developments through HRL Estate Services.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action for Partners */}
            <section className="section bg-black text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <TrendingUp size={400} />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-2xl">
                        <h2 className="text-gold mb-6">Partner With Renee Golden</h2>
                        <p className="text-lg text-white/80 mb-8">
                            We are open to institutional and private partnerships that align with our mission of industrializing the agricultural sector.
                            Let's discuss how we can create value together.
                        </p>
                        <div className="flex gap-4">
                            <a href="/contact" className="btn btn-primary">Inquire About Partnership</a>
                            <a href="mailto:invest@reneegoldenmultiventures.com" className="btn btn-outline">Email Investment Desk</a>
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
                    { label: 'About', url: '/about' },
                    { label: 'Contact', url: '/contact' }
                ]}
                ctaText="Discuss Opportunities"
                ctaLink="/contact"
            />
        </div>
    );
};

export default Investments;
