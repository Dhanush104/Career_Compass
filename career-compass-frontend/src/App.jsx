import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import Preloader from './components/Preloader.jsx';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authentication token and validate it
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      try {
        // If we have a stored user, parse it
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsLoggedIn(true);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      // No token, finish loading
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    
    // Store user data if available
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    setIsLoggedIn(true);
    setShowAuth(false);
    toast.success('Successfully logged in!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('careerPaths');
    setUser(null);
    setIsLoggedIn(false);
    toast.success('Successfully logged out');
  };

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      {loading ? (
        <Preloader />
      ) : (
        <div className="animate-fade-in">
          {/* Render content based on login state */}
          {isLoggedIn ? (
            <Dashboard onLogout={handleLogout} user={user} />
          ) : (
            <LandingPage onLoginClick={() => setShowAuth(true)} />
          )}

          {/* Conditionally render the AuthForm as a pop-up modal */}
          {showAuth && (
            <AuthForm
              onAuthSuccess={handleAuthSuccess}
              onClose={() => setShowAuth(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
