import React from "react";

export function Button({ children, variant = "default", ...props }) {
  const baseStyle = "px-4 py-2 rounded-md border font-medium cursor-pointer transition-colors";
  const variants = {
    default: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
    outline: "border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
