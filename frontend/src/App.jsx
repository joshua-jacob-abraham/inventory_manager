import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dash from './Pages/Dash.jsx';
import NewStock from "./Pages/New.jsx";
import ReturnStock from './Pages/Return.jsx';
import ViewStock from './Pages/View.jsx';
import Home from './Pages/Home.jsx';
import { BrandNameProvider } from './contexts/BrandNameContext.jsx';

function App() {
  return (
    <BrandNameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/add-new" element={<NewStock />} />
          <Route path="/add-returned" element={<ReturnStock />} />
          <Route path="/view" element={<ViewStock />} />
        </Routes>
      </Router>
    </BrandNameProvider>    
  );
}

export default App;
