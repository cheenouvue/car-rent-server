import {
  create,
  list,
  listBy,
  update,
  remove,
} from "../controllers/payment.js";
import { Router } from "express";

const router = Router();
const payment = "/payment";

router.post(payment, create);
router.get(payment, list);
router.get(payment + "/:id", listBy);
router.put(payment + "/:id", update);
router.delete(payment + "/:id", remove);

export default router;
