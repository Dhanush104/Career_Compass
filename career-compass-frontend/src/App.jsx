import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Add components back step by step
import LandingPage from './components/LandingPage.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  // Simple authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      try {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleAuthSuccess = (token, userData) => {
    localStorage.setItem('token', token);
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
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          },
        }}
      />
      
      {/* Debug info */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}
      </div>
      
      {/* Test Dashboard step by step */}
      {isLoggedIn ? (
        <Dashboard 
          onLogout={handleLogout} 
          user={user}
          onUserUpdate={(updatedUserData) => {
            setUser(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
          }} 
        />
      ) : (
        <LandingPage onLoginClick={() => setShowAuth(true)} />
      )}

      {/* Add AuthForm modal */}
      {showAuth && (
        <AuthForm
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

export default App;