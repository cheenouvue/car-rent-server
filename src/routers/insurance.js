import {
  create,
  list,
  listID,
  update,
  remove,
} from "../controllers/insurance.js";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { Router } from "express";
import { insuranceValidation } from "../middleware/validatoins.js";

const router = Router();
const insurance = "/insurance";
const a = 'admin';
const sa = 'superAdmin';

router.get('/selAll', authCheckToken, list);
router.get('/selOne/:id', authCheckToken, listID);
router.post('/insert', authCheckToken, authorizeRole([a, sa]), insuranceValidation,  create);
router.put('/update/:id', authCheckToken, authorizeRole([a, sa]), update);
router.delete('/delete/:id', authCheckToken, authorizeRole([a, sa]), remove);

export default router;
