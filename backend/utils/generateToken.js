import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isLoggedIn: true,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};