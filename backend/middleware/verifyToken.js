import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // 1. Get token from cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. If not in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3. If still no token
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });
    }

    // 4. Extra safeguard: check if token looks like a JWT (three parts)
    if (token.split(".").length !== 3) {
      console.error("Malformed token received:", token);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - malformed token" });
    }

    // 5. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });
    }

    // 6. Attach user id to request
    req.userId = decoded.userId || decoded.id; // support both payload styles

    next();
  } catch (error) {
    console.error("Error in verifyToken:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid or expired token",
    });
  }
};
