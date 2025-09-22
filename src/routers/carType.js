import {
  create,
  list,
  listID,
  update,
  remove,
} from "../controllers/carType.js";
import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { carTypeValidation } from "../middleware/validatoins.js";

const router = Router();
// const carType = "/carType";
const a ='admin';
const sa = 'superAdmin'

router.get('/selAll', list);
router.get('/selOne/:id', listID);
router.post('/insert', authCheckToken, authorizeRole([a, sa]), carTypeValidation, create);
router.put('/update/:id', authCheckToken, authorizeRole([a, sa]), carTypeValidation, update);
router.delete('/delete/:id', authCheckToken, authorizeRole([a, sa]), remove);

export default router;