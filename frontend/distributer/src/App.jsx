import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Managebureau from './pages/Managebureau'
import Createbureau from './pages/Createbureau'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bureau/manage" element={<Managebureau />} />
        <Route path="/bureau/create" element={<Createbureau />} />
        <Route path="/login" element={<Login />} />
      
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
