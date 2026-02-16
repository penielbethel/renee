import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="branding" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/Renee Main Logo.png" alt="Renee Golden Logo" style={{ height: '50px' }} />
          <div className="logo" style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>RENEE GOLDEN<br /><span style={{ fontSize: '0.8rem', fontWeight: '400', letterSpacing: '1px' }}>MULTI-VENTURES LTD</span></div>
        </Link>

        <div className="mobile-toggle" onClick={toggleMenu} style={{ display: 'none', cursor: 'pointer', color: 'white' }}>
          {isOpen ? <X /> : <Menu />}
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>Shop</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>

          <div className="dropdown">
            <div className="nav-link dropdown-toggle">
              Subsidiaries <ChevronDown size={14} />
            </div>
            <div className="dropdown-menu">
              <Link to="/subsidiaries/global-services" className="dropdown-item">
                Renee Golden Global Services
              </Link>
              <Link to="/subsidiaries/rural-empowerment" className="dropdown-item">
                Renee Rural Empowerment
              </Link>
              <Link to="/subsidiaries/estate-services" className="dropdown-item">
                HRL Estate Services
              </Link>
            </div>
          </div>

          <Link to="/investments" className={`nav-link ${isActive('/investments')}`}>Investments</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
          <Link to="/login" className={`nav-link ${isActive('/login')}`} title="Admin Access">Portal</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
