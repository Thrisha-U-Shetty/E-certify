import React, { useState, useRef, useEffect } from "react";

// Main Dropdown Menu wrapper
export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

// Trigger button (e.g. avatar, username button)
export function DropdownMenuTrigger({ asChild, children }) {
  return React.cloneElement(children, {
    "data-dropdown-trigger": true,
  });
}

// Dropdown Content
export function DropdownMenuContent({ children, className = "" }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const trigger = document.querySelector("[data-dropdown-trigger]");
    triggerRef.current = trigger;

    const toggleMenu = () => setOpen((prev) => !prev);
    trigger.addEventListener("click", toggleMenu);

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      trigger.removeEventListener("click", toggleMenu);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute right-0 mt-2 rounded-lg shadow-lg border bg-white ${className}`}
    >
      {children}
    </div>
  );
}

// Menu Item
export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 text-gray-700 hover:bg-indigo-100 cursor-pointer rounded-md"
    >
      {children}
    </div>
  );
}
