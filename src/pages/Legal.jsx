import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Legal = () => {
    return (
        <div className="legal-page">
            <Navbar />

            <section className="section" style={{ paddingTop: '8rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 className="mb-8">Legal Information</h1>

                    <div className="mb-12">
                        <h2 id="privacy" className="text-gold mb-4">Privacy Policy</h2>
                        <p className="mb-4">
                            At Renee Golden Multi-ventures Limited, we are committed to protecting your privacy. This policy explains how we collect and use your data when you visit our website or use our services.
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li className="mb-2"><strong>Data Collection:</strong> We collection information you provide voluntarily (e.g., via contact forms or shop orders).</li>
                            <li className="mb-2"><strong>Use of Information:</strong> Your data is used to process orders, respond to inquiries, and improve our services.</li>
                            <li className="mb-2"><strong>Security:</strong> We implement industry-standard measures to protect your information from unauthorized access.</li>
                            <li className="mb-2"><strong>Third Parties:</strong> We do not sell your data. Information is only shared with logistics partners for order delivery.</li>
                        </ul>
                    </div>

                    <hr className="my-12 opacity-10" />

                    <div className="mb-12">
                        <h2 id="terms" className="text-gold mb-4">Terms of Service</h2>
                        <p className="mb-4">
                            By accessing this website, you agree to be bound by these terms and conditions.
                        </p>
                        <h3 className="mb-3">1. Use of Website</h3>
                        <p className="mb-4">
                            The content on this site is for general information and corporate showcase. Unauthorized use of this website may give rise to a claim for damages.
                        </p>
                        <h3 className="mb-3">2. Products & Pricing</h3>
                        <p className="mb-4">
                            Product availability and pricing are subject to change without notice. We reserve the right to limit quantities of products offered.
                        </p>
                        <h3 className="mb-3">3. Payments</h3>
                        <p className="mb-4">
                            Payments for orders placed through the Renee Marketplace are handled via direct bank transfer or other manual methods as communicated by our agents.
                        </p>
                    </div>

                    <div className="bg-light p-8 rounded-2xl">
                        <p className="text-sm italic">
                            Last updated: February 2026. For further legal inquiries, please contact our legal department at <a href="mailto:legal@reneegoldenmultiventures.com" className="text-gold font-bold">legal@reneegoldenmultiventures.com</a>
                        </p>
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
                ctaText="Return Home"
                ctaLink="/"
            />
        </div>
    );
};

export default Legal;
