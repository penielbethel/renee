import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';

// Subsidiaries
import GlobalServices from './pages/Subsidiaries/GlobalServices';
import RuralEmpowerment from './pages/Subsidiaries/RuralEmpowerment';
import EstateServices from './pages/Subsidiaries/EstateServices';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Parent Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          {/* Subsidiary Routes */}
          <Route path="/subsidiaries/global-services" element={<GlobalServices />} />
          <Route path="/subsidiaries/rural-empowerment" element={<RuralEmpowerment />} />
          <Route path="/subsidiaries/estate-services" element={<EstateServices />} />

          {/* Placeholders for other links to avoid 404s mostly */}
          <Route path="/shop" element={<div className="container section text-center"><h1>Shop Coming Soon</h1></div>} />
          <Route path="/about" element={<div className="container section text-center"><h1>About Us Coming Soon</h1></div>} />
          <Route path="/investments" element={<div className="container section text-center"><h1>Investments Coming Soon</h1></div>} />

          {/* Catch all */}
          <Route path="*" element={<div className="container section text-center"><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
