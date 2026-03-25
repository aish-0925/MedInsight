// client/src/pages/appointments/Appointments.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    time: '',
    status: 'scheduled'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5001/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5001/api/appointments',
        {
          ...formData,
          time: new Date(formData.time)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        patient: '',
        doctor: '',
        department: '',
        time: '',
        status: 'scheduled'
      });
      setShowForm(false);
      fetchAppointments();
    } catch (err) {
      console.error('Error booking appointment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Book Appointment'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Book New Appointment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="patient"
                placeholder="Patient ID or Name"
                value={formData.patient}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="text"
                name="doctor"
                placeholder="Doctor ID or Name"
                value={formData.doctor}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="datetime-local"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <button
                type="submit"
                className="col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Book Appointment
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Patient</th>
                  <th className="p-4 text-left">Doctor</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{apt.patient}</td>
                    <td className="p-4">{apt.doctor}</td>
                    <td className="p-4">{apt.department}</td>
                    <td className="p-4">{new Date(apt.time).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;