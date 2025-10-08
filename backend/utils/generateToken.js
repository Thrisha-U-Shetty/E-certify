// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  if (!user) throw new Error("No user provided for token generation");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

  const payload = {
    userId: user._id, // ✅ Always use _id from MongoDB
    email: user.email,
    name: user.name,  // ✅ Keep it consistent with your User schema
  };

  // ✅ Token valid for 7 days
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};
