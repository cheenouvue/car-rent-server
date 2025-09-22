import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { addPromotionValidation, updatePromotionValidation } from "../middleware/validatoins.js";
import { addPromotion, deletePromotion, getAllPromotions, getOnePromotion, updatePromotion, updateStatus } from "../controllers/promotionController.js";

const router = Router();
const a = 'admin';
const sa = 'superAdmin'

router.post('/insertPromotion', authCheckToken, authorizeRole([a, sa]), addPromotionValidation, addPromotion);
router.get('/selAllPromotions', authCheckToken, getAllPromotions);
router.get('/selOnePromotion/:id', authCheckToken, getOnePromotion);
router.put('/update/:id', authCheckToken, authorizeRole([a, sa]), updatePromotionValidation, updatePromotion);
router.put('/updateStatus/:id/status/:status', authCheckToken, authorizeRole([a, sa]), updateStatus);
router.delete('/deletePromotion/:id', authCheckToken, authorizeRole([a, sa]), deletePromotion);


export default router;