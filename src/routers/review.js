import { Router } from "express";
import {
  create,
  list,
  listBy,
  listByRentID,
  remove,
  update,
} from "../controllers/review.js";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
const router = Router();
const review = "/review";
const a = "admin";
const sa = "superAdmin";

router.post("/insert", authCheckToken, create);
router.get("/selAll", authCheckToken, list);
router.get("/selOne/:id", authCheckToken, listBy);
router.put("/update/:id", authCheckToken, authorizeRole([a, sa]), update);
router.delete("/delete/:id", authCheckToken, authorizeRole([a, sa]), remove);
//new
router.get("/listByRentID/:id", authCheckToken, listByRentID);

export default router;
