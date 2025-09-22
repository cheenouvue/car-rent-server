import { create, list, listBy, update, remove,listPrice, updateCarStatu, updateInsurance, updateCarType, updatePrice, listGear } from "../controllers/cars.js";
import { Router } from "express";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { carStatuValidation, carValidation, updateCarValidation, updatePriceValidation } from "../middleware/validatoins.js";

const router = Router();
const car = "/car";
const a = 'admin';
const sa = 'superAdmin';

router.post('/insert', authCheckToken, authorizeRole([sa]), carValidation,  create);
router.get('/selAll',list);
router.get('/selOne/:id', listBy);
router.get(car + "price", listPrice);
router.put('/update/:id', authCheckToken,authorizeRole([sa]), updateCarValidation, update);
router.put('/updateStatu/:id/statu/:statu', authCheckToken, authorizeRole([a, sa]), carStatuValidation, updateCarStatu);
router.put('/update/:id/insurance/:insurance_id', authCheckToken, authorizeRole([a, sa]), updateInsurance);
router.put('/update/:id/carType/:car_type_id', authCheckToken, authorizeRole([a, sa]), updateCarType);
router.put('/update_price/:id', authCheckToken, authorizeRole([sa]), updatePriceValidation, updatePrice);
router.delete('/delete/:id', authCheckToken, authorizeRole([a, sa]), remove);

//New add 
router.get(car + "gear", listGear);
//My code 

export default router;
