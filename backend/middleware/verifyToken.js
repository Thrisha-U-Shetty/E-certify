// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // ✅ 1️⃣ Get token from cookies (if available)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ✅ 2️⃣ If not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 3️⃣ If still no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // ✅ 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 5️⃣ Attach decoded data to request
    req.userId = decoded.userId;   // Consistent with generateToken.js
    req.userEmail = decoded.email;
    req.userName = decoded.name;

    // ✅ 6️⃣ Proceed to next middleware
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
