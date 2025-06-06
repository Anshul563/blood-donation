import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaHandHoldingHeart, FaTint } from 'react-icons/fa';

import saveLivesIcon from '../../assets/save-lives.png';
import healthBenefitsIcon from '../../assets/health-benefits.png';
import healthCheckupIcon from '../../assets/health-checkup.png';

// Card data separated for better maintainability
const donationBenefits = [
  {
    title: 'Save Lives',
    description: 'One donation can save up to three lives.',
    img: saveLivesIcon
  },
  {
    title: 'Health Benefits',
    description: 'Reduce risk of heart disease and cancer.',
    img: healthBenefitsIcon
  },
  {
    title: 'Regular Check-up',
    description: 'Free mini health screening with every donation.',
    img: healthCheckupIcon
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleBookAppointment = () => {
    if (currentUser) {
      navigate('/appointment');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Animated background elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </motion.div>

        {/* Floating blood drops */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <FaTint className="w-4 h-4" />
          </motion.div>
        ))}

        {/* Animated heartbeat line */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.path
            d="M0 100 Q 250 50 500 100 T 1000 100"
            stroke="rgba(239, 68, 68, 0.2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
        
        {/* Main content */}
        <div className="relative pt-32 px-4 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center text-white"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold mb-6"
            >
              Every{" "}
              <motion.span
                animate={{ 
                  y: [-3, 3, -3],
                  filter: [
                    "drop-shadow(0 0 0.5rem rgba(220, 38, 38, 0.3))",
                    "drop-shadow(0 0 1rem rgba(220, 38, 38, 0.5))",
                    "drop-shadow(0 0 0.5rem rgba(220, 38, 38, 0.3))"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-red-600 inline-block relative"
              >
                Drop
              </motion.span>{" "}
              Counts
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            >
              Your blood donation can save up to three lives. Join us in making a difference.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleBookAppointment}
              className="bg-[#df080f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Book Appointment
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative icons */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 text-red-500 opacity-30"
        >
          <FaHeartbeat className="w-16 h-16 filter drop-shadow-lg" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 text-red-500 opacity-30"
        >
          <FaHandHoldingHeart className="w-16 h-16 filter drop-shadow-lg" />
        </motion.div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#df080f]">
            Why Donate Blood?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationBenefits.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#df080f]">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-8 text-gray-700">
            Join thousands of donors who are saving lives every day.
          </p>
          <button
            onClick={handleBookAppointment}
            className="bg-[#df080f] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Schedule Your Donation
          </button>
        </div>
      </section>
    </div>
  );
}