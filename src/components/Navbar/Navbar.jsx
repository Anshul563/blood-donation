import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './logo.png';
import { HiMenu, HiX } from 'react-icons/hi';
import Login from '../../Login';
import Register from '../../Register';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Function to close both modals
  const closeAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Function to switch to Login modal
  const handleShowLoginModal = () => {
    closeAuthModals(); // Close any other open modals
    setShowLoginModal(true);
    setIsOpen(false); // Close mobile menu if open
  };

  // Function to switch to Register modal
  const handleShowRegisterModal = () => {
    closeAuthModals(); // Close any other open modals
    setShowRegisterModal(true);
    setIsOpen(false); // Close mobile menu if open
  };

  // Function to handle successful login/register *from the modal*
  // This will close the modal upon success
  const handleAuthSuccess = () => {
    closeAuthModals();
    // No full page navigation needed here, as the AuthContext will update
    // and the Navbar will re-render automatically to show "Logout"
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      // Close mobile menu if open
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/my-appointment', label: 'My Appointment' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${
          scrolled ? 'max-w-7xl' : 'max-w-[90%] md:max-w-[80%]'
        }`}>
          <div className={`relative ${
            scrolled 
              ? 'bg-white shadow-lg'
              : 'bg-white/80 backdrop-blur-md shadow-lg border-2 border-[#df080f]'
          } rounded-full px-4 py-2 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-20 md:w-24"
              >
                <Link to="/">
                  <img src={Logo} alt="Logo" className="w-full" />
                </Link>
              </motion.div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-[#df080f] bg-red-50'
                        : 'text-gray-700 hover:text-[#df080f] hover:bg-red-50/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Auth Button */}
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#df080f] border-t-transparent rounded-full"
                  />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentUser ? handleLogout : handleShowLoginModal}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      currentUser
                        ? 'bg-red-100 text-[#df080f] hover:bg-red-200'
                        : 'bg-[#df080f] text-white hover:bg-red-700'
                    }`}
                  >
                    {currentUser ? 'Logout' : 'Login'}
                  </motion.button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
              >
                {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute left-0 right-0 mt-2 px-4"
              >
                <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-6 space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          location.pathname === item.path
                            ? 'text-[#df080f] bg-red-50'
                            : 'text-gray-700 hover:text-[#df080f] hover:bg-red-50/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {!loading && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={currentUser ? handleLogout : handleShowLoginModal}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentUser
                            ? 'bg-red-100 text-[#df080f] hover:bg-red-200'
                            : 'bg-[#df080f] text-white hover:bg-red-700'
                        }`}
                      >
                        {currentUser ? 'Logout' : 'Login'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Auth Modals */}
      <AnimatePresence>
        {(showLoginModal || showRegisterModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-md relative"
            >
              <button
                onClick={closeAuthModals}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
              {showLoginModal ? (
                <Login
                  onAuthSuccess={handleAuthSuccess}
                  onSwitchToRegister={handleShowRegisterModal}
                />
              ) : (
                <Register
                  onAuthSuccess={handleAuthSuccess}
                  onBackToLogin={handleShowLoginModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}