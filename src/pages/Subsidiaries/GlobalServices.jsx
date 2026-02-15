import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import { Sprout, Factory, ClipboardList, Truck } from 'lucide-react';

const GlobalServices = () => {
    return (
        <>
            <Navbar />

            {/* Hero */}
            <Hero
                title="Renee Golden Global Services Limited"
                subtitle="Strengthening Nigeria's food value chain through end-to-end agricultural production and processing."
                bgImage="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                ctaButtons={[{ label: 'Request Agricultural Services', link: '#contact' }]}
            />

            {/* Mission & Vision */}
            <section className="section bg-light">
                <div className="container">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Mission</h3>
                            <p>To provide end-to-end agricultural production, mechanized farming, food processing, fertilizer distribution, and agro-technology solutions that strengthen Nigeria’s food value chain.</p>
                        </div>
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Vision</h3>
                            <p>To become a leading agro-industrial solutions provider delivering sustainable farming systems and high-quality food processing operations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center mb-8">Our Services</h2>
                    <div className="grid grid-cols-2 gap-4">

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Sprout size={32} />
                            </div>
                            <h3>Fertilizer & Agro Inputs</h3>
                            <p>Supplying high-quality fertilizers and inputs to maximize crop yield and soil health.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Factory size={32} />
                            </div>
                            <h3>Food Processing</h3>
                            <p>State-of-the-art milling and processing facilities ensuring premium quality food products.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <ClipboardList size={32} />
                            </div>
                            <h3>Agricultural Consultancy</h3>
                            <p>Expert advice on crop management, soil analysis, and farm optimization techniques.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Truck size={32} />
                            </div>
                            <h3>Logistics & Value Chain</h3>
                            <p>Streamlined logistics solutions for efficient movement of agricultural produce from farm to market.</p>
                        </div>

                    </div>

                    <div className="text-center mt-8">
                        <a href="#contact" className="btn btn-primary">Request Bulk Supply</a>
                    </div>
                </div>
            </section>

            {/* Specific Footer for this subsidiary */}
            <Footer
                companyName="Renee Golden Global Services Limited"
                registration="Company No.: 7463608"
                address={`6 Dagunro Close\nAssociation Avenue\nBehind Total Petrol Station\nOgudu Road, Ojota\nLagos State, Nigeria`}
                email="contact@reneegoldenglobal.com"
                phone="+234-XXX-XXX-XXXX"
                ctaText="Request Agricultural Services"
                ctaLink="#contact"
            />
        </>
    );
};

export default GlobalServices;
