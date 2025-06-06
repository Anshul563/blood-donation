import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    if (!currentUser?.uid) return;

    try {
      setLoading(true);
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const appointmentList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Safely handle the appointmentDate
        let formattedDate;
        try {
          if (data.appointmentDate?.toDate) {
            // Handle Firestore Timestamp
            formattedDate = data.appointmentDate.toDate().toLocaleDateString();
          } else if (data.appointmentDate) {
            // Handle string date
            formattedDate = new Date(data.appointmentDate).toLocaleDateString();
          } else {
            formattedDate = 'Date not available';
          }
        } catch (err) {
          console.error('Date parsing error:', err);
          formattedDate = 'Invalid date';
        }

        return {
          id: doc.id,
          ...data,
          appointmentDate: formattedDate,
          createdAt: data.createdAt?.toDate() || new Date(),
          // Make sure all required fields have fallback values
          name: data.name || 'N/A',
          bloodGroup: data.bloodGroup || 'N/A',
          mobile: data.mobile || 'N/A',
          district: data.district || 'N/A',
          state: data.state || 'N/A',
          status: data.status || 'pending'
        };
      });

      console.log('Fetched appointments:', appointmentList); // Debug log
      setAppointments(appointmentList);
      setError('');
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      if (!currentUser) {
        console.log('No current user, redirecting to login'); // Debug log
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('Current user:', currentUser.uid); // Debug log
      try {
        await fetchAppointments();
      } catch (err) {
        console.error('Error in loadAppointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [currentUser, navigate]);

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "appointments", appointmentId));
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#df080f]">My Appointments</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} 
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Appointment Date: {appointment.appointmentDate}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      'bg-green-200 text-green-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{appointment.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Group</p>
                    <p className="font-medium">{appointment.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mobile</p>
                    <p className="font-medium">{appointment.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{appointment.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="font-medium">{appointment.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{appointment.add1},{appointment.district}, {appointment.state} - {appointment.pincode}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}