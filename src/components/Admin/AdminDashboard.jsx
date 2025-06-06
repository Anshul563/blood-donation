import React, { useState, useEffect } from 'react';
import { db, ADMIN_EMAILS } from '../../firebase';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// At the top of the file with other imports
import Logo from '../Navbar/logo.png'; // Adjust path based on your logo location

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            // Change navigation to home page ('/')
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
            setError('Failed to logout');
        }
    };

    useEffect(() => {
        if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
            console.log('Not authorized, redirecting to home');
            navigate('/');
            return;
        }
        console.log('Admin authenticated, fetching appointments');
        fetchAppointments();
    }, [currentUser, navigate]);

    const fetchAppointments = async () => {
        try {
            const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const appointmentList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                let formattedDate;

                try {
                    if (data.appointmentDate?.toDate) {
                        // Handle Firestore Timestamp
                        formattedDate = data.appointmentDate.toDate().toLocaleDateString();
                    } else if (data.appointmentDate) {
                        // Handle string or date object
                        formattedDate = new Date(data.appointmentDate).toLocaleDateString();
                    } else {
                        formattedDate = 'No date available';
                    }
                } catch (err) {
                    console.error('Date parsing error:', err);
                    formattedDate = 'Invalid date';
                }

                return {
                    id: doc.id,
                    ...data,
                    appointmentDate: formattedDate,
                    createdAt: data.createdAt?.toDate() || new Date()
                };
            });

            setAppointments(appointmentList);
            setError('');
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appointmentId, newStatus) => {
        try {
            await updateDoc(doc(db, "appointments", appointmentId), {
                status: newStatus
            });
            // Refresh appointments after update
            fetchAppointments();
        } catch (error) {
            console.error("Error updating status:", error);
            setError('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Admin Navbar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-4"
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={Logo}
                                alt="Logo"
                                className="h-12 w-auto cursor-pointer"
                                onClick={() => navigate('/admin-dashboard')}
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-[#df080f]">Admin Dashboard</span>
                                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {currentUser?.email}
                                </span>
                            </div>
                        </motion.div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                                <span>Total Appointments: {appointments.length}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="px-6 py-2 bg-[#df080f] text-white rounded-full hover:bg-red-600 
                  transition-colors duration-200 text-sm font-medium shadow-md"
                            >
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DOB
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Blood Group
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mobile
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.appointmentDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.birthDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.bloodGroup}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.mobile}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => updateStatus(appointment.id, 'approved')}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(appointment.id, 'rejected')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}