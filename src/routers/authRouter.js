import { Router } from "express";
import { registerValidation, loginValidation } from "../middleware/validatoins.js";
import { register, login, logout, loginAdmin, role } from "../controllers/authController.js";
import { authCheckToken, refreshAccessToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/loginAdmin', loginValidation, loginAdmin);
router.post('/logout', logout);
router.post('/refreshToken', refreshAccessToken);
router.get('/role', authCheckToken, role);

export default router;