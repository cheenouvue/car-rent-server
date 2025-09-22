import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { addStatuValidation, updateIconStatuValidation, updateStatuValidation } from "../middleware/validatoins.js";
import { addStatu, changeIconStatu, deleteStatu, getAllStatus, getOneStatu, updateStatu } from "../controllers/statuController.js";

const router = Router();
const a = 'admin';
const sa = 'superAdmin';

router.post('/insertStatu', authCheckToken, authorizeRole([a, sa]), addStatuValidation, addStatu);
router.get('/selAllStatus', authCheckToken, getAllStatus);
router.get('/selOneStatu/:id', authCheckToken, getOneStatu);
router.delete('/deleteStatu/:id', authCheckToken, authorizeRole([a, sa]), deleteStatu);
router.put('/updateStatu/:id', authCheckToken, authorizeRole([a, sa]), updateStatuValidation, updateStatu);
router.put('/updateIconStatu/:id', authCheckToken, authorizeRole([a, sa]), updateIconStatuValidation, changeIconStatu);

export default router;