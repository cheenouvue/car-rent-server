import { Router } from "express";
import { createPenalty, deletePenalty, getAllPenalty, getOnePenalty, updatePenalty } from "../controllers/penaltyController.js";
import { authCheckToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/insert', authCheckToken, createPenalty);
router.get('/getAll', authCheckToken, getAllPenalty);
router.get('/selOne/:id', authCheckToken, getOnePenalty);
router.put('/update/:id', authCheckToken, updatePenalty);
router.delete('/delete/:id', authCheckToken, deletePenalty);
// router.get(payment + "/:id", listBy);
// router.put(payment + "/:id", update);
// router.delete(payment + "/:id", remove);

export default router;