import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = ({
    companyName,
    aboutText,
    address,
    registration,
    email,
    phone,
    quickLinks,
    ctaText,
    ctaLink
}) => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="grid grid-cols-4 gap-4">

                    {/* Column 1: Company Info */}
                    <div>
                        <h3>{companyName}</h3>
                        {aboutText && <p>{aboutText}</p>}
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Registration:</strong> {registration}</p>
                        </div>
                    </div>

                    {/* Column 2: Address */}
                    <div>
                        <h3>Head Office</h3>
                        <div className="flex gap-2" style={{ alignItems: 'flex-start' }}>
                            <MapPin size={18} style={{ marginTop: '4px', flexShrink: 0 }} />
                            <p style={{ whiteSpace: 'pre-line' }}>{address}</p>
                        </div>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3>Contact Us</h3>
                        <div className="flex flex-col gap-2">
                            <a href={`mailto:${email}`} className="flex items-center gap-2">
                                <Mail size={16} /> {email}
                            </a>
                            <a href={`tel:${phone}`} className="flex items-center gap-2">
                                <Phone size={16} /> {phone}
                            </a>
                        </div>
                        {/* Social Icons Placeholder */}
                        <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                            <Facebook size={20} />
                            <Twitter size={20} />
                            <Linkedin size={20} />
                            <Instagram size={20} />
                        </div>
                    </div>

                    {/* Column 4: Quick Links / CTA */}
                    <div>
                        <h3>Quick Links</h3>
                        {quickLinks ? (
                            <ul>
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        {link.url.startsWith('/') ? (
                                            <Link to={link.url}>{link.label}</Link>
                                        ) : (
                                            <a href={link.url}>{link.label}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Explore our services and offerings.</p>
                        )}

                        {ctaText && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <Link to={ctaLink || '/contact'} className="btn btn-primary">
                                    {ctaText}
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
