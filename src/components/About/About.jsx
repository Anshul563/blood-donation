import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Add this import at the top
import MedicalImage from '../../assets/blood.png'; // Add your image to assets folder

const stats = [
  { number: '10K+', text: 'Donors', icon: <FaUsers className="w-full h-full" /> },
  { number: '15K+', text: 'Lives Saved', icon: <FaHeart className="w-full h-full" /> },
  { number: '50+', text: 'Blood Banks', icon: <FaHandHoldingHeart className="w-full h-full" /> },
  { number: '24/7', text: 'Support', icon: <FaCheckCircle className="w-full h-full" /> },
];

// Add this array at the top of your file with other constants
const teamMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Medical Director',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    bio: 'Leading our medical operations with over 15 years of experience in transfusion medicine.'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Chief Hematologist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    bio: 'Specialist in blood disorders and transfusion protocols with international research experience.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Donor Relations Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Dedicated to creating positive experiences for our donors and maintaining community relationships.'
  },
  {
    name: 'James Wilson',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?auto=format&fit=crop&q=80&w=300',
    bio: 'Ensures smooth running of our facilities and coordinates with blood banks across the region.'
  }
];

export default function About() {
  const navigate = useNavigate(); // Add this inside your component
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Add this handler function
  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6"
          >
            About Us
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            Connecting donors with those in need, one drop at a time.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section with centered icons */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mx-auto text-[#df080f] mb-4 flex items-center justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section with local image */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Our Mission
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeIn}
              className="space-y-6"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to bridge the gap between blood donors and recipients, 
                making the process of blood donation more accessible and efficient. 
                We believe that everyone should have access to safe blood when they need it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Through our platform, we aim to create a community of regular donors 
                and raise awareness about the importance of blood donation.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="rounded-lg overflow-hidden shadow-xl h-[400px]"
            >
              <img 
                src={MedicalImage} 
                alt="Medical Facility" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/800x600/df080f/ffffff?text=Medical+Facility';
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-4 text-gray-900"
          >
            Our Team
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            Meet our dedicated team of professionals committed to making blood donation accessible and efficient.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=df080f&color=fff`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#df080f] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0  transition-opacity duration-300 flex items-end justify-center p-6"
                >
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Join Our Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-12 text-gray-900"
          >
            Join Our Mission
          </motion.h2>
          <motion.div 
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-lg text-gray-700 mb-8">
              Whether you're a donor or someone in need, your journey with us begins here. 
              Together, we can make a difference in countless lives.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookAppointment}
              className="bg-[#df080f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
            >
              Book Appointment
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}