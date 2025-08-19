import React from "react";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex flex-col">
  {/* <h1 className="text-3xl font-bold text-red-600">DEBUG: Tailwind Works Here</h1> */}
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-lg bg-white/70 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-indigo-600">E-Certify</h1>
        <div className="flex gap-6">
          <a href="/login" className="text-gray-700 hover:text-indigo-600 transition">
            Login
          </a>
          <a href="/register" className="text-gray-700 hover:text-indigo-600 transition">
            Register
          </a>
          <a href="/logout" className="text-gray-700 hover:text-indigo-600 transition">
            Logout
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center px-12 py-16">
        {/* Left side - Big Title */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 drop-shadow-lg">
            E-Certify
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-lg">
            A blockchain-based digital certificate verification platform that
            ensures <span className="font-semibold text-indigo-600">transparency</span>,
            <span className="font-semibold text-indigo-600"> security</span>, and
            <span className="font-semibold text-indigo-600"> trust</span>.
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <a
              href="/register"
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-lg border border-indigo-400 text-indigo-700 font-medium shadow-lg hover:bg-indigo-100 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* Right side - Illustration / Card */}
        <div className="flex-1 mt-12 md:mt-0 flex justify-center">
          <div className="w-80 h-80 bg-white/60 backdrop-blur-lg border border-indigo-200 rounded-3xl shadow-xl flex items-center justify-center">
            <p className="text-center text-xl font-medium text-gray-600 px-6">
              Secure. Verified. Digital.  
              <br /> Certificates you can trust. 🔒
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} E-Certify | Built with ❤️ by Students
      </footer>
    </div>
  );
}
