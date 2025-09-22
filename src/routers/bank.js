import { create, list, listID, update, remove } from "../controllers/bank.js";
import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { bankValidation } from "../middleware/validatoins.js";

const router = Router();
const bank = "/bank";
const a = 'admin';
const sa = 'superAdmin';

router.get('/selAll', authCheckToken, list);
router.get('/selOne/:id', authCheckToken, listID);
router.post('/insert', authCheckToken, authorizeRole([sa]), bankValidation, create);
router.put('/update/:id', authCheckToken, authorizeRole([sa]), update);
router.delete('/delete/:id', authCheckToken, authorizeRole([sa]), remove);

export default router;
