import React from "react";
import { Button } from "../components/ui/button";
import UserNavbar from "../components/UserNavbar";

export default function SendRequest({ username, onLogout }) {
  return (
    <div className="min-h-screen bg-indigo-50">
      <UserNavbar username={username} onLogout={onLogout} />

      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Certificate Request Form</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Request sent to admin!");
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition col-span-1 md:col-span-2"
            required
          />

          {/* Course Name */}
          <input
            type="text"
            placeholder="Course Name"
            className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition col-span-1 md:col-span-2"
            required
          />

          {/* Company/Institute */}
          <input
            type="text"
            placeholder="Company/Institute Offering the Course"
            className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition col-span-1 md:col-span-2"
            required
          />

          {/* Start Date */}
          <input
            type="date"
            className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition"
            required
          />

          {/* Completion Date */}
          <input
            type="date"
            className="border p-3 rounded-lg border-indigo-300 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 transition"
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-indigo-600 text-white hover:bg-indigo-700 col-span-1 md:col-span-2 mt-2"
          >
            Send Request
          </Button>
        </form>
      </div>
    </div>
  );
}
