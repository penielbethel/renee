import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact Us | Renee Golden Multi-ventures Limited";
    }, []);
    return (
        <>
            <Navbar />

            <Hero
                title="Get in Touch"
                subtitle="We'd love to hear from you."
                bgImage="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <form className="p-6 bg-light rounded">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Name</label>
                                <input type="text" className="w-full p-2 border rounded" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block mb-2">Email</label>
                                <input type="email" className="w-full p-2 border rounded" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Your Email" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Subject</label>
                            <input type="text" className="w-full p-2 border rounded" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Subject" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Message</label>
                            <textarea rows="5" className="w-full p-2 border rounded" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="How can we help?"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </section>

            <Footer
                companyName="Renee Golden Multi-ventures Limited"
                registration="RC 1506925"
                address="Okewande Street, Budo Nuhu Village, Airport Area, Asa L.G.A., Kwara State, Nigeria"
                email="info@reneegoldenmultiventures.com"
                phone="+234-XXX-XXX-XXXX"
                aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
                ctaText="Partner With Us"
                ctaLink="/contact"
            />
        </>
    );
};

export default Contact;
