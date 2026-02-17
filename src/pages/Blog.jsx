import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, ArrowRight, Tag, Mail, Sparkles, BookOpen } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://renee-global.vercel.app/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        document.title = "Blog | Renee Golden Multi-ventures Limited";
        window.scrollTo(0, 0);
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${API_URL}/blogs`);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <div className="blog-page" style={{ backgroundColor: '#FAFAFA' }}>
            <Navbar />

            {/* === HERO BANNER === */}
            <section style={{
                position: 'relative',
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1499750310159-5b988371c0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.35)'
                }} />

                {/* Gradient Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.4) 50%, rgba(212,175,55,0.2) 100%)'
                }} />

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212,175,55,0.15)',
                    animation: 'pulse 4s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '5%',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212,175,55,0.1)',
                    animation: 'pulse 5s ease-in-out infinite'
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '8rem 2rem 4rem',
                    maxWidth: '800px'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'rgba(212,175,55,0.15)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '50px',
                        padding: '0.5rem 1.25rem',
                        marginBottom: '1.5rem',
                        color: '#D4AF37',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        <BookOpen size={16} />
                        Our Blog & Insights
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        marginBottom: '1.25rem',
                        lineHeight: '1.15',
                        letterSpacing: '-0.02em',
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        Stories, Updates &<br />
                        <span style={{ color: '#D4AF37' }}>Industry Insights</span>
                    </h1>

                    <p style={{
                        fontSize: '1.15rem',
                        color: 'rgba(255,255,255,0.75)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.7'
                    }}>
                        Stay informed with the latest news, trends, and updates from the Renee Golden ecosystem — agriculture, investments, and sustainable growth.
                    </p>
                </div>
            </section>

            {/* === BLOG CONTENT === */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                            <div style={{
                                width: '56px', height: '56px',
                                border: '3px solid #F3F4F6',
                                borderTopColor: '#D4AF37',
                                borderRadius: '50%',
                                margin: '0 auto 1.5rem',
                                animation: 'spin 0.8s linear infinite'
                            }} />
                            <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>Loading articles...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        <>
                            {/* Featured Post (First one) */}
                            <div style={{ marginBottom: '4rem' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                                    gap: 0,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'transform 0.4s ease, box-shadow 0.4s ease'
                                }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 30px 80px -10px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 20px 60px -10px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <div style={{ position: 'relative', minHeight: '350px', overflow: 'hidden' }}>
                                        <img
                                            src={posts[0].link}
                                            alt={posts[0].title || posts[0].caption}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                position: 'absolute', inset: 0,
                                                transition: 'transform 0.6s ease'
                                            }}
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=800&q=80'; }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1.25rem', left: '1.25rem',
                                            display: 'inline-flex',
                                            alignItems: 'center', gap: '0.4rem',
                                            backgroundColor: '#D4AF37',
                                            color: '#FFFFFF',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '50px',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            <Sparkles size={12} /> Featured
                                        </div>
                                    </div>

                                    <div style={{ padding: '2.5rem' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '1rem'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontWeight: '700' }}>
                                                <Tag size={14} /> NEWS
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <Calendar size={14} /> {new Date(posts[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <h2 style={{
                                            fontSize: '1.85rem',
                                            fontWeight: '800',
                                            color: '#111827',
                                            marginBottom: '0.75rem',
                                            lineHeight: '1.25',
                                            letterSpacing: '-0.02em',
                                            fontFamily: 'Outfit, sans-serif'
                                        }}>
                                            {posts[0].title || posts[0].caption}
                                        </h2>

                                        {/* Caption */}
                                        {posts[0].title && (
                                            <p style={{
                                                fontSize: '1.05rem',
                                                color: '#6B7280',
                                                marginBottom: '1.5rem',
                                                lineHeight: '1.7',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {posts[0].caption}
                                            </p>
                                        )}

                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            paddingTop: '1.25rem',
                                            borderTop: '1px solid #F3F4F6'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#FFF', fontWeight: '700', fontSize: '0.8rem'
                                                }}>
                                                    {(posts[0].author || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827', margin: 0 }}>
                                                        {posts[0].author || 'Admin'}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>Author</p>
                                                </div>
                                            </div>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                color: '#D4AF37', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                                            }}>
                                                Read Article <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Posts Grid */}
                            {posts.length > 1 && (
                                <>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        marginBottom: '2rem'
                                    }}>
                                        <div style={{ height: '4px', width: '40px', backgroundColor: '#D4AF37', borderRadius: '2px' }} />
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                                            Latest Articles
                                        </h3>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                        gap: '2rem'
                                    }}>
                                        {posts.slice(1).map(post => (
                                            <div key={post._id} style={{
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                                                cursor: 'pointer'
                                            }}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                                                }}
                                            >
                                                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                                    <img
                                                        src={post.link}
                                                        alt={post.title || post.caption}
                                                        style={{
                                                            width: '100%', height: '100%', objectFit: 'cover',
                                                            transition: 'transform 0.5s ease'
                                                        }}
                                                        onMouseOver={e => e.target.style.transform = 'scale(1.08)'}
                                                        onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d9c?w=400&q=80'; }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0, left: 0, right: 0,
                                                        height: '80px',
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                                                    }} />
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '1rem', left: '1rem',
                                                        backgroundColor: '#D4AF37',
                                                        color: '#FFF',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '700',
                                                        padding: '0.3rem 0.85rem',
                                                        borderRadius: '50px',
                                                        letterSpacing: '0.05em',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        News
                                                    </div>
                                                </div>
                                                <div style={{ padding: '1.5rem' }}>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                        fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '0.75rem'
                                                    }}>
                                                        <Calendar size={13} />
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        <span style={{ margin: '0 0.25rem', color: '#E5E7EB' }}>•</span>
                                                        <User size={13} />
                                                        {post.author || 'Admin'}
                                                    </div>

                                                    {/* Headline */}
                                                    <h3 style={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: '800',
                                                        color: '#111827',
                                                        marginBottom: '0.5rem',
                                                        lineHeight: '1.35',
                                                        fontFamily: 'Outfit, sans-serif',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {post.title || post.caption}
                                                    </h3>

                                                    {/* Caption */}
                                                    {post.title && (
                                                        <p style={{
                                                            fontSize: '0.9rem',
                                                            color: '#6B7280',
                                                            lineHeight: '1.6',
                                                            marginBottom: '1rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {post.caption}
                                                        </p>
                                                    )}

                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                        color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem',
                                                        transition: 'gap 0.3s ease'
                                                    }}>
                                                        Read More <ArrowRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '5rem 2rem',
                            backgroundColor: '#FFFFFF', borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.2))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem'
                            }}>
                                <BookOpen size={32} color="#D4AF37" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>No Articles Yet</h3>
                            <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto', lineHeight: '1.7' }}>
                                Check back soon for the latest news and updates from Renee Golden Multi-ventures.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* === STAY UPDATED / NEWSLETTER SECTION === */}
            <section style={{
                position: 'relative',
                padding: '5rem 0',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 50%, #1A1A1A 100%)'
            }}>
                {/* Decorative gold circles */}
                <div style={{
                    position: 'absolute',
                    top: '-60px', right: '-60px',
                    width: '250px', height: '250px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-40px', left: '-40px',
                    width: '200px', height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)'
                }} />

                {/* Top gold bar */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px', height: '4px',
                    background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                    borderRadius: '2px'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        maxWidth: '640px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                            border: '1px solid rgba(212,175,55,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Mail size={26} color="#D4AF37" />
                        </div>

                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                            fontWeight: '900',
                            color: '#FFFFFF',
                            marginBottom: '0.75rem',
                            lineHeight: '1.2',
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '-0.02em'
                        }}>
                            Stay <span style={{ color: '#D4AF37' }}>Updated</span>
                        </h2>

                        <p style={{
                            fontSize: '1.05rem',
                            color: '#A1A1AA',
                            marginBottom: '2rem',
                            lineHeight: '1.7',
                            maxWidth: '500px',
                            margin: '0 auto 2rem'
                        }}>
                            Subscribe to our newsletter for the latest updates on sustainable agriculture, food security, and investment opportunities.
                        </p>

                        {/* Subscribe Form */}
                        <form onSubmit={handleSubscribe} style={{
                            display: 'flex',
                            maxWidth: '480px',
                            margin: '0 auto',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(212,175,55,0.2)'
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '1rem 1.25rem',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#2A2A2A',
                                    color: '#FFFFFF',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button type="submit" style={{
                                padding: '1rem 1.75rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, #D4AF37, #C5A028)',
                                color: '#FFFFFF',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.02em'
                            }}
                                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #E5C040, #D4AF37)'}
                                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #C5A028)'}
                            >
                                Subscribe
                            </button>
                        </form>

                        {/* Success Message */}
                        {subscribed && (
                            <div style={{
                                marginTop: '1.25rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'rgba(34,197,94,0.1)',
                                border: '1px solid rgba(34,197,94,0.2)',
                                color: '#22C55E',
                                padding: '0.6rem 1.25rem',
                                borderRadius: '50px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                animation: 'fadeIn 0.4s ease'
                            }}>
                                ✓ Thanks for subscribing! We'll keep you updated.
                            </div>
                        )}

                        {/* Privacy Note */}
                        <p style={{
                            fontSize: '0.78rem',
                            color: '#52525B',
                            marginTop: '1.25rem',
                            lineHeight: '1.5'
                        }}>
                            We respect your privacy. Unsubscribe anytime.
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
                    { label: 'Blog', url: '/blog' },
                    { label: 'Contact', url: '/contact' }
                ]}
                ctaText="Partner With Us"
                ctaLink="/contact"
            />

            {/* Animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Blog;
