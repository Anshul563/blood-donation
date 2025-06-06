import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import MyAppointment from './components/My Appointment/MyAppointment';
import PrivateRoute from './components/PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/my-appointment" 
        element={
          <PrivateRoute>
            <MyAppointment />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}