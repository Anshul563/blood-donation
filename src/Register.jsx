// src/Register.jsx
import React, { useState } from "react";
// Removed useNavigate as Navbar will handle modal closing/redirection logic
import { Link } from "react-router-dom"; // Still use Link for "Login here"
import { useAuth } from "./context/AuthContext";
import MessageModal from "./components/MessageModal"; // Assuming path is correct

// Register component receives onAuthSuccess and onBackToLogin props
export default function Register({ onAuthSuccess, onBackToLogin }) {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setModalMessage("");

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setError(""); // Clear any previous errors
      await register(email, password);
      setModalMessage("Registration successful!");
      setShowModal(true);
      
      // Clear form
      setEmail("");
      setPassword("");

      // Notify parent component
      if (onAuthSuccess) {
        setTimeout(() => {
          onAuthSuccess();
        }, 1500); // Give time for success message to show
      }
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Failed to create an account.";
      
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please login instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters long.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = "An error occurred during registration. Please try again.";
      }
      
      setError(errorMessage);
      setModalMessage(errorMessage);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setError("");
  };

  return (
    <div className="bg-white p-2 rounded-lg w-full"> {/* Adjusted padding/width for modal */}
      <form onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#df080f]">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              error && error.includes("email") ? "border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password (min 6 characters)"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              error && error.includes("password") ? "border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-700 transition duration-300"
        >
          Register
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button" // Important: set type="button" to prevent form submission
            onClick={onBackToLogin}
            className="text-blue-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
      <MessageModal message={modalMessage} onClose={closeModal} isVisible={showModal} />
    </div>
  );
}