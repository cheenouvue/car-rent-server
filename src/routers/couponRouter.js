import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import {
  addCouponValidation,
  updateCouponValidation,
} from "../middleware/validatoins.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getOneCoupon,
  getUerCoupons,
  updateCoupon,
  updateStatuActive,
  updateStatuExpired,
  updateStatuInactive,
  useCoupon,
  userdeleteCoupon,
} from "../controllers/couponController.js";

const router = Router();
const a = "admin";
const sa = "superAdmin";

router.post("/insertCoupon", authCheckToken, addCoupon);
router.get("/selAllCoupons", authCheckToken, getAllCoupons);
router.get("/selOneCoupon/:id", authCheckToken, getOneCoupon);
router.put("/updateStatuActive/:id", authCheckToken, authorizeRole([a, sa]), updateStatuActive
);
router.put("/updateStatuInactive/:id", authCheckToken, updateStatuInactive);
router.put("/updateStatuExpired/:id", authCheckToken, authorizeRole([a, sa]),
  updateStatuExpired
);
router.put(
  "/updateCoupon/:id",
  authCheckToken,
  updateCoupon
);
router.delete(
  "/deleteCoupon/:id",
  authCheckToken,
  authorizeRole([a, sa]),
  deleteCoupon
);
//New Add
router.get("/useCoupon", authCheckToken, useCoupon);
router.get("/selUserCoupons", authCheckToken, getUerCoupons);
router.delete("/userdeleteCoupon", authCheckToken, userdeleteCoupon);

export default router;
