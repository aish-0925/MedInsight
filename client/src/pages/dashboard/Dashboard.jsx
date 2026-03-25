// client/src/pages/dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const res = await axios.get(
          'http://localhost:5001/api/dashboard',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setDashboardData(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {dashboardData && (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to MedInsight - Healthcare Intelligence Platform</p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Patients */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Patients</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {dashboardData.totalPatients}
                    </p>
                  </div>
                  <div className="text-4xl text-blue-200">👥</div>
                </div>
              </div>

              {/* Bed Occupancy */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Bed Occupancy</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {dashboardData.occupancyRate}%
                    </p>
                  </div>
                  <div className="text-4xl text-green-200">🛏️</div>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Critical Alerts</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {dashboardData.criticalAlerts}
                    </p>
                  </div>
                  <div className="text-4xl text-red-200">🚨</div>
                </div>
              </div>

              {/* Avg Satisfaction */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg Satisfaction</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {dashboardData.avgSatisfaction}/5
                    </p>
                  </div>
                  <div className="text-4xl text-yellow-200">⭐</div>
                </div>
              </div>
            </div>

            {/* DEPARTMENT OCCUPANCY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Department Occupancy</h2>
                <div className="space-y-4">
                  {dashboardData.departmentStats.map((dept, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        <span className="text-sm font-medium text-gray-700">{dept.occupancy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition"
                          style={{ width: `${dept.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INVENTORY STATUS */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Inventory Status</h2>
                <div className="space-y-2">
                  {dashboardData.inventoryStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'critical' ? 'bg-red-100 text-red-600' :
                        item.status === 'low' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT ALERTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
                <div className="space-y-3">
                  {dashboardData.recentAlerts.length > 0 ? (
                    dashboardData.recentAlerts.map((alert, idx) => (
                      <div key={idx} className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent alerts</p>
                  )}
                </div>
              </div>

              {/* RECENT FEEDBACK */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
                <div className="space-y-3">
                  {dashboardData.feedback.length > 0 ? (
                    dashboardData.feedback.map((fb, idx) => (
                      <div key={idx} className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{fb.review}</p>
                            <p className="text-xs text-gray-500 mt-1">Rating: {fb.rating}/5</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            fb.sentiment === 'positive' ? 'bg-green-100 text-green-600' :
                            fb.sentiment === 'negative' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {fb.sentiment}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent feedback</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;