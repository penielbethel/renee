import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import { Home, Hammer, Key, Briefcase } from 'lucide-react';

const EstateServices = () => {
    return (
        <>
            <Navbar />

            {/* Hero */}
            <Hero
                title="HRL Estate Services"
                subtitle="Strategic real estate solutions supporting agribusiness infrastructure and commercial development."
                bgImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                ctaButtons={[{ label: 'View Properties', link: '#properties' }]}
            />

            {/* Mission & Vision */}
            <section className="section bg-light">
                <div className="container">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Mission</h3>
                            <p>To provide strategic real estate solutions and estate management services that support agribusiness infrastructure and commercial development.</p>
                        </div>
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Vision</h3>
                            <p>To become a trusted real estate partner for agricultural and industrial enterprises across Nigeria.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center mb-8">Estate Solutions</h2>
                    <div className="grid grid-cols-2 gap-4">

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Home size={32} />
                            </div>
                            <h3>Property Sales</h3>
                            <p>Facilitating the purchase and sale of agricultural lands, warehouses, and commercial properties.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Hammer size={32} />
                            </div>
                            <h3>Infrastructure</h3>
                            <p>Designing and constructing silos, barns, processing units, and farm access roads.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Key size={32} />
                            </div>
                            <h3>Facility Management</h3>
                            <p>Professional maintenance and management of agricultural and industrial estates.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Briefcase size={32} />
                            </div>
                            <h3>Project Portfolio</h3>
                            <p>Explore our successfully delivered projects in Lagos and across Nigeria.</p>
                        </div>

                    </div>

                    <div className="text-center mt-8">
                        <a href="#consultation" className="btn btn-primary">Request Property Consultation</a>
                    </div>
                </div>
            </section>

            {/* Specific Footer for this subsidiary */}
            <Footer
                companyName="HRL Estate Services"
                registration="Business No.: 9089516"
                address={`1 Rialto Close\nAlhaji Amoo Street\nOgudu Road\nOjota, Lagos State\nNigeria`}
                email="contact@hrlestates.ng"
                phone="+234-XXX-XXX-XXXX"
                ctaText="Request Property Consultation"
                ctaLink="#consultation"
            />
        </>
    );
};

export default EstateServices;
