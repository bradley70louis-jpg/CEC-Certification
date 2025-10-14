import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
