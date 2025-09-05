import React from "react";
import { Button } from "./ui/button";

export default function UserNavbar({ username, onLogout }) {
  return (
    <div className="flex justify-between items-center bg-white/70 backdrop-blur-lg p-4 shadow sticky top-0 z-50">
      {/* Left: Welcome */}
      <h1 className="font-bold text-lg text-indigo-700">Welcome, {username}</h1>

      {/* Right: Logout */}
      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}