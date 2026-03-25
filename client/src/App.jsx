// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import PatientManagement from "./pages/patients/PatientManagement";
import Appointments from "./pages/appointments/Appointments";
import Inventory from "./pages/inventory/Inventory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/patients" element={<ProtectedRoute element={<PatientManagement />} />} />
        <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
        <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;