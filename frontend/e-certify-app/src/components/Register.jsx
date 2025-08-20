import React from "react";

export  default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-lg bg-white/70 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-indigo-600">E-Certify</h1>
        <div className="flex gap-6">
          <a href="/login" className="text-gray-700 hover:text-indigo-600 transition">Login</a>
          <a href="/register" className="text-gray-700 hover:text-indigo-600 transition">Register</a>
          <a href="/logout" className="text-gray-700 hover:text-indigo-600 transition">Logout</a>
        </div>
      </nav>

      {/* Register Form Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="bg-white/80 backdrop-blur-lg border border-indigo-200 shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create an Account</h2>
          
          <form className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter 8 characters including special characters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
              >
                Register
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} E-Certify | Built with ❤️ by Students
      </footer>
    </div>
  );
}
