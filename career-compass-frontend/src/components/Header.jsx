import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  Search,
  BookOpen,
  Mail,
  Compass,
  Briefcase,
  Map,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { icon: <Home size={18} />, label: "Home" },
    { icon: <Briefcase size={18} />, label: "Services" },
    { icon: <Map size={18} />, label: "Roadmap" },
    { icon: <BookOpen size={18} />, label: "Blog" },
    { icon: <Mail size={18} />, label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-gray-100/80 border-b border-gray-200 z-50 transition-colors duration-300">
      
      {/* Logo */}
      <motion.a
  href="/"
  aria-label="Career Compass Home"
  whileHover={{ scale: 1.05, dropShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', color: '#F87171' }}
  className="text-2xl font-bold flex items-center space-x-2 cursor-pointer bg-gradient-to-r from-teal-500 via-emerald-500 to-rose-400 bg-clip-text text-transparent transition-all duration-300"
>
  <Compass size={28} className="text-teal-500 drop-shadow-sm transition-colors duration-300" />
  <span className="font-sans font-extrabold tracking-wide">
    CAREER COMPASS
  </span>
</motion.a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 font-medium">
        {navLinks.map((item, idx) => (
          <motion.a
            key={idx}
            href={`#${item.label.toLowerCase()}`}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center space-x-2 text-gray-700 hover:text-rose-500 transition-all duration-300 relative group"
          >
            {item.icon}
            <span>{item.label}</span>
            {/* Underline animation */}
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-teal-500 to-rose-400 group-hover:w-full transition-all duration-300"></span>
          </motion.a>
        ))}
      </nav>
      
      {/* Buttons & Search */}
      <div className="flex items-center space-x-4">
        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block p-3 rounded-full text-gray-600 hover:text-teal-600 hover:bg-gray-200 transition-colors duration-300"
          aria-label="Search"
        >
          <Search size={20} />
        </motion.button>
        
        {/* Log In Button */}
        <motion.button
          onClick={onLoginClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center space-x-2 text-sm px-6 py-3 rounded-full shadow-lg text-white font-semibold bg-gradient-to-r from-teal-500 to-rose-400 hover:from-teal-600 hover:to-rose-500 transition-all duration-300"
        >
          <User size={16} />
          <span>Log In</span>
        </motion.button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white text-gray-800 p-6 flex flex-col space-y-4 md:hidden rounded-b-xl shadow-lg border-t border-gray-200"
          >
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.label.toLowerCase()}`}
                className="flex items-center space-x-2 hover:text-rose-500 transition-colors"
              >
                {item.icon}
                <span className="text-lg font-medium">{item.label}</span>
              </a>
            ))}
            <button
              onClick={onLoginClick}
              className="w-full text-center text-base px-6 py-3 rounded-full shadow-md text-white font-semibold bg-gradient-to-r from-teal-500 to-rose-400 hover:from-teal-600 hover:to-rose-500 transition-all duration-300 mt-4"
            >
              Log In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;