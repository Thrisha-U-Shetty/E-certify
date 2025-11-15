import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  // 🔹 Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

   const showToast = (message, type = "success") => {
    toast.custom((t) => (
      <div
        className={`w-full sm:w-auto max-w-sm transform transition-all duration-200 ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div
          className={`${
            type === "success"
              ? "bg-gradient-to-r from-green-700/90 via-green-600/90 to-green-500/90"
              : "bg-gradient-to-r from-red-600 via-red-500 to-red-600"
          } text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between relative overflow-hidden`}
        >
          {type === "success" && (
            <svg
              className="w-5 h-5 text-white mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="font-medium flex-1">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 text-white/80 hover:text-white font-bold text-base"
          >
            ✕
          </button>
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-white/80 rounded-b"
            style={{ width: "100%", animation: "shrink 5s linear forwards" }}
          ></div>
          <style>{`
            @keyframes shrink {
              from { transform: scaleX(1); transform-origin: left; }
              to { transform: scaleX(0); transform-origin: left; }
            }
          `}</style>
        </div>
      </div>
    ));
  };

  // 🔹 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token & user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", data.user.isLoggedIn);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role);

         showToast("Login successful!", "success");

        // 🔹 Navigate after token/user is saved
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        }, 50); // slight delay to ensure state/storage consistency
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center mb-6 justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-green-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 font-semibold mb-4 text-center">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
