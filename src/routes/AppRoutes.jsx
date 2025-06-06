import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../components/Home/Home';
import MyAppointment from '../components/My Appointment/MyAppointment';
import Appointment from '../components/Appointment/Appointment';
import PrivateRoute from '../components/PrivateRoute';
import About from '../components/About/About';
import Contact from '../components/Contact/Contact';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/my-appointment" element={
        <PrivateRoute>
          <MyAppointment />
        </PrivateRoute>
      } />
      <Route path="/appointment" element={
        <PrivateRoute>
          <Appointment />
        </PrivateRoute>
      } />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}