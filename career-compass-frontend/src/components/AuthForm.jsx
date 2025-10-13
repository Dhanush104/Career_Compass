import React, { useState } from "react";
import { X, User, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (!isLogin) {
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
      }
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";
    const body = isLogin
      ? { username, password }
      : { username, email, password };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      if (onAuthSuccess) {
        // Pass both token and user data to the parent component
        // The token and user are inside the 'data' property of the response
      onAuthSuccess(data.data.token, data.data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full max-w-2xl h-auto md:h-[500px] rounded-3xl bg-white shadow-2xl border border-white/20 flex flex-col md:flex-row overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-50 p-2 rounded-full"
          aria-label="Close form"
        >
          <X size={24} />
        </button>

        {/* Left Section - Form */}
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-extrabold text-center mb-4 text-gray-900 drop-shadow-sm">
              {isLogin ? "Welcome Back!" : "Create Your Journey"}
            </h2>
            <p className="text-center text-gray-600 mb-6 text-sm">
              {isLogin ? "Login to continue your career path." : "Sign up to begin your personalized roadmap."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full px-10 py-2 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 ${
                      fieldErrors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your username"
                  />
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {fieldErrors.username && (
                  <p className="text-red-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.username}</p>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="email-field"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full px-10 py-2 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 ${
                          fieldErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="you@example.com"
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.email}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: isLogin ? 0.2 : 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full px-10 py-2 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 ${
                      fieldErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.password}</p>
                )}
              </motion.div>

              {error && (
                <p className="text-red-500 text-sm text-center" role="alert" aria-live="assertive">{error}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-rose-500 hover:from-teal-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </motion.button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-700">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <motion.button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFieldErrors({});
                  setError("");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium text-teal-700 hover:text-teal-600 ml-1 transition-colors"
              >
                {isLogin ? "Sign Up" : "Login"}
              </motion.button>
            </p>
          </div>
        </div>

        {/* Right Section - Static SVG */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8 bg-gradient-to-br from-teal-100/50 to-rose-100/50 rounded-r-3xl backdrop-blur-md">
          <svg className="w-full h-full max-w-sm" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
                .compass-line {
                  stroke-dasharray: 200;
                  stroke-dashoffset: 0;
                  animation: dash 5s linear infinite;
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -400;
                  }
                }
              `}
            </style>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#22c55e" strokeWidth="2" />
            <path className="compass-line" d="M100 10 L100 190 M10 100 L190 100" stroke="#22c55e" strokeWidth="2" />
            <path d="M100 20 L120 100 L100 180 L80 100 Z" fill="#22c55e" />
            <circle cx="100" cy="100" r="10" fill="#22c55e" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
