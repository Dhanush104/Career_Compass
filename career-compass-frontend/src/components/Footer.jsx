import React from "react";
import { FaFacebook, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-10 text-center py-10 px-3 md:px-3 bg-gradient-to-br from-emerald-50 via-teal-50 to-rose-50">
      
      {/* Brand & Tagline */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-emerald-500 to-rose-400 mb-1 drop-shadow-sm">
          Career Compass
        </h2>
        <p className="text-sm md:text-base text-gray-700 font-medium">Your GPS to career success.</p>
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-4 mb-6">
        <a
          href="#"
          aria-label="Visit us on Facebook"
          className="text-gray-500 hover:text-blue-600 transition-colors transform hover:scale-125"
        >
          <FaFacebook className="h-6 w-6" />
        </a>
        <a
          href="#"
          aria-label="Visit us on Twitter"
          className="text-gray-500 hover:text-sky-500 transition-colors transform hover:scale-125"
        >
          <FaTwitter className="h-6 w-6" />
        </a>
        <a
          href="#"
          aria-label="Visit us on LinkedIn"
          className="text-gray-500 hover:text-blue-800 transition-colors transform hover:scale-125"
        >
          <FaLinkedinIn className="h-6 w-6" />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()} Career Compass. All rights reserved.
      </p>

      {/* Gradient Divider */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
    </footer>
  );
};

export default Footer;