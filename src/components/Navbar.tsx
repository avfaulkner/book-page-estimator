import React, { useState } from "react";
import { Link } from "react-router-dom"; // if you use React Router
// Or if no router: simple anchor with ids

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-700">Book Tools</div>
        <div className="hidden md:flex space-x-6">
          <a href="#estimate" className="hover:text-blue-600">Estimate Pages</a>
          <a href="#cover" className="hover:text-blue-600">Design Cover</a>
          <a href="#pdf" className="hover:text-blue-600">Create PDF Book</a>
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {/* hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <a href="#estimate" className="block py-2 hover:text-blue-600">Estimate Pages</a>
          <a href="#cover" className="block py-2 hover:text-blue-600">Design Cover</a>
          <a href="#pdf" className="block py-2 hover:text-blue-600">Create PDF Book</a>
        </div>
      )}
    </nav>
)};

export default Navbar;