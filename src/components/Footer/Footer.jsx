import React from 'react'
import Logo from '../Navbar/logo.png'
import { FaTwitter, FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-[#df080f] to-[#8B0000] w-full text-white">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 py-12">
                    {/* Left Section - About */}
                    <div className="space-y-4">
                        <img 
                            src={Logo} 
                            className="w-32 mb-4 hover:opacity-90 transition-opacity" 
                            alt="Blood Donation Logo" 
                        />
                        <p className="text-gray-200 leading-relaxed">
                            Your trusted platform for connecting blood donors and recipients. 
                            Together, we can save lives and make a difference in our community.
                        </p>
                        <div className="flex space-x-4 pt-4">
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <FaFacebook size={20} />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                            >
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Center Section - Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b border-white/10 pb-2">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                                    <span>About Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/appointment" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                                    <span>Book Appointment</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                                    <span>Contact</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section - Contact */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b border-white/10 pb-2">
                            Contact Us
                        </h3>
                        <div className="space-y-3">
                            <a href="tel:+911234567890" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-3">
                                <FaPhone className="text-gray-400" />
                                <span>+91 123 456 7890</span>
                            </a>
                            <a href="mailto:anshulshakya18168@gmail.com" className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center space-x-3">
                                <FaEnvelope className="text-gray-400" />
                                <span>anshulshakya18168@gmail.com</span>
                            </a>
                            <div className="text-gray-200 flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span>Your Location, City, State, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="px-6 py-4 text-center md:flex md:justify-between md:items-center">
                        <p className="text-sm text-gray-300">
                            © {currentYear} Blood Donation. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-300 mt-2 md:mt-0">
                            Made with ❤️ by <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Anshul Shakya</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer