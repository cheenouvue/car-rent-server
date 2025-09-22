import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { getAllUsers, updateRoleAdmin, updateRoleSuperAdmin, getOneUser, getUserProfile, updateProfile, deleteUser, changePassword, sendOTPEmailController, verifyOTPAndDeleteAccountController, updateProfileById, updateRoleUser, getOneForUser, uploadImage, updateRoleSofer } from "../controllers/userController.js";
import { Router } from "express";
import { profileValidation, passworkValidation } from "../middleware/validatoins.js";

const router = Router();

const a = "admin";
const sa = 'superAdmin';
const sf = 'sofer';

router.get('/selAllUsers', authCheckToken, authorizeRole([a, sa, sf]), getAllUsers);
router.get('/selOneUser/:id', authCheckToken, authorizeRole([a, sa, sf]), getOneUser);
router.get('/selProfile', authCheckToken, getUserProfile);
router.put('/updateRoleUser/:id', authCheckToken, authorizeRole([sa]), updateRoleUser);
router.put('/updateRoleAdmin/:id', authCheckToken, authorizeRole([sa]), updateRoleAdmin);
router.put('/updateRoleSuperAdmin/:id', authCheckToken, authorizeRole([sa]), updateRoleSuperAdmin);
router.put('/updateRoleSofer/:id', authCheckToken, authorizeRole([sa]), updateRoleSofer);
router.put('/updateProfile', authCheckToken, profileValidation, updateProfile);
router.put('/updateProfileById/:id', authCheckToken, authorizeRole([a, sa, sf]), updateProfileById);
router.post('/changePassword', authCheckToken, passworkValidation, changePassword);
router.delete('/deleteUser/:id', authCheckToken, authorizeRole([a, sa]), deleteUser);

//send otp
router.post('/:user_id/send-otp/:email', sendOTPEmailController);

//check otp
router.post('/:user_id/verfy-otp/:otp', verifyOTPAndDeleteAccountController);
//New add 
router.get('/selOneUser',authCheckToken, getOneForUser);
router.post('/uploadImage', uploadImage);

export default router;