import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-primary text-white p-4">
    <div className="container mx-auto flex justify-between">
      <Link to="/" className="font-bold text-xl">BookHive</Link>
      <div className="space-x-4">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;