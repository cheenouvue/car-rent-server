import { list, listBy, update, remove, insertRepair } from "../controllers/repair.js";
import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = Router();
const repair = "/repair";
const a = 'admin';
const sa = 'superAdmin';

router.post('/create', authCheckToken, authorizeRole([a, sa]), insertRepair);
router.get('/selAll', authCheckToken, list);
router.get("/selOne/:id", authCheckToken, listBy);
// router.put('/updateRepair/:id', authCheckToken, updateRepair);
router.put("/update/:id", authCheckToken, update);
router.delete('/delete/:id', authCheckToken, remove);

export default router;
