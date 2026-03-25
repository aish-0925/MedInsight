import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/login-bg.png";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "nurse",
    department: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        form
      );

      // ✅ SUCCESS MESSAGE
      setSuccess(res.data.message || "Registration successful!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 relative">
        <img src={loginImage} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center text-white text-center p-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">Join MedInsight</h1>
            <p>Create your account to continue</p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-2xl font-bold text-center mb-6">
            <span className="text-blue-600">Med</span>
            <span className="text-green-500">Insight</span>
          </h2>

          {/* ❌ ERROR MESSAGE */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* ✅ SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          <select
              name="department"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
          >
          <option value="">Select Department</option>
          <option value="ICU">ICU</option>
          <option value="Emergency">Emergency</option>
          <option value="Cardiology">Cardiology</option>
          </select>
            <select
              name="role"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
              <option value="analyst">Analyst</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;