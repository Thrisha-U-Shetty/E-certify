import React from "react";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-lg bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-white">E-Certify</h1>
        <div className="flex gap-6">
          <a href="/login" className="text-gray-300 hover:text-white transition">
            Login
          </a>
          <a href="/register" className="text-gray-300 hover:text-white transition">
            Register
          </a>
          <a href="/logout" className="text-gray-300 hover:text-white transition">
            Logout
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center px-12 py-16">
        {/* Left side - Big Title */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            E-Certify
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-lg">
            A blockchain-based digital certificate verification platform that
            ensures <span className="font-semibold text-white-400">transparency</span>,
            <span className="font-semibold text-white-400"> security</span>, and
            <span className="font-semibold text-white-400"> trust</span>.
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <a
              href="/register"
              className="px-6 py-3 rounded-2xl bg-green-600 text-white font-medium shadow-lg hover:bg-green-700 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 rounded-2xl bg-gray-800 border border-green-500 text-green-400 font-medium shadow-lg hover:bg-gray-700 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* Right side - Illustration / Card */}
        <div className="flex-1 mt-12 md:mt-0 flex justify-center">
          <div className="w-80 h-80 bg-gray-800/70 backdrop-blur-lg border border-green-500 rounded-3xl shadow-2xl flex items-center justify-center">
            <p className="text-center text-xl font-semibold text-green-400 leading-relaxed px-6">
              🔒 Blockchain-Powered Security  
              <span className="block text-gray-300 font-medium mt-2">
                Instant, Tamper-Proof, and Globally Trusted Certificates
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} E-Certify | Built with ❤ by Students
      </footer>
    </div>
  );
}






