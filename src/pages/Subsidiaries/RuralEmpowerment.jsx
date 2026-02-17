import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import { Users, Tractor, TrendingUp, Library } from 'lucide-react';

const RuralEmpowerment = () => {
    return (
        <>
            <Navbar />

            {/* Hero */}
            <Hero
                title="Renee Rural Empowerment Initiative"
                subtitle="Empowering rural farmers through sustainable agricultural training and market linkages."
                bgImage="https://images.unsplash.com/photo-1499750310159-5b988371c0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                ctaButtons={[{ label: 'Register for Training', link: '#register' }]}
            />

            {/* Mission & Vision */}
            <section className="section bg-light">
                <div className="container">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Mission</h3>
                            <p>To empower rural farmers through sustainable agricultural training, shared machinery access, fertilizer access programs, and structured market linkages.</p>
                        </div>
                        <div className="p-6 bg-white rounded shadow-sm">
                            <h3 className="text-gold mb-2">Our Vision</h3>
                            <p>To create thriving rural communities where farmers operate efficiently, access fair markets, and build resilient agricultural businesses.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center mb-8">Our Programs</h2>
                    <div className="grid grid-cols-2 gap-4">

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Users size={32} />
                            </div>
                            <h3>Skills Development</h3>
                            <p>Hands-on training in modern farming techniques, crop rotation, and sustainable practices.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Tractor size={32} />
                            </div>
                            <h3>Machinery Sharing</h3>
                            <p>Providing access to tractors, harvesters, and essential farming equipment at affordable rates.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <TrendingUp size={32} />
                            </div>
                            <h3>Market Access</h3>
                            <p>Connecting smallholders directly to buyers to ensure fair pricing and reduced post-harvest losses.</p>
                        </div>

                        <div className="card p-6 flex flex-col items-center text-center">
                            <div className="icon-box">
                                <Library size={32} />
                            </div>
                            <h3>Resource Center</h3>
                            <p>A hub for agricultural knowledge, weather updates, and market intelligence for our members.</p>
                        </div>

                    </div>

                    <div className="text-center mt-8">
                        <a href="#register" className="btn btn-primary">Join Our Next Workshop</a>
                    </div>
                </div>
            </section>

            {/* Specific Footer for this subsidiary */}
            <Footer
                companyName="Renee Rural Empowerment Initiative"
                registration="Reg. No.: 8390979"
                address={`6 Dagunro Close Off Association Street\nOjota\nLagos State\nNigeria`}
                email="info@reneerural.org"
                phone="+234-XXX-XXX-XXXX"
                ctaText="Register for Upcoming Workshop"
                ctaLink="#register"
            />
        </>
    );
};

export default RuralEmpowerment;
