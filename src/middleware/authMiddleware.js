import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../service/tokenService.js';

export const authCheckToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    });
}

//add new accessToken from refreshToken
export const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "did't have refreshToken" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'refreshToken is expire' });
        }
        const newAccessToken = generateAccessToken(decoded.userId, decoded.role);
        res.cookie('accessToken', newAccessToken, { httpOnly: true });
        res.status(200).json({ message: 'refreshToken successfully', newAccessToken });
    });
}

//check roles
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(400).json({ message: "Forbidden: You don't have permission" })
        }
        next();
    }
}