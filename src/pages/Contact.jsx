import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Send, MapPin, Mail, Phone, Clock, ChevronDown, CheckCircle,
    Building2, Sprout, Home, Users, MessageSquare, User, AtSign
} from 'lucide-react';

const COMPANIES = [
    {
        id: 'renee-multi',
        name: 'Renee Golden Multi-ventures Limited',
        shortName: 'Renee Multi-ventures',
        description: 'Parent company — Agriculture, Industrial & Investment',
        icon: Building2,
        color: '#D4AF37',
        email: 'info@reneegoldenmultiventures.com',
        phone: '+234-XXX-XXX-XXXX',
        address: 'Okewande Street, Budo Nuhu Village, Airport Area, Asa L.G.A., Kwara State, Nigeria',
        registration: 'RC 1506925'
    },
    {
        id: 'renee-global',
        name: 'Renee Golden Global Services Limited',
        shortName: 'Renee Global Services',
        description: 'Agricultural production, processing & agro-technology',
        icon: Sprout,
        color: '#22C55E',
        email: 'contact@reneegoldenglobal.com',
        phone: '+234-XXX-XXX-XXXX',
        address: '6 Dagunro Close, Association Avenue, Ogudu Road, Ojota, Lagos State, Nigeria',
        registration: 'Company No.: 7463608'
    },
    {
        id: 'hrl-estate',
        name: 'HRL Estate Services',
        shortName: 'HRL Estate Services',
        description: 'Real estate solutions & infrastructure development',
        icon: Home,
        color: '#3B82F6',
        email: 'contact@hrlestates.ng',
        phone: '+234-XXX-XXX-XXXX',
        address: '1 Rialto Close, Alhaji Amoo Street, Ogudu Road, Ojota, Lagos State, Nigeria',
        registration: 'Business No.: 9089516'
    },
    {
        id: 'renee-rural',
        name: 'Renee Rural Empowerment Initiative',
        shortName: 'Rural Empowerment',
        description: 'Sustainable agricultural training & rural development',
        icon: Users,
        color: '#F59E0B',
        email: 'info@reneerural.org',
        phone: '+234-XXX-XXX-XXXX',
        address: '6 Dagunro Close Off Association Street, Ojota, Lagos State, Nigeria',
        registration: 'Reg. No.: 8390979'
    }
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    });
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [formStatus, setFormStatus] = useState(null); // null, 'sending', 'success', 'error'
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        document.title = "Contact Us | Renee Golden Multi-ventures Limited";
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        setFormData(prev => ({ ...prev, company: company.id }));
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedCompany) {
            alert('Please select a company/subsidiary to direct your message to.');
            return;
        }

        setFormStatus('sending');

        // Blocked for now — will connect later
        setTimeout(() => {
            setFormStatus('success');
            console.log('Contact Form Data:', {
                ...formData,
                toEmail: 'reneemultiventures@gmail.com',
                companyName: selectedCompany.name
            });
        }, 1500);
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
        setSelectedCompany(null);
        setFormStatus(null);
    };

    const inputStyle = (field) => ({
        width: '100%',
        padding: '0.95rem 1rem 0.95rem 3rem',
        borderRadius: '12px',
        border: `2px solid ${focusedField === field ? '#D4AF37' : '#E5E7EB'}`,
        fontSize: '0.95rem',
        color: '#111827',
        backgroundColor: '#FFFFFF',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        boxShadow: focusedField === field ? '0 0 0 4px rgba(212,175,55,0.08)' : 'none'
    });

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: '0.9rem',
        letterSpacing: '0.01em'
    };

    const iconWrapStyle = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9CA3AF',
        pointerEvents: 'none'
    };

    return (
        <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
            <Navbar />

            {/* === HERO BANNER === */}
            <section style={{
                position: 'relative',
                minHeight: '55vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.3)'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 50%, rgba(212,175,55,0.15) 100%)'
                }} />

                <div style={{
                    position: 'relative', zIndex: 2,
                    textAlign: 'center', padding: '8rem 2rem 4rem',
                    maxWidth: '700px'
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        backgroundColor: 'rgba(212,175,55,0.15)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '50px', padding: '0.5rem 1.25rem',
                        marginBottom: '1.5rem', color: '#D4AF37',
                        fontSize: '0.85rem', fontWeight: '600',
                        letterSpacing: '0.05em', textTransform: 'uppercase'
                    }}>
                        <MessageSquare size={16} />
                        Contact Us
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                        fontWeight: '900', color: '#FFFFFF',
                        marginBottom: '1rem', lineHeight: '1.15',
                        letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif'
                    }}>
                        Let's Start a <span style={{ color: '#D4AF37' }}>Conversation</span>
                    </h1>

                    <p style={{
                        fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)',
                        maxWidth: '550px', margin: '0 auto', lineHeight: '1.7'
                    }}>
                        Whether it's investments, agriculture, real estate, or community empowerment — we'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* === MAIN CONTENT === */}
            <section style={{ padding: '4rem 0 5rem', marginTop: '-3rem', position: 'relative', zIndex: 5 }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth > 900 ? '380px 1fr' : '1fr',
                        gap: '2.5rem',
                        alignItems: 'start'
                    }}>

                        {/* LEFT — Company Info Cards */}
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem', fontWeight: '800', color: '#1A1A1A',
                                marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif'
                            }}>
                                Our Companies
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {COMPANIES.map((company) => {
                                    const Icon = company.icon;
                                    const isSelected = selectedCompany?.id === company.id;
                                    return (
                                        <div
                                            key={company.id}
                                            onClick={() => handleCompanySelect(company)}
                                            style={{
                                                padding: '1.25rem',
                                                borderRadius: '16px',
                                                backgroundColor: isSelected ? '#1A1A1A' : '#FFFFFF',
                                                border: isSelected ? '2px solid #D4AF37' : '2px solid #F3F4F6',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: isSelected
                                                    ? '0 8px 30px rgba(212,175,55,0.15)'
                                                    : '0 2px 8px rgba(0,0,0,0.04)',
                                                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                            onMouseOver={e => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.borderColor = '#D4AF37';
                                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                                                }
                                            }}
                                            onMouseOut={e => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.borderColor = '#F3F4F6';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                                }
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{
                                                    width: '44px', height: '44px', borderRadius: '12px',
                                                    background: isSelected
                                                        ? `linear-gradient(135deg, ${company.color}20, ${company.color}40)`
                                                        : `linear-gradient(135deg, ${company.color}10, ${company.color}20)`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Icon size={22} color={company.color} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{
                                                        fontSize: '0.95rem', fontWeight: '700',
                                                        color: isSelected ? '#FFFFFF' : '#111827',
                                                        margin: '0 0 0.25rem', lineHeight: '1.3'
                                                    }}>
                                                        {company.shortName}
                                                    </h4>
                                                    <p style={{
                                                        fontSize: '0.8rem',
                                                        color: isSelected ? 'rgba(255,255,255,0.6)' : '#9CA3AF',
                                                        margin: 0, lineHeight: '1.4'
                                                    }}>
                                                        {company.description}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                                                )}
                                            </div>

                                            {isSelected && (
                                                <div style={{
                                                    marginTop: '1rem', paddingTop: '1rem',
                                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                                                        <Mail size={13} /> {company.email}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                                                        <MapPin size={13} /> {company.address}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Quick Info */}
                            <div style={{
                                marginTop: '1.5rem', padding: '1.25rem',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #1A1A1A, #2A2A2A)',
                                border: '1px solid rgba(212,175,55,0.15)'
                            }}>
                                <h4 style={{
                                    fontSize: '0.9rem', fontWeight: '700', color: '#D4AF37',
                                    marginBottom: '1rem', margin: '0 0 1rem'
                                }}>
                                    General Contact
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            backgroundColor: 'rgba(212,175,55,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Mail size={15} color="#D4AF37" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                            reneemultiventures@gmail.com
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            backgroundColor: 'rgba(212,175,55,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Clock size={15} color="#D4AF37" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                            Mon – Fri: 8:00 AM – 5:00 PM (WAT)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Contact Form */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            {formStatus === 'success' ? (
                                /* Success State */
                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.2))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        animation: 'scaleIn 0.5s ease'
                                    }}>
                                        <CheckCircle size={40} color="#22C55E" />
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.5rem', fontWeight: '800', color: '#111827',
                                        marginBottom: '0.75rem', fontFamily: 'Outfit, sans-serif'
                                    }}>
                                        Message Sent Successfully!
                                    </h3>
                                    <p style={{
                                        color: '#6B7280', marginBottom: '0.5rem', lineHeight: '1.7'
                                    }}>
                                        Thank you for reaching out to <strong>{selectedCompany?.shortName}</strong>.
                                    </p>
                                    <p style={{
                                        color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '2rem'
                                    }}>
                                        We'll get back to you within 24-48 business hours.
                                    </p>
                                    <button
                                        onClick={resetForm}
                                        style={{
                                            padding: '0.85rem 2rem', borderRadius: '12px',
                                            border: '2px solid #D4AF37', background: 'transparent',
                                            color: '#D4AF37', fontWeight: '700', cursor: 'pointer',
                                            fontSize: '0.95rem', transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.backgroundColor = '#D4AF37';
                                            e.currentTarget.style.color = '#FFF';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#D4AF37';
                                        }}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                /* Form */
                                <>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h2 style={{
                                            fontSize: '1.5rem', fontWeight: '900', color: '#111827',
                                            marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif'
                                        }}>
                                            Send Us a Message
                                        </h2>
                                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>
                                            Fill out the form below and select the company you'd like to contact.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {/* Company Selector (Custom Dropdown) */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>
                                                Directing Message To <span style={{ color: '#D4AF37' }}>*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <div
                                                    onClick={() => setShowDropdown(!showDropdown)}
                                                    style={{
                                                        padding: '0.95rem 1rem 0.95rem 3rem',
                                                        borderRadius: '12px',
                                                        border: `2px solid ${showDropdown ? '#D4AF37' : selectedCompany ? '#22C55E' : '#E5E7EB'}`,
                                                        backgroundColor: selectedCompany ? '#F0FDF4' : '#FFFFFF',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: showDropdown ? '0 0 0 4px rgba(212,175,55,0.08)' : 'none'
                                                    }}
                                                >
                                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                                                        <Building2 size={18} />
                                                    </div>
                                                    <span style={{
                                                        color: selectedCompany ? '#111827' : '#9CA3AF',
                                                        fontSize: '0.95rem',
                                                        fontWeight: selectedCompany ? '600' : '400'
                                                    }}>
                                                        {selectedCompany ? selectedCompany.shortName : 'Select a company...'}
                                                    </span>
                                                    <ChevronDown size={18} color="#9CA3AF" style={{
                                                        transition: 'transform 0.3s ease',
                                                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)'
                                                    }} />
                                                </div>

                                                {/* Dropdown Options */}
                                                {showDropdown && (
                                                    <div style={{
                                                        position: 'absolute', top: 'calc(100% + 6px)',
                                                        left: 0, right: 0, zIndex: 50,
                                                        backgroundColor: '#FFFFFF',
                                                        borderRadius: '14px',
                                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                                        border: '1px solid #E5E7EB',
                                                        overflow: 'hidden',
                                                        animation: 'fadeIn 0.2s ease'
                                                    }}>
                                                        {COMPANIES.map((company) => {
                                                            const Icon = company.icon;
                                                            const isActive = selectedCompany?.id === company.id;
                                                            return (
                                                                <div
                                                                    key={company.id}
                                                                    onClick={(e) => { e.stopPropagation(); handleCompanySelect(company); }}
                                                                    style={{
                                                                        padding: '0.85rem 1rem',
                                                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: isActive ? 'rgba(212,175,55,0.05)' : '#FFFFFF',
                                                                        borderBottom: '1px solid #F3F4F6',
                                                                        transition: 'background-color 0.2s ease'
                                                                    }}
                                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = isActive ? 'rgba(212,175,55,0.08)' : '#F9FAFB'}
                                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = isActive ? 'rgba(212,175,55,0.05)' : '#FFFFFF'}
                                                                >
                                                                    <div style={{
                                                                        width: '36px', height: '36px', borderRadius: '10px',
                                                                        background: `${company.color}15`,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        flexShrink: 0
                                                                    }}>
                                                                        <Icon size={18} color={company.color} />
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111827', margin: 0 }}>
                                                                            {company.shortName}
                                                                        </p>
                                                                        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
                                                                            {company.description}
                                                                        </p>
                                                                    </div>
                                                                    {isActive && <CheckCircle size={16} color="#D4AF37" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name & Email Row */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr',
                                            gap: '1.25rem',
                                            marginBottom: '1.25rem'
                                        }}>
                                            <div>
                                                <label style={labelStyle}>Full Name <span style={{ color: '#D4AF37' }}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={iconWrapStyle}><User size={18} /></div>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={e => handleChange('name', e.target.value)}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        required
                                                        style={inputStyle('name')}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Email Address <span style={{ color: '#D4AF37' }}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={iconWrapStyle}><AtSign size={18} /></div>
                                                    <input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={e => handleChange('email', e.target.value)}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        required
                                                        style={inputStyle('email')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone & Subject Row */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr',
                                            gap: '1.25rem',
                                            marginBottom: '1.25rem'
                                        }}>
                                            <div>
                                                <label style={labelStyle}>Phone Number</label>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={iconWrapStyle}><Phone size={18} /></div>
                                                    <input
                                                        type="tel"
                                                        placeholder="+234 XXX XXX XXXX"
                                                        value={formData.phone}
                                                        onChange={e => handleChange('phone', e.target.value)}
                                                        onFocus={() => setFocusedField('phone')}
                                                        onBlur={() => setFocusedField(null)}
                                                        style={inputStyle('phone')}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Subject <span style={{ color: '#D4AF37' }}>*</span></label>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={iconWrapStyle}><MessageSquare size={18} /></div>
                                                    <input
                                                        type="text"
                                                        placeholder="What's this about?"
                                                        value={formData.subject}
                                                        onChange={e => handleChange('subject', e.target.value)}
                                                        onFocus={() => setFocusedField('subject')}
                                                        onBlur={() => setFocusedField(null)}
                                                        required
                                                        style={inputStyle('subject')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={labelStyle}>Message <span style={{ color: '#D4AF37' }}>*</span></label>
                                            <textarea
                                                placeholder="Tell us more about your inquiry, project, or partnership idea..."
                                                value={formData.message}
                                                onChange={e => handleChange('message', e.target.value)}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                rows="5"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.95rem 1rem',
                                                    borderRadius: '12px',
                                                    border: `2px solid ${focusedField === 'message' ? '#D4AF37' : '#E5E7EB'}`,
                                                    fontSize: '0.95rem',
                                                    color: '#111827',
                                                    backgroundColor: '#FFFFFF',
                                                    outline: 'none',
                                                    transition: 'all 0.3s ease',
                                                    fontFamily: 'inherit',
                                                    resize: 'vertical',
                                                    lineHeight: '1.6',
                                                    boxShadow: focusedField === 'message' ? '0 0 0 4px rgba(212,175,55,0.08)' : 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={formStatus === 'sending'}
                                            style={{
                                                width: '100%',
                                                padding: '1.1rem',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: formStatus === 'sending'
                                                    ? '#9CA3AF'
                                                    : 'linear-gradient(135deg, #D4AF37, #C5A028)',
                                                color: '#FFFFFF',
                                                fontWeight: '700',
                                                fontSize: '1rem',
                                                cursor: formStatus === 'sending' ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.6rem',
                                                transition: 'all 0.3s ease',
                                                boxShadow: formStatus !== 'sending' ? '0 6px 20px rgba(212,175,55,0.3)' : 'none',
                                                letterSpacing: '0.02em'
                                            }}
                                            onMouseOver={e => {
                                                if (formStatus !== 'sending') {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,55,0.4)';
                                                }
                                            }}
                                            onMouseOut={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,175,55,0.3)';
                                            }}
                                        >
                                            {formStatus === 'sending' ? (
                                                <>
                                                    <div style={{
                                                        width: '20px', height: '20px',
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderTopColor: '#FFF',
                                                        borderRadius: '50%',
                                                        animation: 'spin 0.8s linear infinite'
                                                    }} />
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} />
                                                    Send Message
                                                </>
                                            )}
                                        </button>

                                        {/* Note */}
                                        <p style={{
                                            textAlign: 'center', marginTop: '1rem',
                                            fontSize: '0.78rem', color: '#9CA3AF',
                                            lineHeight: '1.5'
                                        }}>
                                            All messages are directed to{' '}
                                            <strong style={{ color: '#6B7280' }}>reneemultiventures@gmail.com</strong>
                                            {' '}and routed to the appropriate team.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer
                companyName="Renee Golden Multi-ventures Limited"
                registration="RC 1506925"
                address="Okewande Street, Budo Nuhu Village, Airport Area, Asa L.G.A., Kwara State, Nigeria"
                email="reneemultiventures@gmail.com"
                phone="+234-XXX-XXX-XXXX"
                aboutText="A diversified agricultural, industrial, and investment company committed to long-term value creation."
                ctaText="Partner With Us"
                ctaLink="/contact"
            />

            {/* Animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Contact;
