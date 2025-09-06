import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from cookies
    let token = req.cookies?.token;

    // 2. If not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId || decoded.id; // support both payload styles
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - invalid or expired token" });
  }
};
