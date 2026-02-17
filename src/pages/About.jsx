import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { Target, Eye, ShieldCheck, Award, Heart, CheckCircle, Leaf, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    useEffect(() => {
        document.title = "About Us | Renee Golden - Our Mission and Agricultural Vision";
        window.scrollTo(0, 0);
    }, []);

    const stats = [
        { number: '10+', label: 'Years of Impact' },
        { number: '500+', label: 'Farmers Empowered' },
        { number: '100%', label: 'Organic Processes' },
        { number: '3', label: 'Key Subsidiaries' }
    ];

    return (
        <div className="about-page" style={{ backgroundColor: '#FAFAFA' }}>
            <Navbar />

            <Hero
                title="About Renee Golden"
                subtitle="Pioneering sustainable agriculture and industrial innovation in Nigeria."
                bgImage="/images/banner_two.jpg"
            />

            {/* Introduction & Our Story */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-2 gap-12 items-center">
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                width: '100px',
                                height: '100px',
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '50%',
                                zIndex: 0
                            }}></div>
                            <img
                                src="/images/hero_static.jpg"
                                alt="Renee Golden Team"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    zIndex: 1,
                                    width: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-20px',
                                backgroundColor: '#D4AF37',
                                color: '#fff',
                                padding: '2rem',
                                borderRadius: '16px',
                                zIndex: 2,
                                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
                            }}>
                                <p style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, marginBottom: '0.5rem' }}>RC</p>
                                <p style={{ fontWeight: '600', letterSpacing: '2px' }}>1506925</p>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#FFF9E6', color: '#D4AF37', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                OUR STORY
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1A1A1A', marginBottom: '1.5rem' }}>
                                A Legacy of <span style={{ color: '#D4AF37' }}>Growth & Integrity</span>
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                Founded with a vision to revolutionize the agricultural landscape in Nigeria, <strong>Renee Golden Multi-ventures Limited</strong> has grown from a visionary idea into a multifaceted conglomerate.
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '2rem' }}>
                                We bridge the gap between traditional farming and modern industrial processing. By investing in the entire value chain—from soil to shelf—we ensure that every product bearing our name represents the pinnacle of quality, hygiene, and nutritional value.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <Leaf className="text-gold" size={24} />
                                    <div>
                                        <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Sustainable</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Eco-friendly farming practices.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <Globe className="text-gold" size={24} />
                                    <div>
                                        <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Global Standards</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Export-ready quality control.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Dark Premium Section */}
            <section className="section" style={{ backgroundColor: '#1A1A1A', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    opacity: 0.1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="grid grid-cols-2 gap-16">

                        {/* Mission */}
                        <div style={{
                            padding: '3rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: '60px', height: '60px',
                                backgroundColor: '#D4AF37',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)'
                            }}>
                                <Target size={32} color="#1A1A1A" />
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#D4AF37' }}>Our Mission</h3>
                            <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.8' }}>
                                To drive sustainable economic growth by harnessing the potential of the agricultural value chain, delivering premium quality foods, and empowering communities through ethical business practices.
                            </p>
                        </div>

                        {/* Vision */}
                        <div style={{
                            padding: '3rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: '60px', height: '60px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 10px 20px rgba(255, 255, 255, 0.1)'
                            }}>
                                <Eye size={32} color="#1A1A1A" />
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>Our Vision</h3>
                            <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: '1.8' }}>
                                To be the undisputed leader in the West African agricultural sector, recognized globally for innovation, quality, and our commitment to feeding the future.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section" style={{ backgroundColor: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                        <span style={{ color: '#D4AF37', fontWeight: '700', letterSpacing: '1px' }}>OUR PHILOSOPHY</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '1rem', color: '#1A1A1A' }}>Core Values That Drive Us</h2>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>We believe that how we do business is just as important as what we do.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {[
                            { icon: ShieldCheck, title: 'Integrity', text: 'We uphold the highest standards of honesty and transparency in all our dealings with partners, farmers, and consumers.' },
                            { icon: Award, title: 'Excellence', text: 'We are relentless in our pursuit of quality. Good enough is never enough for us; we aim for the best.' },
                            { icon: Heart, title: 'Sustainability', text: 'We protect our planet by employing eco-friendly farming methods that ensure the land remains fertile for generations.' },
                            { icon: Users, title: 'Empowerment', text: 'We believe in growing together. Our success is shared with the rural communities that support our operations.' },
                            { icon: CheckCircle, title: 'Accountability', text: 'We take ownership of our actions and their impact on our stakeholders and the environment.' },
                            { icon: Target, title: 'Innovation', text: 'We constantly seek new and better ways to solve age-old agricultural challenges.' }
                        ].map((value, idx) => (
                            <div key={idx} style={{
                                padding: '2rem',
                                borderRadius: '16px',
                                backgroundColor: '#FAFAFA',
                                transition: 'all 0.3s ease',
                                border: '1px solid transparent'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = '#F0F0F0';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FAFAFA';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ marginBottom: '1.5rem', color: '#D4AF37' }}>
                                    <value.icon size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1A1A1A' }}>{value.title}</h3>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats / Impact Bar */}
            <section style={{ backgroundColor: '#D4AF37', padding: '4rem 0', color: '#1A1A1A' }}>
                <div className="container">
                    <div className="grid grid-cols-4 gap-8 text-center divide-x divide-black/10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-item">
                                <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>{stat.number}</div>
                                <div style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1A1A1A' }}>Ready to Partner With Us?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: '#666' }}>
                        Whether you are an investor, a distributor, or a farmer, there is a place for you in the Renee Golden ecosystem.
                    </p>
                    <Link to="/contact" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Get in Touch
                    </Link>
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
