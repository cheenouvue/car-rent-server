import { Router } from "express";
import {
  create,
  list,
  listBy,
  update,
  remove,
  updateStatuRental,
  updateReceipt,
  // updateStatuPayFullRental,
  getOneByUserId,
  getUserRentlist,
  payFullRental,
  listDate,
  rentalCheck,
  userDelete,
} from "../controllers/rental.js";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { rentalValidation } from "../middleware/validatoins.js";

const router = Router();
const rental = "/rental";
const a = "admin";
const sa = "superAdmin";

router.post("/insert", authCheckToken, create);
router.get("/selOneByUser", authCheckToken, getOneByUserId);
router.get("/selAll", list);
router.get("/selOne/:id", listBy);
router.put(rental + "/:id", update);
router.put("/updateStatu/:id/statu/:statu", authCheckToken, updateStatuRental);
// router.put("/updateStatuPayFull/:id", authCheckToken, updateStatuPayFullRental);
router.put("/updateReceipt/:id", authCheckToken, updateReceipt);
router.delete("/delete/:id", remove);
//new
router.get("/getUserRentlist", authCheckToken, getUserRentlist);
router.put("/payFullRental/:id", authCheckToken, payFullRental);
router.get("/rentalDate", listDate);
router.get("/rentalCheck", authCheckToken, rentalCheck);
router.put("/userDelete/:id", authCheckToken, userDelete);
export default router;
