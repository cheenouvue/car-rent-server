import { Router } from "express";
import { addEmployee, changePhone, deleteEmployee, getAllEmployees, getOneEmployee, updatedepartment, updatePersonalInfo, updateSalary } from "../controllers/employeeController.js";
import { authCheckToken, authorizeRole } from "../middleware/authMiddleware.js";
import { changePhoneValidation, departmentValidation, employeeValidation, updateSalaryValidation } from "../middleware/validatoins.js";

const router = Router();
const a = 'admin';
const sa = 'superAdmin';

router.post('/insertEmployee', authCheckToken, authorizeRole([sa]), employeeValidation, addEmployee);
router.get('/selAllEmployees', getAllEmployees); //remove tk
router.get('/selOneEmployee/:id', getOneEmployee);//remove tk 
router.put('/updateSalary/:id', authCheckToken, authorizeRole([sa]), updateSalaryValidation, updateSalary);
router.put('/changePhone/:id', authCheckToken, authorizeRole([a, sa]), changePhoneValidation, changePhone);
router.put('/updateDepartment/:id', authCheckToken, authorizeRole([sa]), departmentValidation, updatedepartment);
router.put('/updatePersonalInfo/:id', authCheckToken, authorizeRole([a, sa]), updatePersonalInfo);
router.delete('/deleteEmployee/:id', authCheckToken, authorizeRole([a, sa]), deleteEmployee);


export default router;