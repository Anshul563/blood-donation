// src/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import MessageModal from "./components/MessageModal";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, isAdminEmail } from "./firebase";

// Login component receives onAuthSuccess and onSwitchToRegister props
export default function Login({ onAuthSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Add new state for specific error types
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setModalMessage("");

    try {
      console.log('Attempting login as:', isAdmin ? 'admin' : 'user');
      const { userCredential, isAdmin: isAdminUser } = await login(email, password);

      setLoginSuccess(true);

      // Handle admin login
      if (isAdmin) {
        if (isAdminUser) {
          console.log('Admin login successful');
          setTimeout(() => {
            navigate('/admin-dashboard');
          }, 1500);
        } else {
          setError('Not authorized as admin');
          setLoginSuccess(false);
          return;
        }
      } else {
        // Regular user login
        console.log('User login successful');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginSuccess(false);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setModalMessage('Password reset email sent. Please check your inbox.');
      setShowModal(true);
    } catch (error) {
      setError('Failed to send password reset email');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setError("");
  };

  return (
    <div className="bg-white p-2 rounded-lg w-full relative overflow-hidden">
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-green-500 z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-full p-4"
            >
              <motion.svg
                className="w-16 h-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute mt-24 text-white text-xl font-semibold"
            >
              Login Successful!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className={isSuccess ? 'invisible' : ''}>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#df080f]">
          {isAdmin ? 'Admin Login' : 'Login'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={`shadow appearance-none border ${
              emailError ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(""); // Clear error when user types
            }}
            required
          />
          {emailError && (
            <p className="text-red-500 text-xs italic mt-1">{emailError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={`shadow appearance-none border ${
              passwordError ? 'border-red-500' : ''
            } rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(""); // Clear error when user types
            }}
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
          )}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Login as Admin</span>
            </label>
          </div>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {showForgotPassword && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Enter your email to receive a password reset link
            </p>
            <button
              onClick={handleForgotPassword}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
            >
              Send Reset Link
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-700 transition duration-300"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button" // Important: set type="button" to prevent form submission
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline"
          >
            Register Here
          </button>
        </p>
      </form>

      <MessageModal
        message={modalMessage}
        onClose={closeModal}
        isVisible={showModal && !isSuccess}
      />
    </div>
  );
}