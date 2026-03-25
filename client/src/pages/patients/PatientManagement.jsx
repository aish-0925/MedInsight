// client/src/pages/patients/PatientManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5001/api/patients',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
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
        'http://localhost:5001/api/patients',
        {
          ...formData,
          age: Number(formData.age),
          allergies: formData.allergies.split(',').map(a => a.trim()),
          medicalHistory: formData.medicalHistory.split(',').map(m => m.trim())
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        name: '',
        age: '',
        gender: '',
        contact: '',
        bloodGroup: '',
        allergies: '',
        medicalHistory: ''
      });
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Patient'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border p-3 rounded-lg"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group (e.g., O+)"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
              <input
                type="text"
                name="allergies"
                placeholder="Allergies (comma separated)"
                value={formData.allergies}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
              <textarea
                name="medicalHistory"
                placeholder="Medical History (comma separated)"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="border p-3 rounded-lg col-span-2"
              ></textarea>
              <button
                type="submit"
                className="col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Add Patient
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
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Gender</th>
                  <th className="p-4 text-left">Contact</th>
                  <th className="p-4 text-left">Blood Group</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{patient.name}</td>
                    <td className="p-4">{patient.age}</td>
                    <td className="p-4">{patient.gender}</td>
                    <td className="p-4">{patient.contact}</td>
                    <td className="p-4">{patient.bloodGroup}</td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
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

export default PatientManagement;