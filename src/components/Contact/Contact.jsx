import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',    // Changed from 'name'
    user_email: '',   // Changed from 'email'
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await emailjs.sendForm(
        'service_5nmk9dk', // Replace with your service ID
        'template_b3i2ysp', // Replace with your template ID
        form.current,
        'W1NTZLqaRXojja0CN' // Replace with your public key
      );

      console.log('Email sent successfully:', result.text);
      setIsSubmitted(true);
      setFormData({
        user_name: '',    // Changed from 'name'
        user_email: '',   // Changed from 'email'
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Email error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Phone",
      content: "+91 98765 43210",
      link: "tel:+919876543210"
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email",
      content: "contact@blooddonation.com",
      link: "mailto:contact@blooddonation.com"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Location",
      content: "123 Blood Bank Street, City, State 123456",
      link: "https://maps.google.com"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="min-h-screen mt-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        background: `
          radial-gradient(circle at 100% 0%, rgba(223, 8, 15, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 0% 100%, rgba(223, 8, 15, 0.05) 0%, transparent 25%)
        `
      }}
    >
      {/* Header Section */}
      <motion.div 
        className="text-center mb-16"
        variants={itemVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#df080f] mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about blood donation? We're here to help. Reach out to us through any of the following channels.
        </p>
      </motion.div>

      {/* Contact Info Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16"
        variants={containerVariants}
      >
        {contactInfo.map((info, index) => (
          <motion.a
            key={index}
            href={info.link}
            target={info.title === "Location" ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-[#df080f] mb-4">{info.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
            <p className="text-gray-600">{info.content}</p>
          </motion.a>
        ))}
      </motion.div>

      {/* Contact Form Section */}
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}     // Changed from formData.name
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}    // Changed from formData.email
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject" // Important: match with EmailJS template
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message" // Important: match with EmailJS template
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#df080f] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>

          {/* Success Message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg"
            >
              Thank you for your message! We'll get back to you soon.
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div 
        className="mt-16 text-center"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
        <div className="flex justify-center space-x-6">
          {[
            { icon: <FaFacebook />, link: "https://facebook.com" },
            { icon: <FaTwitter />, link: "https://twitter.com" },
            { icon: <FaInstagram />, link: "https://instagram.com" }
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-[#df080f] transition-colors duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}