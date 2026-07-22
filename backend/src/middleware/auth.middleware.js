import jwt from "jsonwebtoken";
import httpStatus from "http-status";

const JWT_SECRET = process.env.JWT_SECRET || "MEETSPHERE_JWT_SECRET_2026";

export const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "No token provided, authorization denied" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains id and username
        next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Token is not valid" });
    }
};
