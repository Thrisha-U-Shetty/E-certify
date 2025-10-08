import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // 🔹 Send login request to backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔹 Store token & user info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("token", data.token);

        // 🔹 Redirect to dashboard
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white/80 backdrop-blur-lg border border-indigo-200 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
