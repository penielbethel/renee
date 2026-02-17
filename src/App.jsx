import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import About from './pages/About';
import Investments from './pages/Investments';
import Partners from './pages/Partners';
import Legal from './pages/Legal';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';

// Subsidiaries
import GlobalServices from './pages/Subsidiaries/GlobalServices';
import RuralEmpowerment from './pages/Subsidiaries/RuralEmpowerment';
import EstateServices from './pages/Subsidiaries/EstateServices';

import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Hide the HTML preloader once React mounts
    const htmlPreloader = document.getElementById('app-preloader');
    if (htmlPreloader) {
      // Keep it visible for a moment to ensure smooth transition
      setTimeout(() => {
        htmlPreloader.style.opacity = '0';
        setTimeout(() => {
          htmlPreloader.remove();
          setLoading(false);
        }, 500);
      }, 3000); // Wait 3 seconds before fading out
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Router>
      <div className="app" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <Routes>
          {/* Parent Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          {/* Subsidiary Routes */}
          <Route path="/subsidiaries/global-services" element={<GlobalServices />} />
          <Route path="/subsidiaries/rural-empowerment" element={<RuralEmpowerment />} />
          <Route path="/subsidiaries/estate-services" element={<EstateServices />} />

          {/* Other Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/super-admin-dashboard" element={<AdminDashboard />} />

          {/* Catch all */}
          <Route path="*" element={<div className="container section text-center"><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
